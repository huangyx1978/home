import {observable, computed} from 'mobx';
import consts from '../consts';
import mainApi, { messageApi } from '../mainApi';
import {Sticky, Tie, UnitApps, App, UserMessage} from '../model';

class MainData {
    private adminApp: App;

    @observable stickies: Sticky[];
    @observable ties: Tie[];
    @observable unitApps: {[id:number]:UnitApps} = {};
    @observable userMessages: UserMessage[] = undefined;
    @observable fellowInvites: UserMessage[] = [];
    @observable fellowArchivedInvites: UserMessage[] = undefined;
    @computed get newFellowInvitesCount():number {return this.fellowInvites.length;}

    onWs(msg: any) {
        this.onMessage(msg, true);
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
        let ret = this.unitApps[unit];
        if (ret === undefined) {
            this.unitApps[unit] = ret = await mainApi.apps(unit);
        }
        return ret;
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
    async loadMessages(): Promise<void> {
        let ret = await messageApi.messages();
        let len = ret.length;
        for (let i=0; i<len; i++) {
            let {unit, count} = ret[0];
            if (unit === 0) {
                await this.sysMessages(count);
            }
        }
    }

    private async sysMessages(count:number) {
        if (count === 0) return;
        let ret = await messageApi.unitMessages(0);
        ret.forEach(v => this.onMessage(v, true));
    }

    private onMessage(msg:any, isNew:boolean) {
        let {id, unit, type, date, message, from, fromName, fromNick, fromIcon} = msg;
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
            isNew: isNew,
        }
        if (type==='unit-fellow-invite') {
            if (isNew === true) {
                if (this.fellowInvites.find(v => v.id === um.id) === undefined) {
                    this.fellowInvites.push(um);
                }
            }
            else {
                this.fellowArchivedInvites.push(um);
            }
        }
    }

    async loadFellowInvites(): Promise<void> {
        if (this.fellowArchivedInvites === undefined) {
            this.fellowArchivedInvites = [];
            let ret = await mainApi.unitArchived(0);
            ret.forEach(v => this.onMessage(v, false));
        }
        let ids = this.fellowInvites.map(v => v.id);
        await messageApi.readMessages(ids);
        this.fellowInvites.forEach(v => {
            let index = this.fellowArchivedInvites.findIndex(av => av.from.id === v.from.id);
            if (index >= 0) this.fellowArchivedInvites.splice(index, 1);
            this.fellowArchivedInvites.push(...this.fellowInvites);
        });
        this.fellowInvites.splice(0);
    }

    async acceptFellowInvite(um:UserMessage):Promise<void> {
        await mainApi.unitAddFellow(um.id);
        this.removeFellowInvite(um);
    }

    async refuseFellowInvite(um:UserMessage):Promise<void> {
        await mainApi.removeMessage(um.id);
        this.removeFellowInvite(um);
    }
    private removeFellowInvite(um:UserMessage) {
        let index = this.fellowArchivedInvites.findIndex(v => v.id === um.id);
        this.fellowArchivedInvites.splice(index, 1);
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

export const mainData = new MainData();
