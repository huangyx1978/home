import { nav, getUrlOrDebug } from 'tonva-tools';
import { App } from 'model';
import { store } from 'store';

const cacheApps:{[id:number]: App} = {};

export async function navToAppId(appId: number, usqId:number, unitId:number, sheetType?:number, sheetId?:number) {
    let app:App;
    let {apps} = store.unit;
    if (apps !== undefined) {
        app = store.unit.apps.find(v => v.id === appId);
    }
    if (app === undefined) {
        app = cacheApps[appId];
    }
    if (app === undefined) {
        app = await store.getAppFromId(appId);
        cacheApps[appId] = app;
    }
    if (app === undefined) {
        alert('cannot get app from id=' + appId);
        return;
    }
    await navToApp(app, unitId, usqId, sheetType, sheetId);
}

export async function navToApp(app:App, unitId:number, usqId?:number, sheetType?:number, sheetId?:number) {
    let {url, urlDebug} = app;
    if (!url) {
        alert('APP: ' + app.name + '\n' + app.discription + '\n尚未绑定服务');
        return;
    }
    let adminUrl = await getUrlOrDebug(url, urlDebug, '');
    app.url = adminUrl;
    app.urlDebug = undefined;
    nav.navToApp(adminUrl, unitId, usqId, sheetType, sheetId);
}
