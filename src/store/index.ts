import {observable, computed} from 'mobx';
import * as _ from 'lodash';
import {PagedItems, Page} from 'tonva-tools';
import consts from '../consts';
import mainApi, { messageApi } from '../mainApi';
import {Sticky, Tie, App, Message, StickyUnit} from '../model';
import {Fellow} from './fellow';
import {CacheUsers, CacheUnits} from './cacheIds';
import me from '../main/me';

const sysUnit:StickyUnit = {
    id: 0,
    name: '同花系统',
    nick: undefined,
    discription: '同花平台',
    icon: undefined,
}

class UnitMessages extends PagedItems<Message> {
    private unit:Unit;
    @observable unread: number;

    constructor(unit:Unit) {
        super();
        this.unit = unit;
    }
    protected  async load():Promise<Message[]> {
        return await mainApi.unitMessages(this.unit.id, this.pageStart, this.pageSize);
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
        if (this.items !== undefined) {
            this.items.push(um);
        }
        if (this.unread === undefined) this.unread = 0;
        ++this.unread;
    }
}

export class Unit {
    id: number;
    name: string;
    discription: string;
    icon: string;
    isOwner: number;
    isAdmin: number;
    owner: number;
    ownerName: string;
    ownerNick: string;
    ownerIcon: string;
    @observable apps: App[];
    messages: UnitMessages;

    constructor(id:number) {
        this.id = id;
        this.messages = new UnitMessages(this);
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
        apps.unshift({
            id: 0,
            owner: 0,
            ownerName: undefined,
            ownerDiscription: undefined,
            url: undefined,
            name: '会话',
            icon: undefined,
            discription: '收到的信息',
        });
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
}

export class Store {
    private adminApp: App;

    @observable stickies: Sticky[] = [];
    //@observable ties: Tie[];
    @observable units = new Map<number, Unit>();
    @observable unit:Unit = undefined;

    cacheUsers: CacheUsers = new CacheUsers();
    cacheUnits: CacheUnits = new CacheUnits();

    fellow = new Fellow(this);

    onWs(msg: any) {
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

    logout() {
        this.stickies.splice(0, this.stickies.length);
        this.units.clear();
        this.unit = undefined;
        this.cacheUsers.dict.clear();
        this.cacheUnits.dict.clear();
        this.fellow.logout();
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
                case 3: s.obj = t4.find(v => v.id === s.objId); break;
            }
        }
        this.stickies.push(...t0);
        this.addSysUnitStick();
    }

    async setUnit(unitId: number): Promise<void> {
        let unit = this.units.get(unitId);
        if (unit === undefined) {
            unit = new Unit(unitId);
            this.units.set(unitId, unit);
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
        this.fellow.removeInvite(um);
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
            if (unit === undefined) {
                unit = new Unit(unitId);
                this.units.set(unitId, unit);
            }
            unit.messages.unread = unread;
            if (unitId === 0 && count > 0) this.addSysUnitStick();
        }
    }
};

export const store = new Store();
