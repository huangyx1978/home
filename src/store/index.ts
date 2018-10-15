import {observable, computed} from 'mobx';
import * as _ from 'lodash';
import {PagedItems, Page, UnitxApi, CacheIds} from 'tonva-tools';
import { Entities, Query, Tuid, IdBox } from 'tonva-react-usql';
import consts from 'consts';
import mainApi, { messageApi } from 'mainApi';
import {Sticky, Tie, App, Message, StickyUnit} from 'model';
import {Fellow} from './fellow';
import {CacheUsers, CacheUnits} from './cacheIds';
//import {Unitx} from './unitx';
export * from './templet';
export * from './sysTemplets';

const sysUnit:StickyUnit = {
    id: 0,
    name: '同花系统',
    nick: undefined,
    discription: '同花平台',
    icon: undefined,
    date: undefined,
}

export interface Item {
    message: IdBox; // number;
    branch: number;
    done: number;
    prevState: string;
    state: string;
    flow?: number;  // 如果undefined，则不是我当下需要处理的
}
export class Folder<T extends Item> extends PagedItems<T> {
    private unit:Unit;
    private query:Query;
    @observable undone:number;
    @observable doing:number;

    constructor(unit:Unit, query:Query) {
        super(true);
        this.unit = unit;
        this.query = query;
        this.appendPosition = 'head';
        //if (query !== undefined) query.resetPage(30, {});
    }
    protected  async load():Promise<T[]> {
        await this.query.loadSchema();
        let ret = await this.query.page(this.param, this.pageStart, this.pageSize);
        //let arr = ret['$page'];
        return ret;
    }
    protected setPageStart(item:T) {
        if (item === undefined)
            this.pageStart = undefined;
        else
            this.pageStart = item.message;
    }
    remove(id:number) {
        let item = this._items.find(v => v.message.id === id);
        if (item !== undefined) this.items.remove(item);
    }
    updateItem(item:T, doneDelete: boolean = true) {
        let {message, branch, done, flow, prevState, state} = item;
        if (this.loaded === true) {
            let index = this._items.findIndex(v => v.message === message);
            if (index < 0) {
                if (done === undefined || done < branch) {
                    this.append(item);
                    this.undone++;
                }
            }
            else {
                let _item = this._items[index];
                if (doneDelete === true) {
                    if (done >= branch) {
                        item.done = done;
                        this.undone--;
                        this._items.splice(index, 1);
                    }
                }
                _item.branch = branch;
                _item.done = done;
                _item.flow = flow;
            }
        }
        else {
            if (done<branch) this.undone++;
            else this.undone--;
        }
        if (state.startsWith('#')) this.doing--;
        if (!prevState) this.doing++;
}
/*
    done(id:number) {
        let index = this._items.findIndex(v => v.id === id);
        if (index < 0) return;
        let item = this._items[index];
        if (item === undefined) return;
        let {done, branch} = item;
        ++done;
        this.doing--;
        if (done >= branch) {
            item.done = done;
            this.undone--;
            this._items.splice(index, 1);
        }
    }
*/
    /*
    changeState(id:number, branch:number, done:number) {
        let item = this._items.find(v => v.id === id);
        if (item === undefined) return;
        item.branch = branch;
        item.done = done;
    }*/
}

export interface DeskItem extends Item {
    read: number;
    //state: string;
}
export class Desk extends Folder<DeskItem> {
    @observable unread: number;
    updateItem(item:DeskItem) {
        super.updateItem(item);
        if (this.loaded === true) {
            if (this.unread === undefined) this.unread = 0;
            ++this.unread;
        }
    }
}

export interface SendFolderItem extends Item {
}
export class SendFolder extends Folder<SendFolderItem> {
}

export interface PassFolderItem extends Item {
}
export class PassFolder extends Folder<PassFolderItem> {
}

export interface CcFolderItem extends Item {
}
export class CcFolder extends Folder<CcFolderItem> {
}

export interface AllFolderItem extends Item {
}
export class AllFolder extends Folder<AllFolderItem> {
}

export class UnitMessages extends PagedItems<Message> {
    private unit:Unit;
    private query:Query;
    @observable unread: number;

