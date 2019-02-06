var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
import { Controller, VPage } from 'tonva-tools';
import { Page } from 'tonva-tools';
import { ApplyUnit, ApplyDev } from './applyXHao';
import { ApprovedUnit, ApprovedDev, UnitCreatePage } from './approvedXHao';
import { PageMessages } from './model';
import { List } from 'tonva-react-form';
import mainApi from 'mainApi';
export class CMessages extends Controller {
    constructor() {
        super({});
        this.onApplyItemClick = (msg) => __awaiter(this, void 0, void 0, function* () {
            this.openPage(this.applyPage(msg));
        });
        this.onApproveItemClick = (msg, unitType, title) => __awaiter(this, void 0, void 0, function* () {
            yield this.showVPage(UnitCreatePage, { msg: msg, unitType: unitType, title: title });
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
            this.messages = new PageMessages;
            yield this.messages.first(undefined);
            this.showVPage(VMessages);
        });
    }
    unitCreate(unitName, msgId) {
        return __awaiter(this, void 0, void 0, function* () {
            let unitId = yield mainApi.unitCreate(unitName, msgId);
            return unitId;
        });
    }
}
class VMessages extends VPage {
    constructor() {
        //protected controller: CrMessages;
        super(...arguments);
        this.renderMessage = (msg) => {
            let messageRow;
            let onClick;
            switch (msg.type) {
                default: throw msg.type;
                case 'apply-unit':
                    messageRow = ApplyUnit;
                    onClick = this.controller.onApplyItemClick;
                    break;
                case 'apply-dev':
                    messageRow = ApplyDev;
                    onClick = this.controller.onApplyItemClick;
                    break;
                case 'approve-unit':
                    messageRow = ApprovedUnit;
                    onClick = this.controller.onApproveItemClick;
                    break;
                case 'approve-dev':
                    messageRow = ApprovedDev;
                    onClick = this.controller.onApproveItemClick;
                    break;
            }
            return messageRow(msg, onClick);
        };
        this.messagesPage = () => {
            let { items } = this.controller.messages;
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
//# sourceMappingURL=cMessages.js.map