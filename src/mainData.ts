import {observable} from 'mobx';
import consts from './consts';
import mainApi from './mainApi';
import {Sticky, Tie, UnitApps, App, Api, UnitAdmin} from './model';

class MainData {
    private adminApp: App;

    @observable stickies: Sticky[];
    @observable ties: Tie[];
    @observable unitApps: {[id:number]:UnitApps} = {};
    @observable unitAdmins: UnitAdmin[] = undefined;
    @observable newFollow:number = 0;

    onWs(msg: any) {
        switch (msg.type) {
            case 'new-follow': this.newFollow = msg.count; break;
        }
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
};

export const mainData = new MainData();
