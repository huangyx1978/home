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
import { nav, VmView } from 'tonva-tools';
import { templetDict } from 'store';
//import {ApplyDev, ApplyUnit, ApprovedDev, ApprovedUnit, UnitFollowInvite} from 'messages';
import { navToAppId } from 'navToApp';
import { UserSpan } from './userSpan';
const light = { fontSize: 'x-small', color: 'lightgray' };
export class DeskPage extends VmView {
    constructor() {
        super(...arguments);
        //protected coordinator: CrUnitxUsq;
        /*
        componentDidMount() {
            let bd = store.unit.unitx.desk.bottomDiv;
            let el = document.getElementById(bd);
            if (el) el.scrollIntoView();
        }
        */
        this.clickMessage = (deskItem) => __awaiter(this, void 0, void 0, function* () {
            let { message, read } = deskItem;
            let idBox = message;
            if (read !== 1)
                yield this.coordinator.readMessage(idBox.id);
            let { unit } = this.coordinator;
            //let tuid = this.coordinator.tuid_message;
            //let msg = tuid.valueFromId(id);
            let msg = idBox.obj;
            if (typeof message === 'number')
                return;
            let { type } = msg;
            switch (type) {
                default:
                    //nav.push(<JobPage msg={msg} />);
                    this.coordinator.jobPage(msg);
                    break;
                case 'sheetMsg':
                    //alert(JSON.stringify(msg));
                    let obj = JSON.parse(msg.content);
                    let { app: appId, id: sheetId, usq: usqId, sheet: sheetType } = obj;
                    yield navToAppId(appId, usqId, unit.id, sheetType, sheetId);
                    break;
            }
        });
        this.renderMessage = (deskItem, index) => {
            return React.createElement(this.msgRow, Object.assign({}, deskItem));
        };
        this.clickPlus = () => __awaiter(this, void 0, void 0, function* () {
            //let templets = await store.unit.chat.getTemplets();
            //nav.push(<JobsPage templets={templets} />);
        });
        this.clickApps = () => {
            //this.openPage(AppsPage);
            //nav.push(<AppsPage />);
            this.coordinator.showAppsPage();
        };
        this.view = () => {
            let { desk } = this.coordinator;
            let { items, bottomDiv } = desk;
            /*
            let right = <Button onClick={this.clickApps} color="success" size="sm">功能应用</Button>;
            let footer = <div className="p-1">
                <Button color="primary" size="sm" onClick={this.clickPlus}><FA name="plus" /></Button>
                &nbsp; <div onClick={this.clickPlus}>发任务</div>
            </div>;
            */
            return React.createElement(React.Fragment, null,
                this.coordinator.myFolders(),
                React.createElement(List, { className: "my-1", before: React.createElement(Muted, null, "\u8BFB\u53D6\u4E2D..."), none: React.createElement("div", { className: "p-2" },
                        React.createElement("small", { style: { color: 'lightgray' } }, "\u6682\u65E0\u5F85\u529E\u4E8B\u9879")), items: items, item: {
                        key: (item) => item.message.id,
                        className: 'bg-transparent',
                        render: this.renderMessage,
                        onClick: this.clickMessage
                    } }),
                React.createElement("div", { id: bottomDiv }));
            //</Page>;
        };
        this.msgRow = observer((deskItem) => {
            let userId = nav.user.id;
            let { tuid_message, tuid_user } = this.coordinator;
            let { message, read } = deskItem;
            //let msg:Message = tuid_message.valueFromId();
            //let msg:Message = {id: ((id as any) as IdBox).id} as any;
            let rowCn = 'px-3 bg-white my-1';
            if (typeof message === 'number') {
                return React.createElement(LMR, { className: rowCn + ' py-2' },
                    React.createElement("small", { style: { color: 'lightgray' } },
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
            return message.content(messageTemplet);
        });
    }
    render() {
        return React.createElement(this.view, null);
    }
}
//# sourceMappingURL=desk.js.map