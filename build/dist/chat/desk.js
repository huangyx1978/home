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
import { Button } from 'reactstrap';
import { List, EasyDate, LMR, FA, Muted } from 'tonva-react-form';
import { nav } from 'tonva-tools';
import { store, templetDict } from 'store';
import { ApplyDev, ApplyUnit, ApprovedDev, ApprovedUnit, UnitFollowInvite } from 'messages';
import { UserSpan } from './userSpan';
import { JobPage } from './job';
import { AppsPage } from './apps';
import { MyFolders } from './folders';
const typeMessageMap = {
    "apply-unit": ApplyUnit,
    "apply-dev": ApplyDev,
    "approve-unit": ApprovedUnit,
    "approve-dev": ApprovedDev,
    "unit-follow-invite": UnitFollowInvite,
};
let DeskPage = class DeskPage extends React.Component {
    constructor(props) {
        super(props);
        this.renderMessage = this.renderMessage.bind(this);
        this.clickMessage = this.clickMessage.bind(this);
    }
    componentDidMount() {
        let bd = store.unit.unitx.desk.bottomDiv;
        let el = document.getElementById(bd);
        //if (el) el.scrollIntoView();
    }
    clickMessage(deskItem) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, read } = deskItem;
            if (read !== 1)
                yield store.unit.unitx.readMessage(id);
            let tuid = store.unit.unitx.tuid_message;
            let msg = tuid.getId(id);
            if (typeof msg === 'number')
                return;
            nav.push(React.createElement(JobPage, { msg: msg }));
        });
    }
    renderMessage(deskItem, index) {
        return React.createElement(MsgRow, { deskItem: deskItem });
    }
    clickPlus() {
        return __awaiter(this, void 0, void 0, function* () {
            //let templets = await store.unit.chat.getTemplets();
            //nav.push(<JobsPage templets={templets} />);
        });
    }
    clickApps() {
        nav.push(React.createElement(AppsPage, null));
    }
    render() {
        let { desk } = store.unit.unitx;
        let { items, bottomDiv } = desk;
        let right = React.createElement(Button, { onClick: this.clickApps, color: "success", size: "sm" }, "\u529F\u80FD\u5E94\u7528");
        let footer = React.createElement("div", { className: "p-1" },
            React.createElement(Button, { color: "primary", size: "sm", onClick: this.clickPlus },
                React.createElement(FA, { name: "plus" })),
            "\u00A0 ",
            React.createElement("div", { onClick: this.clickPlus }, "\u53D1\u4EFB\u52A1"));
        return React.createElement(React.Fragment, null,
            React.createElement(MyFolders, null),
            React.createElement(List, { className: "my-1", before: React.createElement(Muted, null, "\u8BFB\u53D6\u4E2D..."), none: React.createElement("div", { className: "p-2" },
                    React.createElement("small", { style: { color: 'lightgray' } }, "\u6682\u65E0\u5F85\u529E\u4E8B\u9879")), 
                //items={store.unit.chat.messages.items} 
                items: items, item: {
                    key: (item) => item.id,
                    className: 'bg-transparent',
                    render: this.renderMessage,
                    onClick: this.clickMessage
                } }),
            React.createElement("div", { id: bottomDiv }));
        //</Page>;
    }
};
DeskPage = __decorate([
    observer
], DeskPage);
export { DeskPage };
const light = { fontSize: 'x-small', color: 'lightgray' };
let MsgRow = class MsgRow extends React.Component {
    render() {
        let userId = nav.user.id;
        let { tuid_message, tuid_user } = store.unit.unitx;
        let { deskItem } = this.props;
        let { id, read } = deskItem;
        let msg = tuid_message.getId(id);
        let rowCn = 'px-3 bg-white my-1';
        if (typeof msg === 'number') {
            return React.createElement(LMR, { className: rowCn + ' py-2' },
                React.createElement("small", { style: { color: 'lightgray' } },
                    "... ",
                    id,
                    " ..."));
        }
        let { date, type, fromUser, subject, discription, content } = msg;
        let td = templetDict[type];
        let cn, cnText;
        if (read === 1) {
            cn = 'mt-1 text-info';
            cnText = 'text-secondary';
        }
        else {
            cn = 'mt-1 text-danger';
            cnText = 'text-dark';
        }
        let from, size;
        if (fromUser != userId) {
            from = React.createElement(UserSpan, { userIds: [fromUser] });
            size = '2x';
        }
        let caption;
        if (subject !== undefined) {
            caption = React.createElement("div", { className: "font-weight-bold" }, subject);
        }
        return React.createElement("div", { className: rowCn + ' py-1 flex-column' },
            React.createElement(LMR, { left: React.createElement(FA, { className: cn, size: size, name: (td && td.icon) || 'envelope' }) },
                from,
                React.createElement("div", { style: light },
                    React.createElement(EasyDate, { date: date }))),
            React.createElement("div", { className: "p-1" },
                caption,
                React.createElement("div", null, discription)));
    }
};
MsgRow = __decorate([
    observer
], MsgRow);
//# sourceMappingURL=desk.js.map