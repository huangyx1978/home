var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { nav } from 'tonva-tools';
import { store } from 'store';
const cacheApps = {};
export function navToAppId(appId, usqId, unitId, sheetType, sheetId) {
    return __awaiter(this, void 0, void 0, function* () {
        let app;
        let { apps } = store.unit;
        if (apps !== undefined) {
            app = store.unit.apps.find(v => v.id === appId);
        }
        if (app === undefined) {
            app = cacheApps[appId];
        }
        if (app === undefined) {
            app = yield store.getAppFromId(appId);
            cacheApps[appId] = app;
        }
        if (app === undefined) {
            alert('cannot get app from id=' + appId);
            return;
        }
        yield navToApp(app, unitId, usqId, sheetType, sheetId);
    });
}
export function navToApp(app, unitId, usqId, sheetType, sheetId) {
    return __awaiter(this, void 0, void 0, function* () {
        let { url, urlDebug } = app;
        if (url === undefined) {
            alert('APP: ' + app.name + '\n' + app.discription + '\n尚未绑定服务');
            return;
        }
        else {
            if (urlDebug !== undefined
                && document.location.hostname === 'localhost') {
                try {
                    let urlTry = urlDebug + 'manifest.json';
                    let ret = yield fetch(urlTry, {
                        method: "GET",
                        mode: "no-cors",
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
    });
}
//# sourceMappingURL=navToApp.js.map