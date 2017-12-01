import {observable} from 'mobx';
import consts from '../consts';
import mainApi from './mainApi';
import {Sticky, Tie, UnitApps, App, Api} from './model';

class MainData {
    @observable stickies: Sticky[];
    @observable ties: Tie[];
    @observable unitApps: {[id:number]:UnitApps} = {};

    logout() {
        this.stickies = undefined;
        this.ties = undefined;
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
};

export const mainData = new MainData();