    constructor(unit:Unit, query:Query) {
        super(true);
        this.unit = unit;
        this.query = query;
        this.appendPosition = 'head';
        //if (query !== undefined) query.resetPage(30, {});
    }
    protected  async load():Promise<Message[]> {
        //await this.query.loadPage();
        await this.query.loadSchema();
        let ret = await this.query.page(this.param, this.pageStart, this.pageSize);
        return ret['$page'];
        //return this.query.list;
    }
    protected setPageStart(item:Message) {
        if (item === undefined)
            this.pageStart = undefined;
        else
            this.pageStart = item.id;
    }
    end(id:number) {
        let item = this.items.find(v => v.id === id);
        if (item === undefined) return;
        //item.state = '#';
    }
    remove(id:number) {
        let item = this.items.find(v => v.id === id);
        if (item !== undefined) this.items.remove(item);
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
    type: number; // 1=dev, 2=unit, 3=dev & unit
    name: string;
    discription: string;
    nick: string;
    icon: string;
    private _isOwner:number;
    get isOwner(): number {return this._isOwner;}
    set isOwner(value:number) {
        this._isOwner=value;
    }
    private _isAdmin:number;
    get isAdmin(): number {return this._isAdmin;}
    set isAdmin(value:number) {
        this._isAdmin = value;
    }
    owner: number;
    ownerName: string;
    ownerNick: string;
    ownerIcon: string;
    @observable apps: App[];
    @observable unread: number;
    @observable date: Date;
    messages: UnitMessages;
    //unitx: Unitx;

    constructor(id:number) {
        this.id = id;
        this.messages = new UnitMessages(this, undefined);
        //this.unitx = new Unitx(this);
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
        if (ret === undefined) {
            ret = {};
            _.assign(ret, sysUnit);
        }
        else if (ret.id === 0) {
            _.assign(ret, sysUnit);
        }
        _.assign(this, ret);
        this.apps = apps;
    }

    async loadMessages(): Promise<void> {
        mainApi.readMessages(this.id);
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

    @observable stickies: Sticky[];
    @observable units = new Map<number, Unit>();
    @observable unit:Unit = undefined;

    cacheUsers: CacheUsers = new CacheUsers();
    cacheUnits: CacheUnits = new CacheUnits();

    follow = new Fellow(this);

    async onWs(msg: any) {
        let {$unit, $io} = msg;
        let now = new Date;
        this.units.forEach(async (unit, k) => {
            if ($unit !== unit.id) return;
            if (unit !== this.unit) {
                unit.unread += $io;
                unit.date = now;
            }
            //let {unitx} = unit;
            //if (unitx !== undefined) await unitx.onWsMsg(msg);
        });
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
            //default: alert(JSON.stringify(cmd)); break;
            case 'message-end': this.messageEnd(content); break;
            case 'message-removed': this.messageRemoved(content); break;
        }
    }
    private messageEnd(content:any) {
        let {id, unit, state} = content;
        let u = this.units.get(unit);
        if (u === undefined) return;
        u.messages.end(id);
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
        /*
        let toUnit = um.toUnit;
        let unit = this.units.get(toUnit);
        if (unit === undefined) return;
        unit.messages.addMessage(um);
        */
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

    async getAppFromId(appId:number):Promise<App> {
        return await mainApi.appFromId(appId);
    }

    async loadStickies() {
        let stickies = [];
        let ret = await mainApi.stickies();
        //if (this.stickies === undefined) this.stickies = [];
        let t0:Sticky[] = ret[0];
        let t4 = ret[4];
        for (let s of t0) {
            switch (s.type) {
                case 3: 
                    let u = s.obj = t4.find(v => v.id === s.objId);
                    let {id, type, name, discription, icon, unread, date, owner} = u;
                    let unit = new Unit(id);
                    unit.type = type;
                    unit.name = name;
                    unit.discription = discription;
                    unit.icon = icon;
                    unit.unread = unread;
                    unit.date = date;
                    unit.owner = owner;
                    this.units.set(id, unit);
                    break;
            }
        }
        stickies.push(...t0);
        let sys = ret[5][0];
        if (sys !== undefined) {
            let {unread, date} = sys;
            this.addSysUnitStick(stickies, unread, date);
        }
        this.stickies = stickies;
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
        this.unit = unit;
    }

    async setUnitRead() {
        let {unread, id} = this.unit;
        if (unread > 0) {
            await messageApi.messageRead(id);
            this.unit.unread = 0;
        }
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
                date: undefined,
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

    private addSysUnitStick(stickies: Sticky[], unread:number, date:Date) {
        if (unread === undefined || unread <= 0) return;
        /*
        let unit0 = this.units.get(0);
        if (unit0 === undefined) {
            unit0 = _.clone(sysUnit) as any;
        }
        unit0.unread = unread;
        unit0.date = date;
        this.stickies.unshift({
            id: 0,
            date: date,
            type: 0,
            objId: 0,
            obj: unit0,
        });
        return;
        */
        let index = stickies.findIndex(v => (v.type === 0 || v.type === 3) && v.objId === 0);
        if (index < 0) {
            //let unit0 = this.units.get(0);
            //if (unit0 === undefined) return;
            let sticky:StickyUnit = _.clone(sysUnit);
            sticky.unread = unread;
            //let {name, discription, icon} = sysUnit;
            stickies.unshift({
                id: 0,
                date: new Date,
                type: 0,
                //main: name,
                objId: 0,
                obj: sticky,
                //ex: discription,
                //icon: icon,
            });
            return;
        }
        if (index > 0) {
            let sticky = stickies.splice(index, 1)[0];
            stickies.unshift(sticky);
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
