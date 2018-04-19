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
import { Button } from 'reactstrap';
import { EasyDate, LMR, FA } from 'tonva-react-form';
import { Page, nav } from 'tonva-tools';
import { UserSpan } from '../tools';
import { store } from '../store';
import { tagStyle, tagEndStyle } from './message';
class ApplyItem extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    onClick() {
        //if (this.props.pointer === false) return;
        let { state } = this.props;
        if (state === 1 || state === -1)
            return;
        nav.push(React.createElement(MessagePage, Object.assign({ title: this.title }, this.props)));
    }
    render() {
        let { fromUser, date, state } = this.props;
        let onClick;
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
            _.assign(style, { cursor: 'pointer' });
            //if (this.props.pointer !== false) _.assign(style, {cursor: 'pointer'});
            py = 'py-2';
        }
        return React.createElement("div", null,
            React.createElement("div", { onClick: () => this.onClick(), className: className('px-3', py, 'my-1', 'mx-3', bg), style: style },
                React.createElement(LMR, { left: React.createElement("span", null, this.title), right: right }),
                React.createElement("div", null,
                    React.createElement("small", null,
                        "\u7533\u8BF7\u4EBA: ",
                        React.createElement(UserSpan, { id: fromUser }))),
                React.createElement("div", null,
                    React.createElement("small", null,
                        "\u65F6\u95F4: ",
                        React.createElement(EasyDate, { date: date })))));
    }
}
export class ApplyDev extends ApplyItem {
    constructor() {
        super(...arguments);
        this.title = '申请开发权限';
    }
}
export class ApplyUnit extends ApplyItem {
    constructor() {
        super(...arguments);
        this.title = '申请小号权限';
    }
}
class MessagePage extends React.Component {
    onProcessMessage(action) {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.unit.messageAct(this.props.id, action);
            nav.pop();
        });
    }
    render() {
        return React.createElement(Page, { header: "\u6D88\u606F" },
            React.createElement("div", { className: "m-4" }),
            React.createElement(ApplyDev, Object.assign({}, this.props)),
            React.createElement("div", { className: "mx-3 my-4" },
                React.createElement(Button, { onClick: () => this.onProcessMessage('approve'), color: "success" }, "\u6279\u51C6"),
                React.createElement(Button, { onClick: () => this.onProcessMessage('refuse'), className: "ml-3", color: "primary", outline: true }, "\u62D2\u7EDD")));
    }
}
//# sourceMappingURL=applyXHao.js.map