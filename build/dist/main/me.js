var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { Card, CardBody, CardText, CardTitle, Button } from 'reactstrap';
import { Media, PropGrid, FA, IconText, TonvaForm } from 'tonva-react-form';
import { nav, Page } from 'tonva-tools';
import { store } from '../store';
import consts from '../consts';
import mainApi from '../mainApi';
const applyUnit = "申请创建小号";
const applyDev = "申请开发应用";
class Me extends React.Component {
    constructor(props) {
        super(props);
        this.exit = this.exit.bind(this);
        this.apply = this.apply.bind(this);
        this.applyUnit = this.applyUnit.bind(this);
        this.applyDev = this.applyDev.bind(this);
        this.onApplySubmit = this.onApplySubmit.bind(this);
    }
    exit() {
        if (confirm('退出当前账号不会删除任何历史数据，下次登录依然可以使用本账号')) {
            nav.logout();
            store.logout();
            //nav.show(views.login);
            //nav.show(<LoginView />);
        }
    }
    apply() {
        let rows = [
            '',
            {
                type: 'component',
                component: React.createElement(IconText, { iconClass: "text-info", icon: "envelope", text: applyUnit }),
                onClick: this.applyUnit
            },
            '=',
            {
                type: 'component',
                component: React.createElement(IconText, { iconClass: "text-info", icon: "envelope-o", text: applyDev }),
                onClick: this.applyDev
            },
        ];
        nav.push(React.createElement(Page, { header: "\u7533\u8BF7" },
            React.createElement(PropGrid, { rows: rows, values: {} })));
    }
    applyUnit() {
        this.showApplyPage('unit');
    }
    applyDev() {
        this.showApplyPage('dev');
    }
    showApplyPage(type) {
        let fields = {
            name: { name: 'name', type: 'string', maxLength: 50, required: true },
            phone: { name: 'phone', type: 'string', maxLength: 20 },
            owner: { name: 'owner', type: 'string', maxLength: 100 },
        };
        let rows = [
            { label: '申请人', field: fields.name, face: { type: 'string', placeholder: '真实姓名' } },
            { label: '电话', field: fields.phone },
            { label: '单位', field: fields.owner, face: { type: 'textarea', placeholder: '申请单位' } },
        ];
        nav.push(React.createElement(Page, { header: type === 'unit' ? applyUnit : applyDev },
            React.createElement(TonvaForm, { className: "m-3", formRows: rows, onSubmit: (values) => this.onApplySubmit(type, values) })));
    }
    onApplySubmit(type, values) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield mainApi.saveMessage({
                toUser: -1,
                fromApp: 0,
                type: 'apply-' + type,
                content: values,
            });
            nav.pop(2);
            nav.push(React.createElement(Page, { header: "\u5B8C\u6210", back: "close" },
                React.createElement(Card, null,
                    React.createElement(CardBody, null,
                        React.createElement(CardTitle, null, "\u7533\u8BF7\u5DF2\u53D1\u9001"),
                        React.createElement(CardText, null, "\u8BF7\u7A0D\u7B49\uFF0C\u6211\u4EEC\u4F1A\u5C3D\u5FEB\u5904\u7406\u3002"),
                        React.createElement(Button, { color: 'primary', onClick: () => nav.back() }, "\u5B8C\u6210")))));
            return;
        });
    }
    render() {
        const { user } = nav;
        let rows = [
            '',
            {
                type: 'component',
                component: React.createElement(Media, { icon: consts.appIcon, main: user.name, discription: String(user.id) })
            },
            '',
            {
                type: 'component',
                component: React.createElement(IconText, { iconClass: "text-info", icon: "envelope", text: "\u7533\u8BF7" }),
                onClick: this.apply
            },
            '',
            '',
            {
                type: 'component',
                bk: '',
                component: React.createElement("button", { className: "btn btn-danger w-100", onClick: this.exit },
                    React.createElement(FA, { name: "sign-out", size: "lg" }),
                    " \u9000\u51FA\u767B\u5F55")
            },
        ];
        return React.createElement(PropGrid, { rows: rows, values: {} });
    }
}
export default Me;
//# sourceMappingURL=me.js.map