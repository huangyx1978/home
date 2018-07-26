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
import { nav } from 'tonva-tools';
import consts from 'consts';
import { store } from 'store';
import { MainPage } from 'chat';
let Home = class Home extends React.Component {
    constructor(props) {
        super(props);
        this.stickyClick = this.stickyClick.bind(this);
        this.stickyRender = this.stickyRender.bind(this);
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.loadStickies();
        });
    }
    stickyClick(item) {
        return __awaiter(this, void 0, void 0, function* () {
            let objId = item.objId;
            yield store.setUnit(objId);
            //nav.push(<TieApps />);
            let chat = yield store.unit.unitx;
            if ((yield chat.load()) === false) {
                alert('chat api 创建出错');
                return;
            }
            nav.push(React.createElement(MainPage, null));
            nav.regConfirmClose(() => __awaiter(this, void 0, void 0, function* () {
                store.setUnitRead();
                return true;
            }));
        });
    }
    stickyRender(s, index) {
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
        /*
        let unread:number;
        if (type === 0 || type === 3) { // unit
        }
        return <LMR className="p-2"
            left={<Badge badge={unread}><img src={icon || consts.appItemIcon} /></Badge>}
            right={<small className="text-muted"><EasyDate date={date} /></small>}
        >
            <b>{main}</b>
            <small className="text-muted">{ex}</small>
        </LMR>;
        */
    }
    stickyUnit(date, unit, unread) {
        let { name, nick, discription, icon, date: uDate } = unit;
        return React.createElement(LMR, { className: "p-2", left: React.createElement(Badge, { badge: unread },
                React.createElement("img", { src: icon || consts.appItemIcon })), right: React.createElement("small", { className: "text-muted" },
                React.createElement(EasyDate, { date: date })) },
            React.createElement("b", null, nick || name),
            React.createElement("small", { className: "text-muted" }, discription));
    }
    render() {
        let stickies = store.stickies;
        return React.createElement("div", null,
            React.createElement(List, { items: stickies, item: { render: this.stickyRender, onClick: this.stickyClick } }));
    }
};
Home = __decorate([
    observer
], Home);
export default Home;
//# sourceMappingURL=home.js.map