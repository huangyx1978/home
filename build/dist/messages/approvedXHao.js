var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
import className from 'classnames';
import { EasyDate, LMR, FA, TonvaForm } from 'tonva-react-form';
import { Page, nav, VPage } from 'tonva-tools';
import { store } from 'store';
import { tagEndStyle } from './message';
const Approved = (msg, unitType, title, onClick) => {
    //protected title:string;
    //protected unitType:number;
    /*
    onClick() {
        let {msg, pointer} = this.props;
        if (pointer === false) return;
        nav.push(<UnitCreatePage title={this.title} unitType={this.unitType} msg={msg} />);
    }
    render() {*/
    let { fromUser, date, state } = msg;
    let bg, py, style;
    let right;
    if (state !== 0) {
        bg = 'bg-transparent';
        style = tagEndStyle;
        py = 'py-1';
        let name, color, text;
        if (state === 1) {
            name = 'check';
            color = 'text-success';
            text = '已批准';
        }
        else if (state === -1) {
            name = 'times';
            color = 'text-danger';
            text = '已拒绝';
        }
        right = React.createElement("span", { className: color },
            React.createElement(FA, { name: name }),
            text);
    }
    else {
        //bg = 'bg-white';
        //style = _.assign({}, tagStyle);
        //if (this.props.pointer !== false) _.assign(style, {cursor: 'pointer'});
        py = 'py-2';
    }
    //style={style}
    return React.createElement(LMR, { onClick: () => onClick(msg, unitType, title), className: className('px-3', py, bg), right: right },
        React.createElement("div", null, title),
        React.createElement("div", null,
            React.createElement("small", null,
                "\u7533\u8BF7\u65F6\u95F4: ",
                React.createElement(EasyDate, { date: date }))));
    //}
};
export const ApprovedDev = (msg, onClick) => {
    let title = '创建开发号';
    let unitType = 0;
    return Approved(msg, unitType, title, onClick);
};
export const ApprovedUnit = (msg, onClick) => {
    let title = '创建小号';
    let unitType = 1;
    return Approved(msg, unitType, title, onClick);
};
export class UnitCreatePage extends VPage {
    constructor() {
        super(...arguments);
        this.fields = {
            name: { name: 'name', type: 'string', maxLength: 250, required: true },
        };
        this.onSubmit = (values) => __awaiter(this, void 0, void 0, function* () {
            let { id } = this.msg;
            let unitId = yield this.controller.unitCreate(values.name, id);
            let error;
            switch (unitId) {
                default:
                    this.closePage();
                    this.openPageElement(React.createElement(Page, null,
                        React.createElement("div", { className: "p-3 text-success" },
                            React.createElement(FA, { name: "check" }),
                            " \u521B\u5EFA\u5B8C\u6210")));
                    return;
                case 0:
                    error = '名字已经被使用了';
                    break;
                case -1:
                case -2:
                    error = '错误编号: ' + unitId;
                    break;
            }
            this.form.formView.setError('name', error);
            return;
        });
        this.view = () => {
            let caption = this.unitType === 0 ? '开发号' : '小号';
            let rows = [
                {
                    label: caption,
                    field: this.fields.name,
                    face: {
                        type: 'string',
                        placeholder: '唯一名',
                        notes: caption + '唯一的身份名，一旦确定，不可能更改',
                    }
                },
            ];
            return React.createElement(Page, { header: this.title },
                React.createElement("div", { className: "m-4" }),
                React.createElement(TonvaForm, { ref: tv => this.form = tv, className: "m-3", formRows: rows, onSubmit: this.onSubmit }));
        };
    }
    showEntry({ title, unitType, msg }) {
        return __awaiter(this, void 0, void 0, function* () {
            this.title = title;
            this.unitType = unitType;
            this.msg = msg;
            this.openPage(this.view);
        });
    }
    onProcessMessage(action) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id } = this.msg;
            yield store.unit.messageAct(id, action);
            nav.pop();
        });
    }
}
//# sourceMappingURL=approvedXHao.js.map