import {observable, computed} from 'mobx';
import * as _ from 'lodash';
import consts from '../consts';
import mainApi, { messageApi } from '../mainApi';
import {Sticky, Tie, App, Message} from '../model';
import {Fellow} from './fellow';

const sysUnit = {
    name: '同花系统',
    discription: '同花平台',
    icon: undefined,
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
    @observable messages: Message[];
    @observable unread: number;
    constructor(id:number) {
        this.id = id;
    }

    async loadApps(): Promise<void> {
        let ret = await mainApi.apps(this.id);
        ret.apps.unshift({
            id: 0,
            owner: 0,
            ownerName: undefined,
            ownerDiscription: undefined,
            url: undefined,
            name: '会话',
            icon: undefined,
            discription: '收到的信息',
        });
        if (ret.id === 0) {
            _.assign(ret, sysUnit);
        }
        _.assign(this, ret);
    }
}

export class Store {
    private adminApp: App;

    @observable stickies: Sticky[];
    //@observable messageUnreadDict = new Map<number, number>();
    @observable ties: Tie[];
    @observable unitDict = new Map<number, Unit>();
    @observable unit:Unit = undefined;

    fellow = new Fellow(this);

    onWs(msg: any) {
        //let um = this.convertMessage(msg);
        this.processMessage(msg);
    }

    onTypeCount(type:string, count:number) {
        switch (type) {
            case 'unit-fellow-invite': this.fellow.newInvitesCount = count; break;
        }
    }
    processMessage(um:Message) {
        let toUnit = um.toUnit;
        let unit = this.unitDict[toUnit];
        if (unit === undefined) return;
        let {messages, unread} = unit;
        if (messages === undefined) {
            unit.messages = messages = [];
        }
        messages.push(um);
        if (unread === undefined) unread = 0;
        ++unread;
        unit.unread = unread;

        /*
        switch (um.type) {
            default: break;
            case 'unit-fellow-invite': this.fellow.msgUnitInvited(um); break;
            case 'unit-fellow-admin': this.msgUnitFellowAdmin(um); break;
            case 'apply-dev':
            case 'apply-unit': this.applyUnit(um); break;
        }
        */
    }
    private msgUnitFellowAdmin(um:Message) {
    }
    private applyUnit(um:Message) {
        /*
        let {toUnit} = um;
        let count = this.messageUnreadDict.get(toUnit);
        if (count === undefined || Number.isNaN(count)) count = 0;
        this.messageUnreadDict.set(toUnit, ++count);
        */
    }

    logout() {
        this.stickies = undefined;
        this.ties = undefined;
    }

    async getAdminApp():Promise<App> {
        if (this.adminApp !== undefined) return this.adminApp;
        return this.adminApp = await mainApi.adminUrl();
    }

    async loadStickies() {
        let ret = await mainApi.stickies();
        if (this.stickies === undefined) this.stickies = [];
        this.stickies.push(...ret);
        this.addRootUnitStick();
    }

    async loadTies() {
        let ret = await mainApi.ties();
        if (this.ties === undefined) this.ties = [];
        this.ties.push(...ret);
    }

    async loadApps(unitId: number): Promise<void> {
        let unit = this.unitDict.get(unitId);
        if (unit === undefined) {
            unit = new Unit(unitId);
            this.unitDict.set(unitId, unit);
        }
        if (unit.apps === undefined) {
            await unit.loadApps();
        }
        this.unit = unit;
/*
        let ret = this.unitDict[unitId];
        if (ret === undefined) {
            ret = await mainApi.apps(unitId);
            ret.apps.unshift({
                id: 0,
                owner: 0,
                ownerName: undefined,
                ownerDiscription: undefined,
                url: undefined,
                name: '会话',
                icon: undefined,
                discription: '收到的信息',
            });
            if (ret.id === 0) {
                _.assign(ret, sysUnit);
            }
            this.unit = this.unitDict[unitId] = ret;
        }
        return ret;
*/
    }

