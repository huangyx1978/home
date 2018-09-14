var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { Button } from 'reactstrap';
import { nav } from 'tonva-tools';
import { List, LMR, Badge } from 'tonva-react-form';
import consts from '../consts';
import { store } from '../store';
//import { MainPage } from './main';
import { navToApp } from './navToApp';
import { VmView } from 'tonva-react-usql';
//@observer
export class AppsPage extends VmView {
    constructor() {
        super(...arguments);
        this.unleash = () => __awaiter(this, void 0, void 0, function* () {
            if (confirm("真的要取消关注吗？") === false)
                return;
            yield store.unfollowUnit();
            nav.pop();
        });
        this.rightMenu = [
            {
                caption: '取消关注',
                icon: 'trash',
                action: this.unleash,
            }
        ];
        this.appClick = (app) => __awaiter(this, void 0, void 0, function* () {
            let unitId = store.unit.id;
            let appId = app.id;
            if (appId === 0) {
                //let api = new Api(undefined, undefined, undefined, undefined);
                /*
                let unitx = await store.unit.unitx;
                if (await unitx.load() === false) {
                    alert('chat api 创建出错');
                    return;
                }
                //nav.push(<MainPage />);
                nav.push(<>unitx MainPage</>);
                */
            }
            else {
                yield navToApp(app, unitId);
            }
        });
        this.renderRow = (app, index) => {
            let { id: appId, name, icon, discription } = app;
            let unread = undefined;
            if (appId === 0) {
                unread = store.unit.messages.unread;
                //let dict = store.messageUnreadDict;
                //unread = dict.get(unit);
            }
            return React.createElement(LMR, { className: "p-2", left: React.createElement(Badge, { badge: unread },
                    React.createElement("img", { src: icon || consts.appItemIcon })) },
                React.createElement("b", null, name),
                React.createElement("small", { className: "text-muted" }, discription));
        };
        this.clickToAdmin = () => __awaiter(this, void 0, void 0, function* () {
            let adminApp = yield store.getAdminApp();
            let unitId = store.unit.id;
            navToApp(adminApp, unitId);
        });
    }
    componentWillMount() {
        return __awaiter(this, void 0, void 0, function* () {
            let { unit } = store;
            if (unit.apps === undefined) {
                yield unit.loadApps();
            }
        });
    }
    render() {
        let { id, name, discription, apps, icon, ownerName, ownerNick, isOwner, isAdmin } = store.unit;
        if (ownerNick !== undefined)
            ownerNick = '- ' + ownerNick;
        let enterAdmins;
        if (isOwner === 1 || isAdmin === 1) {
            enterAdmins = React.createElement(Button, { color: "success align-self-start", size: "sm", onClick: () => this.clickToAdmin() }, "\u8FDB\u5165\u7BA1\u7406");
        }
        let appsView;
        if (apps !== undefined) {
            appsView = React.createElement(List, { items: apps, item: { render: this.renderRow, onClick: this.appClick } });
        }
        return React.createElement("div", null,
            React.createElement("div", { className: "my-3 container-fluid" },
                React.createElement("div", { className: "row no-gutters" },
                    React.createElement("div", { className: "col-sm-2" },
                        React.createElement("img", { src: icon || consts.appItemIcon })),
                    React.createElement("div", { className: "col-sm-8" },
                        React.createElement("div", { className: "row" },
                            React.createElement("h5", { className: "col-sm-12" }, name)),
                        React.createElement("div", { className: "row" },
                            React.createElement("label", { className: "col-sm-3" }, "\u7B80\u4ECB\uFF1A"),
                            React.createElement("div", { className: "col-sm-9" }, discription || '无')),
                        React.createElement("div", { className: "row" },
                            React.createElement("label", { className: "col-sm-3" }, "\u53D1\u5E03\u8005\uFF1A"),
                            React.createElement("div", { className: "col-sm-9" },
                                ownerName,
                                " ",
                                ownerNick))),
                    React.createElement("div", { className: "col-sm-2 d-flex justify-content-end" }, enterAdmins))),
            appsView);
    }
}
//# sourceMappingURL=apps.js.map