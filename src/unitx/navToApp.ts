import { nav } from 'tonva-tools';
import { App } from '../model';
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
    if (url === undefined) {
        alert('APP: ' + app.name + '\n' + app.discription + '\n尚未绑定服务');
        return;
    }
    else {
        if (urlDebug !== undefined
            && document.location.hostname === 'localhost')
        {
            try {
                let urlTry = urlDebug + 'manifest.json';
                let ret = await fetch(urlTry, {
                    method: "GET",
                    mode: "no-cors", // no-cors, cors, *same-origin
                    headers: {
                        "Content-Type": "text/plain"
                    },
                });
                url = urlDebug;
                app.url = urlDebug;
                app.urlDebug = undefined;
                console.log('urlDebug %s is ok', urlDebug);
            }
            catch (err) {
                console.log('urlDebug %s not run, use %s', urlDebug, url);
            }
        }
        nav.navToApp(url, unitId, usqId, sheetType, sheetId);
    }
}
