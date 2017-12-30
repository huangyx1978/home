import {observable, computed} from 'mobx';
import consts from '../consts';
import mainApi, { messageApi } from '../mainApi';
import {Sticky, Tie, UnitApps, App, UserMessage} from '../model';
import {Fellow} from './fellow';

export class Store {
    private adminApp: App;

    @observable stickies: Sticky[];
    @observable ties: Tie[];
    @observable unitAppsDict: {[id:number]:UnitApps} = {};
    @observable unitApps:UnitApps = undefined;
    @observable userMessages: UserMessage[] = undefined;

    fellow = new Fellow(this);

    onWs(msg: any) {
        let um = this.convertMessage(msg);
        this.processMessage(um);
    }

    onTypeCount(type:string, count:number) {
        switch (type) {
            case 'unit-fellow-invite': this.fellow.newInvitesCount = count; break;
        }
    }
    processMessage(um:UserMessage) {
        switch (um.type) {
            default: break;
            case 'unit-fellow-invite': this.fellow.msgUnitInvited(um); break;
            case 'unit-fellow-admin': this.msgUnitFellowAdmin(um); break;
        }
    }

    private msgUnitFellowAdmin(um:UserMessage) {        
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
    }

    async loadTies() {
        let ret = await mainApi.ties();
        if (this.ties === undefined) this.ties = [];
        this.ties.push(...ret);
    }

    async loadApps(unit: number): Promise<UnitApps> {
        let ret = this.unitAppsDict[unit];
        if (ret === undefined) {
            this.unitApps = this.unitAppsDict[unit] = ret = await mainApi.apps(unit);
        }
        return ret;
    }

    async acceptFellowInvite(um:UserMessage):Promise<void> {
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
    async loadMessageCount(): Promise<void> {
        let ret0 = await messageApi.unitMessageCount();
        let len0 = ret0.length;
        for (let i=0; i<len0; i++) {
        }

        let ret1 = await messageApi.typeMessageCount();
        let len1 = ret1.length;
        for (let i=0; i<len1; i++) {
            let {type, count} = ret1[0];
            this.onTypeCount(type, count);
        }
    }

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


    changeIsAdmin() {
        //thisunitApps = this.unitAppsDict[unitId];
        this.unitApps.isAdmin = 0;
        this.unitApps.isOwner = 0;
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
