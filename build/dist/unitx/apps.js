var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { nav, View } from 'tonva-tools';
import { List, LMR, Badge, Muted } from 'tonva-react-form';
import consts from '../consts';
import { store } from '../store';
import { navToApp } from 'navToApp';
//@observer
export class AppsPage extends View {
    constructor() {
        //protected controller: CrUnitxUsq;
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
            let unitId = this.controller.unit.id;
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
                unread = this.controller.unit.messages.unread;
                //let dict = store.messageUnreadDict;
                //unread = dict.get(unit);
            }
            return React.createElement(LMR, { className: "px-3 py-2", left: React.createElement(Badge, { badge: unread },
                    React.createElement("img", { src: icon || consts.appItemIcon })) },
                React.createElement("div", { className: "px-3" },
                    React.createElement("div", null,
                        React.createElement("b", null, name)),
                    React.createElement("small", { className: "text-muted" }, discription)));
        };
        this.clickToAdmin = () => __awaiter(this, void 0, void 0, function* () {
            let adminApp = yield store.getAdminApp();
            let unitId = this.controller.unit.id;
            navToApp(adminApp, unitId);
        });
    }
    render() {
        let { id, name, discription, apps, icon, ownerName, ownerNick, isOwner, isAdmin } = this.controller.unit;
        if (ownerNick)
            ownerNick = '- ' + ownerNick;
        let enterAdmins;
        if (isOwner === 1 || isAdmin === 1) {
            enterAdmins = React.createElement("button", { className: "btn btn-success btn-sm align-self-start", onClick: () => this.clickToAdmin() }, "\u8FDB\u5165\u7BA1\u7406");
        }
        let appsView;
        if (apps !== undefined) {
            appsView = React.createElement(List, { items: apps, item: { render: this.renderRow, onClick: this.appClick } });
        }
        let divImg = React.createElement("div", { className: "mr-3" },
            React.createElement("img", { src: icon || consts.appItemIcon }));
        return React.createElement("div", null,
            React.createElement(LMR, { className: "my-3 container-fluid", left: divImg, right: enterAdmins },
                React.createElement("div", { className: "row" },
                    React.createElement("h6", { className: "col-12" }, name)),
                React.createElement("div", { className: "row" },
                    React.createElement("label", { className: "small text-dark col-3" }, "\u7B80\u4ECB\uFF1A"),
                    React.createElement("div", { className: "col-9" }, discription || React.createElement(Muted, null, "\u65E0"))),
                React.createElement("div", { className: "row" },
                    React.createElement("label", { className: "small text-dark col-3" }, "\u53D1\u5E03\u8005\uFF1A"),
                    React.createElement("div", { className: "col-9" },
                        ownerName,
                        " ",
                        ownerNick))),
            appsView);
    }
}
//# sourceMappingURL=apps.js.map