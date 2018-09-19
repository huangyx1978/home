var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { observer } from 'mobx-react';
import { List, LMR, Badge, EasyDate } from 'tonva-react-form';
import { meInFrame } from 'tonva-tools';
import consts from '../consts';
import { store } from '../store';
import { CrUnitxUsq } from 'unitx/crUnitxUsq';
import { CrMessages } from 'messages';
import { navToApp } from 'navToApp';
let Home = class Home extends React.Component {
    constructor() {
        super(...arguments);
        this.stickyClick = (item) => __awaiter(this, void 0, void 0, function* () {
            let objId = item.objId;
            if (objId === 0) {
                let crMessages = new CrMessages();
                yield crMessages.start();
                return;
            }
            let unitId = objId;
            meInFrame.unit = unitId;
            yield store.setUnit(unitId);
            if (store.unit.type === 1) {
                // dev clicked
                let adminApp = yield store.getAdminApp();
                navToApp(adminApp, unitId);
                return;
            }
            let crUnitxUsq = new CrUnitxUsq(store.unit);
            yield crUnitxUsq.start();
        });
        this.stickyRender = (s, index) => {
            let { type, date, objId, obj } = s;
            let unread;
            let unit = store.units.get(objId);
            if (unit !== undefined) {
                unread = unit.unread;
                date = unit.date;
                //unread = messages === undefined? 0 : messages.unread;
            }
            switch (type) {
                case 3:
                    if (obj === undefined)
                        return;
                    return this.stickyUnit(date, obj, unread);
                case 0:
                    if (obj === undefined)
                        return;
                    return this.stickyUnit(date, obj, unread);
            }
        };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.loadStickies();
        });
    }
    stickyUnit(date, unit, unread) {
        let { name, nick, discription, icon, date: uDate } = unit;
        return React.createElement(LMR, { className: "px-3 py-2", left: React.createElement(Badge, { badge: unread || unit.unread },
                React.createElement("img", { src: icon || consts.appItemIcon })), right: React.createElement("small", { className: "text-muted" },
                React.createElement(EasyDate, { date: date })) },
            React.createElement("div", { className: "px-3" },
                React.createElement("div", null,
                    React.createElement("b", null, nick || name)),
                React.createElement("div", { className: "small text-muted" }, discription)));
    }
    render() {
        let stickies = store.stickies;
        return React.createElement("div", null,
            React.createElement(List, { items: stickies, item: { render: this.stickyRender, onClick: this.stickyClick }, loading: "\u8BFB\u53D6..." }));
    }
};
Home = __decorate([
    observer
], Home);
export default Home;
//# sourceMappingURL=home.js.map