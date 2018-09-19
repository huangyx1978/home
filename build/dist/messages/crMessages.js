var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
import { Coordinator, VmPage } from 'tonva-tools';
import { Page } from 'tonva-tools';
import { ApplyUnit, ApplyDev } from './applyXHao';
import { ApprovedUnit, ApprovedDev, UnitCreatePage } from './approvedXHao';
import { PagedMessages } from './model';
import { List } from 'tonva-react-form';
import mainApi from 'mainApi';
/*
const typeMessageMap:{[type:string]: (msg:Message, onClick?:(msg:Message)=>Promise<void>)=>JSX.Element} = {
    "apply-unit": ApplyUnit,
    "apply-dev": ApplyDev,
    "approve-unit": ApprovedUnit,
    "approve-dev": ApprovedDev,
    //"unit-follow-invite": UnitFollowInvite,
};
*/
export class CrMessages extends Coordinator {
    constructor() {
        super(...arguments);
        this.onApplyItemClick = (msg) => __awaiter(this, void 0, void 0, function* () {
            this.openPage(this.applyPage(msg));
        });
        this.onApproveItemClick = (msg, unitType, title) => __awaiter(this, void 0, void 0, function* () {
            yield this.showVm(UnitCreatePage, { msg: msg, unitType: unitType, title: title });
        });
        this.approve = (msg) => __awaiter(this, void 0, void 0, function* () {
            //alert('approve');
            //await store.unit.messageAct(msg.id, 'approve');
            yield mainApi.actMessage({ unit: 0, id: msg.id, action: 'approve' });
            msg.state = 1;
            this.closePage();
        });
        this.refuse = (msg) => __awaiter(this, void 0, void 0, function* () {
            //alert('refuse');
            //await store.unit.messageAct(msg.id, 'refuse');
            yield mainApi.actMessage({ unit: 0, id: msg.id, action: 'refuse' });
            msg.state = -1;
            this.closePage();
        });
        this.applyPage = (msg) => {
            let buttons;
            let { state } = msg;
            if (state === 0) {
                buttons = React.createElement("div", { className: "m-3" },
                    React.createElement("button", { className: "btn btn-success", onClick: () => this.approve(msg) }, "\u6279\u51C6"),
                    React.createElement("button", { onClick: () => this.refuse(msg), className: "btn btn-outline-primary ml-3" }, "\u62D2\u7EDD"));
            }
            return React.createElement(Page, { header: "\u5904\u7406\u7533\u8BF7" },
                React.createElement("div", { className: "my-3 mx-2" },
                    React.createElement("div", { className: "bg-white" }, ApplyDev(msg, undefined)),
                    buttons));
        };
    }
    internalStart(param) {
        return __awaiter(this, void 0, void 0, function* () {
            this.messages = new PagedMessages;
            yield this.messages.first(undefined);
            this.showVm(VmMessages);
        });
    }
    unitCreate(unitName, msgId) {
        return __awaiter(this, void 0, void 0, function* () {
            let unitId = yield mainApi.unitCreate(unitName, msgId);
            return unitId;
        });
    }
}
class VmMessages extends VmPage {
    constructor() {
        //protected coordinator: CrMessages;
        super(...arguments);
        this.renderMessage = (msg) => {
            let messageRow;
            let onClick;
            switch (msg.type) {
                case 'apply-unit':
                    messageRow = ApplyUnit;
                    onClick = this.coordinator.onApplyItemClick;
                    break;
                case 'apply-dev':
                    messageRow = ApplyDev;
                    onClick = this.coordinator.onApplyItemClick;
                    break;
                case 'approve-unit':
                    messageRow = ApprovedUnit;
                    onClick = this.coordinator.onApproveItemClick;
                    break;
                case 'approve-dev':
                    messageRow = ApprovedDev;
                    onClick = this.coordinator.onApproveItemClick;
                    break;
                //"unit-follow-invite": UnitFollowInvite,
            }
            //let MessageRow = typeMessageMap[msg.type];
            //return MessageRow(msg);
            return messageRow(msg, onClick);
        };
        /*
        private clickMessage = (msg: Message) => {
            alert(msg);
        }*/
        this.messagesPage = () => {
            let { items } = this.coordinator.messages;
            return React.createElement(Page, { header: "\u6D88\u606F" },
                React.createElement(List, { items: items, item: { render: this.renderMessage, onClick: undefined } }));
        };
    }
    showEntry(param) {
        return __awaiter(this, void 0, void 0, function* () {
            this.openPage(this.messagesPage);
        });
    }
}
//# sourceMappingURL=crMessages.js.map