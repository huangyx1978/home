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
import { List, EasyDate, LMR, FA, Muted, PropGrid } from 'tonva-react-form';
import { Page } from 'tonva-tools';
import { UserSpan } from './userSpan';
import { VmPage } from 'tonva-react-usql';
const states = {
    '#': React.createElement("span", { className: "text-succeed" }, "\u5B8C\u6210"),
    '#-': React.createElement("span", { className: "text-danger" }, "\u6CA1\u5B8C\u6210"),
};
function stateText(state) {
    let ret = states[state];
    return ret || state;
}
export class JobPage extends VmPage {
    constructor() {
        super(...arguments);
        this.view = () => {
            //let {msg} = this.props;
            let { fromUser } = this.msg;
            let { tuid_message, tuid_user } = this.coordinator;
            let user = tuid_user.valueFromId(fromUser);
            let rows = [
                {
                    label: '来自',
                    type: 'component',
                    component: React.createElement("div", { className: "w-100" }, typeof user === 'object' ?
                        React.createElement("small", null, user.nick || user.name) :
                        React.createElement("small", null, user))
                },
                {
                    label: '任务描述',
                    type: 'string',
                    name: 'discription',
                },
                '',
            ];
            this.buildFlow(rows);
            return React.createElement(Page, { header: "\u5904\u7406\u4EFB\u52A1" },
                React.createElement(PropGrid, { className: "px-3 py-2", rows: rows, values: this.msg }));
        };
    }
    //React.Component<JobPageProps, JobPageState> {
    /*
        constructor(props) {
            super(props);
            this.finish = this.finish.bind(this);
            this.decline = this.decline.bind(this);
            this.edit = this.edit.bind(this);
        }
    */
    showEntry(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            this.msg = msg;
            this.state = yield this.coordinator.getMessage(msg.id);
            //this.setState(ret);
            this.openPage(this.view);
        });
    }
    finish() {
        return __awaiter(this, void 0, void 0, function* () {
            //let {msg} = this.props;
            yield this.coordinator.actMessage(this.msg, 'done', '#', [{ user: 0 }]);
            //store.unit.chat.done(msg.id);
            //nav.pop();
            this.closePage();
        });
    }
    decline() {
        return __awaiter(this, void 0, void 0, function* () {
            //let {msg} = this.props;
            yield this.coordinator.actMessage(this.msg, 'decline', '#-', [{ user: 0 }]);
            alert('显示做不了的理由, 然后选择。暂未完成设计！');
            //nav.pop();
            this.closePage();
        });
    }
    edit() {
        return __awaiter(this, void 0, void 0, function* () {
            //let {msg} = this.props;
            this.msg.subject += '.1';
        });
    }
    flowRender(flow, index) {
        let { id, prev, date, state, user, action } = flow;
        let left = state === '$' ?
            React.createElement("div", { className: "col-sm-6" }, "\u5F00\u59CB") :
            React.createElement(React.Fragment, null,
                React.createElement("div", { className: "col-sm-1" }),
                React.createElement("div", { className: "col-sm-5" },
                    action,
                    " \u00A0 ",
                    React.createElement(UserSpan, { userIds: [user] })));
        let mid = prev > 0 ?
            React.createElement("div", { className: "col-sm-4" },
                React.createElement("div", { className: "row" },
                    React.createElement("div", { className: "col-sm-6 text-right" },
                        React.createElement(FA, { className: "text-info", name: "arrow-right" })),
                    React.createElement("div", { className: "col-sm-6" }, stateText(state))))
            : React.createElement("div", { className: "col-sm-4" });
        return React.createElement("span", { key: id, className: "container-fluid my-2" },
            React.createElement("div", { className: "row" },
                left,
                mid,
                React.createElement("div", { className: "col-sm-2 align-items-end justify-content-center d-flex flex-column" },
                    React.createElement(Muted, null,
                        React.createElement(EasyDate, { date: date })))));
    }
    buildFlow(rows) {
        if (this.state === null)
            return;
        let { flow, flows } = this.state;
        rows.push({
            type: 'component',
            full: true,
            component: React.createElement(List, { className: "w-100", header: React.createElement(Muted, null, "\u6D41\u7A0B"), items: flows, item: { render: this.flowRender } })
        });
        rows.push('');
        if (flow === undefined)
            return;
        rows.push({
            label: '',
            type: 'component',
            bk: 'tansparent',
            component: React.createElement("div", { className: "w-100" },
                React.createElement(LMR, { left: React.createElement(Button, { color: "success", onClick: this.finish }, "\u5B8C\u6210"), right: React.createElement(Button, { color: "info", onClick: this.decline }, "\u505A\u4E0D\u4E86") }))
            //<Button color="secondary" onClick={this.edit}>编辑</Button>
        });
    }
}
/*
<div>
<Button color="success" onClick={this.finish}>完成</Button> &nbsp; &nbsp;
<Button color="secondary" onClick={this.decline}>做不了</Button>
<Button color="secondary" onClick={this.edit}>编辑</Button>
</div>
*/ 
//# sourceMappingURL=job.js.map