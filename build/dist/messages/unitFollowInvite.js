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
import { EasyDate, LMR, FA } from 'tonva-react-form';
import { Page, nav } from 'tonva-tools';
import { UserSpan } from 'tools';
import { store } from 'store';
import { tagStyle, tagEndStyle } from './message';
export class UnitFollowInvite extends React.Component {
    constructor(props) {
        super(props);
        this.title = '小号邀请';
        this.onClick = this.onClick.bind(this);
    }
    onClick() {
        //if (this.props.pointer === false) return;
        let { msg } = this.props;
        let { state } = msg;
        if (state === 1 || state === -1)
            return;
        nav.push(React.createElement(MessagePage, { title: this.title, msg: msg }));
    }
    render() {
        let { fromUser, date, state } = this.props.msg;
        let onClick;
        let bg, py, style;
        let right;
        if (state !== '0') {
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
class MessagePage extends React.Component {
    onProcessMessage(action) {
        return __awaiter(this, void 0, void 0, function* () {
            let { msg } = this.props;
            yield store.unit.messageAct(msg.id, action);
            nav.pop();
        });
    }
    render() {
        let { title, msg } = this.props;
        return React.createElement(Page, { header: "\u6D88\u606F" },
            React.createElement("div", { className: "m-4" }),
            React.createElement(UnitFollowInvite, { msg: msg }),
            React.createElement("div", { className: "mx-3 my-4" },
                React.createElement("button", { className: "btn btn-success", onClick: () => this.onProcessMessage('approve') }, "\u6279\u51C6"),
                React.createElement("button", { className: "btn btn-primary ml-3", onClick: () => this.onProcessMessage('refuse') }, "\u62D2\u7EDD")));
    }
}
//# sourceMappingURL=unitFollowInvite.js.map