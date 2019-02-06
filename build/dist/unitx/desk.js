var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { List, EasyDate, LMR, FA, Muted } from 'tonva-react-form';
import { nav, View } from 'tonva-tools';
import { templetDict } from 'store';
import { navToAppId } from 'navToApp';
import { tv } from 'tonva-react-uq';
import { UserSpan } from './userSpan';
const light = { fontSize: 'x-small', color: 'lightgray' };
export class DeskPage extends View {
    constructor() {
        super(...arguments);
        this.clickMessage = (deskItem) => __awaiter(this, void 0, void 0, function* () {
            let { message, read } = deskItem;
            if (typeof message === 'number')
                return;
            let boxId = message;
            if (read !== 1)
                yield this.controller.readMessage(boxId.id);
            let { unit } = this.controller;
            let msg = boxId.obj;
            let { type } = msg;
            switch (type) {
                default:
                    this.controller.jobPage(msg);
                    break;
                case 'sheetMsg':
                    let obj = JSON.parse(msg.content);
                    let { app: appId, id: sheetId, usq: usqId, sheet: sheetType } = obj;
                    yield navToAppId(appId, usqId, unit.id, sheetType, sheetId);
                    break;
            }
        });
        this.renderMessage = (deskItem, index) => {
            return React.createElement(this.msgRow, Object.assign({}, deskItem));
        };
        this.msgRow = observer((deskItem) => {
            let userId = nav.user.id;
            let { message, read } = deskItem;
            let rowCn = 'px-3 bg-white my-1';
            if (typeof message === 'number') {
                return React.createElement(LMR, { className: rowCn + ' py-2' },
                    React.createElement(Muted, null,
                        "... ",
                        message,
                        " ..."));
            }
            let messageTemplet = (msg) => {
                let { date, type, fromUser, subject, discription, content } = msg;
                let td = templetDict[type];
                let cn, cnText, dot, fontWeight;
                if (read === 1) {
                    cn = 'mt-2 text-info';
                    cnText = 'text-secondary';
                }
                else {
                    cn = 'mt-2 text-info red-dot';
                    cnText = 'text-dark';
                    dot = React.createElement("u", { className: "message-dot" });
                    fontWeight = 'font-weight-bold';
                }
                let from, size;
                if (fromUser != userId) {
                    from = React.createElement(UserSpan, { userIds: [fromUser] });
                    size = '1x';
                }
                let caption;
                if (subject !== undefined && subject.trim().length > 0) {
                    caption = React.createElement(React.Fragment, null,
                        React.createElement("span", { className: fontWeight }, subject),
                        " - ");
                }
                let left = React.createElement("div", { className: classNames('px-3', cn) },
                    React.createElement(FA, { size: size, name: (td && td.icon) || 'envelope' }),
                    dot);
                let mid = React.createElement("div", { className: classNames('py-2', cnText) },
                    caption,
                    React.createElement("small", null, discription));
                let right = React.createElement("div", { className: 'py-2 px-2 text-right' },
                    React.createElement("span", { style: light },
                        React.createElement(EasyDate, { date: date })));
                return React.createElement(LMR, { className: "bg-white", left: left, right: right }, mid);
            };
            return tv(message, messageTemplet);
        });
    }
    render() {
        let { desk } = this.controller;
        let { items, bottomDiv } = desk;
        return React.createElement(React.Fragment, null,
            React.createElement(List, { className: "my-1", before: React.createElement(Muted, null, "\u8BFB\u53D6\u4E2D..."), none: React.createElement(Muted, { className: "px-3 py-2" }, "\u6682\u65E0\u5F85\u529E\u4E8B\u9879"), items: items, item: {
                    key: (item) => item.message.id,
                    className: 'bg-transparent',
                    render: this.renderMessage,
                    onClick: this.clickMessage
                } }),
            React.createElement("div", { id: bottomDiv }));
    }
}
//# sourceMappingURL=desk.js.map