var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import * as className from 'classnames';
import * as _ from 'lodash';
import { EasyDate, LMR, FA, TonvaForm } from 'tonva-react-form';
import { Page, nav } from 'tonva-tools';
import { store } from 'store';
import { tagStyle, tagEndStyle } from './message';
class Approved extends React.Component {
    onClick() {
        let { msg, pointer } = this.props;
        if (pointer === false)
            return;
        nav.push(React.createElement(UnitCreatePage, { title: this.title, unitType: this.unitType, msg: msg }));
    }
    render() {
        let { fromUser, date, state } = this.props.msg;
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
            style = _.assign({}, tagStyle);
            if (this.props.pointer !== false)
                _.assign(style, { cursor: 'pointer' });
            py = 'py-2';
        }
        return React.createElement("div", null,
            React.createElement("div", { onClick: () => this.onClick(), className: className('px-3', py, 'my-1', 'mx-3', bg), style: style },
                React.createElement(LMR, { left: React.createElement("span", null, this.title), right: right }),
                React.createElement("div", null,
                    React.createElement("small", null,
                        "\u7533\u8BF7\u65F6\u95F4: ",
                        React.createElement(EasyDate, { date: date })))));
    }
}
export class ApprovedDev extends Approved {
    constructor() {
        super(...arguments);
        this.title = '创建开发号';
        this.unitType = 0;
    }
}
export class ApprovedUnit extends Approved {
    constructor() {
        super(...arguments);
        this.title = '创建小号';
        this.unitType = 1;
    }
}
class UnitCreatePage extends React.Component {
    constructor(props) {
        super(props);
        this.fields = {
            name: { name: 'name', type: 'string', maxLength: 250, required: true },
        };
        this.onSubmit = this.onSubmit.bind(this);
    }
    onProcessMessage(action) {
        return __awaiter(this, void 0, void 0, function* () {
            let { msg } = this.props;
            let { id } = msg;
            yield store.unit.messageAct(id, action);
            nav.pop();
        });
    }
    onSubmit(values) {
        return __awaiter(this, void 0, void 0, function* () {
            let { msg } = this.props;
            let { id } = msg;
            let unitId = yield store.unitCreate(values.name, id);
            let error;
            switch (unitId) {
                default:
                    nav.push(React.createElement(UnitSuccessPage, null));
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
    }
    render() {
        let caption = this.props.unitType === 0 ? '开发号' : '小号';
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
        let { title } = this.props;
        return React.createElement(Page, { header: title },
            React.createElement("div", { className: "m-4" }),
            React.createElement(TonvaForm, { ref: tv => this.form = tv, className: "m-3", formRows: rows, onSubmit: this.onSubmit }));
    }
}
class UnitSuccessPage extends React.Component {
    render() {
        return React.createElement(Page, null, "\u521B\u5EFA\u5B8C\u6210");
    }
}
//# sourceMappingURL=approvedXHao.js.map