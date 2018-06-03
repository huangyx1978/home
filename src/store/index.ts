import {observable, computed} from 'mobx';
import * as _ from 'lodash';
import {PagedItems, Page, ChatApi, AppApi} from 'tonva-tools';
import consts from '../consts';
import mainApi, { messageApi } from '../mainApi';
import {Sticky, Tie, App, Message, StickyUnit} from '../model';
import {Fellow} from './fellow';
import {CacheUsers, CacheUnits} from './cacheIds';
import me from '../main/me';
import { Entities, Query } from 'tonva-react-usql-entities';
import {Chat} from './chat';
export * from './templet';
export * from './sysTemplets';

const sysUnit:StickyUnit = {
    id: 0,
    name: '同花系统',
    nick: undefined,
    discription: '同花平台',
    icon: undefined,
}

export class UnitMessages extends PagedItems<Message> {
    private unit:Unit;
    private query:Query;
    @observable unread: number;

    constructor(unit:Unit, query:Query) {
        super();
        this.unit = unit;
        this.query = query;
        this.appendPosition = 'head';
        if (query !== undefined) query.resetPage(30, {});
    }
    protected  async load():Promise<Message[]> {
        await this.query.loadPage();
        return this.query.list;
    }
    protected setPageStart(item:Message) {
        if (item === undefined)
            this.pageStart = undefined;
        else
            this.pageStart = item.id;
    }
    end(id:number, state:number) {
        let item = this.items.find(v => v.id === id);
        if (item === undefined) return;
        item.state = state;
    }
    remove(id:number) {
        let index = this.items.findIndex(v => v.id === id);
        if (index>=0) this.items.splice(index, 1);
    }
    addMessage(um:Message) {
        this.remove(um.id);
        this.append(um);
        if (this.unread === undefined) this.unread = 0;
        ++this.unread;
    }
}

export class Unit {
    id: number;
    name: string;
    discription: string;
    nick: string;
    icon: string;
    isOwner: number;
    isAdmin: number;
    owner: number;
    ownerName: string;
    ownerNick: string;
    ownerIcon: string;
    @observable apps: App[];
    messages: UnitMessages;
    chat: Chat;

    constructor(id:number) {
        this.id = id;
        this.messages = new UnitMessages(this, undefined);
        this.chat = new Chat(this);
    }

    async loadProps(): Promise<void> {
        let ret = await mainApi.unitBase(this.id);
        if (ret === undefined) return;
        let {name, discription, icon, nick, isOwner, isAdmin, owner, ownerName, ownerNick, ownerIcon} = ret;
        this.name = name;
        this.discription = discription;
        this.nick = nick;
        this.icon = icon;
        this.isOwner = isOwner;
        this.isAdmin = isAdmin;
        this.owner = owner;
        this.ownerName = ownerName;
        this.ownerNick = ownerNick;
        this.ownerIcon = ownerIcon;
    }

    async loadApps(): Promise<void> {
        let apps:App[];
        let ret = await mainApi.apps(this.id);
        if (ret === undefined) {
            apps = [];
        }
        else {
            apps = ret.apps;
        }
        /*
        apps.unshift({
            id: 0,
            owner: 0,
            ownerName: undefined,
            ownerDiscription: undefined,
            url: undefined,
            name: '会话',
            icon: undefined,
            discription: '收到的信息',
        });*/
        if (ret === undefined || ret.id === 0) {
            _.assign(ret, sysUnit);
        }
        else {
            _.assign(this, ret);
        }
        this.apps = apps;
    }

    async loadMessages(): Promise<void> {
        await mainApi.readMessages(this.id);
        this.messages.unread = 0;
        if (this.messages.items !== undefined) return;
        await this.messages.first(undefined);
    }

    async messageAct(id:number, action:'approve'|'refuse') {
        await mainApi.actMessage({unit:this.id, id:id, action:action});
    }
    /*
    dispose() {
        if (this.chat === undefined) return;
        this.chat.dispose();
    }*/
}

export class Store {
    private adminApp: App;
    private static maxUnitCount = 2;
    private unitArray:Unit[] = [];

    @observable stickies: Sticky[] = [];
    @observable units = new Map<number, Unit>();
    @observable unit:Unit = undefined;

    cacheUsers: CacheUsers = new CacheUsers();
    cacheUnits: CacheUnits = new CacheUnits();

    follow = new Fellow(this);

    async onWs(msg: any) {
        let {$unit} = msg;
        this.units.forEach(async (unit, k) => {
            if ($unit !== unit.id) return;
            let {chat} = unit;
            if (chat !== undefined) await chat.onWsMsg(msg);
        });
        //let um = this.convertMessage(msg);
        if (msg.id === undefined) {
            // msgId=0，则是发送给界面的操作指令
            this.processCommand(msg);
            return;
        }
        this.processMessage(msg);
    }

    private processCommand(cmd:Message) {
        let {type, content} = cmd;
        switch (type) {
            default: alert(JSON.stringify(cmd)); break;
            case 'message-end': this.messageEnd(content); break;
            case 'message-removed': this.messageRemoved(content); break;
        }
    }
    private messageEnd(content:any) {
        let {id, unit, state} = content;
        let u = this.units.get(unit);
        if (u === undefined) return;
        u.messages.end(id, state);
    }
    private messageRemoved(content:any) {
        let {id, unit} = content;
        this.removeMessage(unit, id);
    }
    private removeMessage(unit:number, msgId:number) {
        let u = this.units.get(unit);
        if (u === undefined) return;
        u.messages.remove(msgId);
    }
    private processMessage(um:Message) {
        let toUnit = um.toUnit;
        let unit = this.units.get(toUnit);
        if (unit === undefined) return;
        unit.messages.addMessage(um);
    }
    //private disposeUnits() {
        /*
        this.units.forEach(v => {
            v.dispose();
        });*/
        //this.units.clear();
    //}