    async acceptFellowInvite(um:Message):Promise<void> {
        let sticky:Sticky = await mainApi.unitAddFellow(um.id);
        this.fellow.removeInvite(um);
        if (sticky !== undefined) this.stickies.unshift(sticky);
    }

/*
    async getAppApi(unitId: number, appId: number, apiName): Promise<Api> {
        let unit = this.unitApps[unitId];
        if (unit === undefined) return;
        let apps = unit.apps;
        if (apps === undefined) return;
        let app = apps.find(v => v.id === appId);
        if (app === undefined) return;
        let apis = app.apis;
        if (apis === undefined) {
            apis = app.apis = {};
        }
        let api:Api = apis[apiName];
        if (api === null) return;
        if (api === undefined) {
            api = await mainApi.appApi(unitId, appId, apiName);
            if (api === undefined) {
                api = null;
                apis[apiName] = api;
                return;
            }
        }
        return api;
    }

    async loadUnitAdmins(unitId: number): Promise<void> {
        this.unitAdmins = await mainApi.unitAdmins(unitId);
    }
*/
    private addRootUnitStick() {
        if (this.stickies === undefined) return;

        let sticky:Sticky;
        let index = this.stickies.findIndex(v => (v.type === 0 || v.type === 3) && v.objId === 0);
        if (index < 0) {
            let unit0 = this.unitDict[0];
            if (unit0 === undefined) return;
            let unread = unit0.unread;
            if (unread === undefined || unread === 0) return;
            sticky = {
                id: 0,
                date: undefined,
                type: 0,
                main: undefined,
                objId: 0,
                ex: undefined,
                icon: undefined,
                //unread: 0,
            };
            this.stickies.unshift(sticky);
        }
        else {
            if (index > 0) {
                sticky = this.stickies.splice(index, 1)[0];
                this.stickies.unshift(sticky);
            }
            else {
                sticky = this.stickies[0];
            }
        }

        _.assign(sticky, {
            main: sysUnit.name,
            ex: sysUnit.discription,
            icon: sysUnit.icon,
        });
}

    async loadMessageUnread(): Promise<void> {
        let ret0 = await messageApi.messageUnread();
        let len0 = ret0.length;
        for (let i=0; i<len0; i++) {
            let {unit:unitId, unread} = ret0[i];
            let unit = this.unitDict.get(unitId);
            if (unit === undefined) {
                unit = new Unit(unitId);
                this.unitDict.set(unitId, unit);
            }
            unit.unread = unread;
            //this.messageUnreadDict.set(unit, unread);
            if (unitId === 0) this.addRootUnitStick();
        }
        /*
        let ret1 = await messageApi.typeMessageCount();
        let len1 = ret1.length;
        for (let i=0; i<len1; i++) {
            let {type, count} = ret1[0];
            this.onTypeCount(type, count);
        }*/
    }
/*
    private convertMessage(msg:any):UserMessage {
        let {id, unit, type, date, message, from, fromName, fromNick, fromIcon, isNew} = msg;
        let um:UserMessage = {
            id: id,
            unit: unit,
            type: type,
            date: date,
            message: JSON.parse(message),
            from: {
                id: from,
                name: fromName,
                nick: fromNick,
                icon: fromIcon,
            },
            isNew: isNew !== 0,
        };
        return um;
    }
*/
    changeIsAdmin() {
        let apps = this.unit;
        apps.isAdmin = 1-apps.isAdmin;
        apps.isOwner = 1-apps.isOwner;
    }
    
    async unitMessages(): Promise<void> {
        /*
        let ret = await messageApi.messages();
        let userMessages:UserMessage[] = [], fellowInvites = this.fellowInvites;
        ret.forEach(v => {
            let type = v.type;
            let m = {
                id: v.id,
                type: type,
                date: v.date,
                message: JSON.parse(v.message),
                from: {
                    id: v.from,
                    name: v.fromName,
                    nick: v.fromNick,
                    icon: v.fromIcon,
                },
                read: v.read !== 0,
            };
            switch (type) {
                default: userMessages.push(m); break;
                case 'unit-fellow-invite': 
                    fellowInvites.push(m);
                    break;
            }
        });
        this.userMessages = userMessages;
        */
    }
};

export const store = new Store();