    logout() {
        this.stickies.splice(0, this.stickies.length);
        //this.disposeUnits();
        this.units.clear();
        this.unit = undefined;
        this.cacheUsers.dict.clear();
        this.cacheUnits.dict.clear();
        this.follow.logout();
    }

    async getAdminApp():Promise<App> {
        if (this.adminApp !== undefined) return this.adminApp;
        return this.adminApp = await mainApi.adminUrl();
    }

    async loadStickies() {
        let ret = await mainApi.stickies();
        //if (this.stickies === undefined) this.stickies = [];
        let t0:Sticky[] = ret[0];
        let t4 = ret[4];
        for (let s of t0) {
            switch (s.type) {
                case 3: 
                    let u = s.obj = t4.find(v => v.id === s.objId);
                    let id = u.id;
                    let unit = new Unit(id);
                    unit.name = u.name;
                    unit.discription = u.discription;
                    unit.icon = u.icon;
                    this.units.set(id, unit);
                    break;
            }
        }
        this.stickies.push(...t0);
        this.addSysUnitStick();
    }

    async newUnit(unitId:number):Promise<Unit> {
        let unit = new Unit(unitId);
        await unit.loadProps();
        this.units.set(unitId, unit);
        this.unitArray.unshift(unit);
        if (this.unitArray.length > Store.maxUnitCount) {
            let u = this.unitArray.pop();
            this.units.delete(u.id);
        }
        return unit;
    }

    async setUnit(unitId: number): Promise<void> {
        let unit = this.units.get(unitId);
        if (unit === undefined) {
            unit = await this.newUnit(unitId);
        }
        else {
            let index = this.unitArray.findIndex(v => v === unit);
            if (index > 0) {
                this.unitArray.splice(index, 1);
                this.unitArray.unshift(unit);
            }
        }
        if (unit.apps === undefined) {
            await unit.loadApps();
        }
        this.unit = unit;
    }

    async unitCreate(name:string, msgId:number):Promise<number> {
        let ret = await mainApi.unitCreate(name, msgId);
        let {unit, sticky, removedMessages} = ret;
        if (removedMessages !== undefined) {
            for (let rm of removedMessages) {
                let {message, user, unit} = rm;
                this.removeMessage(unit, message);
            }
        }
        if (sticky !== undefined) {
            let stickUnit:StickyUnit = {
                id: unit,
                name: name,
                nick: undefined,
                discription: undefined,
                icon: undefined,
            };
            this.stickies.push({
                id: sticky,
                date: new Date,
                type: 3,
                //main: name,
                objId: unit,
                obj: stickUnit,
                //ex: undefined,
                //icon: undefined,
            });
        }
        return unit;
    }

    async acceptFellowInvite(um:Message):Promise<void> {
        let sticky:Sticky = await mainApi.unitAddFellow(um.id);
        this.follow.removeInvite(um);
        if (sticky !== undefined) this.stickies.unshift(sticky);
    }

    private addSysUnitStick() {
        //if (this.stickies === undefined) this.stickies = []; // return;

        let index = this.stickies.findIndex(v => (v.type === 0 || v.type === 3) && v.objId === 0);
        if (index < 0) {
            let unit0 = this.units.get(0);
            if (unit0 === undefined) return;
            let {name, discription, icon} = sysUnit;
            this.stickies.unshift({
                id: 0,
                date: new Date,
                type: 0,
                //main: name,
                objId: 0,
                obj: sysUnit,
                //ex: discription,
                //icon: icon,
            });
            return;
        }
        if (index > 0) {
            let sticky = this.stickies.splice(index, 1)[0];
            this.stickies.unshift(sticky);
        }
    }

    async loadMessageUnread(): Promise<void> {
        let ret = await messageApi.messageUnread();
        let len = ret.length;
        for (let i=0; i<len; i++) {
            let {unit:unitId, unread, count} = ret[i];
            let unit = this.units.get(unitId);
            if (unit === undefined) unit = await this.newUnit(unitId);
            unit.messages.unread = unread;
            if (unitId === 0 && count > 0) this.addSysUnitStick();
        }
    }

    async followUnit(unitId:number) {//, name:string, nick:string, discription:string, icon:string) {
        let stickyId = await mainApi.searchUnitsFollow(unitId);
        let unit = this.units.get(unitId);
        if (unit === undefined) {
            unit = await this.newUnit(unitId);
        }
        else {
            unit.apps = undefined;
        }
        //unit.name = name;
        //unit.nick = nick;
        //unit.discription = discription;
        //unit.icon = icon;
        this.stickies.unshift({
            id: stickyId,
            date: new Date(),
            type: 3,
            objId: unitId,
            obj: unit
        });
    }

    async unfollowUnit() {
        if (this.unit === undefined) return;
        this.unit.apps = undefined;
        let unitId = this.unit.id;
        await mainApi.unitNotFollow(unitId);
        let index = this.stickies.findIndex(v => v.objId === unitId);
        if (index < 0) return;
        this.stickies.splice(index, 1);
    }

};

export const store = new Store();
