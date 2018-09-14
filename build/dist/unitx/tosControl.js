var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { ControlBase } from 'tonva-react-form';
import { store } from 'store';
import { default as mainApi } from 'mainApi';
export class TosControl extends ControlBase {
    constructor(formView) {
        super(formView);
    }
    get toList() { return this.ti.list; }
    setError(fieldName, error) {
        this.ti.setError(error);
    }
    confirmInput() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ti.confirmInput();
        });
    }
    renderControl() {
        //form-control-plaintext
        return React.createElement("div", { className: "" },
            React.createElement(TosInput, { ref: ti => this.ti = ti }));
    }
}
const toStyle = {
    borderRadius: '0.7em',
    border: '1px solid lightgray',
    background: '#f8f8f8',
    padding: '0.1em 0.3em 0.1em 0.8em',
    marginRight: '0.3em'
};
class TosInput extends React.Component {
    constructor(props) {
        super(props);
        this.list = [];
        this.keyPress = this.keyPress.bind(this);
        this.keyDown = this.keyDown.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.state = {
            tos: this.list,
            error: undefined,
        };
    }
    setError(error) {
        this.setState({ error: error });
    }
    confirmInput() {
        return __awaiter(this, void 0, void 0, function* () {
            let inputName = this.input.value.trim();
            if (inputName.length === 0)
                return true;
            let members = yield mainApi.membersFromName({ unit: store.unit.id, name: inputName });
            if (members.length === 0) {
                this.input.style.color = 'red';
                this.setState({ error: '无法发送此接收人' });
                return false;
            }
            for (let m of members) {
                let { id, name, nick, assigned, icon } = m;
                if (this.list.findIndex(v => v.id === id) >= 0)
                    continue;
                this.list.push({
                    id: id,
                    name: name,
                    nick: nick,
                    assigned: assigned,
                    icon: icon,
                });
            }
            this.input.value = '';
            this.setState({ tos: this.list });
            return true;
        });
    }
    onFocus() {
        this.setState({ error: undefined });
    }
    keyPress(evt) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setState({ error: undefined });
            this.input.style.color = '';
            switch (evt.key) {
                default: return;
                case 'Enter':
                case ';':
                case ',':
                    break;
            }
            evt.preventDefault();
            this.confirmInput();
        });
    }
    keyDown(evt) {
        this.setState({ error: undefined });
    }
    removeTo(user) {
        let index = this.list.findIndex(v => v.id === user.id);
        if (index < 0)
            return;
        this.list.splice(index, 1);
        this.setState({ tos: this.list });
    }
    render() {
        let { tos, error } = this.state;
        let holder = tos.length === 0 ?
            '' : '';
        let tosDiv;
        if (tos !== undefined && tos.length > 0) {
            tosDiv = React.createElement("div", { className: "form-control-plaintext", style: { display: 'flex', flexFlow: 'row', flexWrap: 'wrap' } }, tos.map(v => {
                let { id, name, nick, assigned } = v;
                let text;
                if (assigned !== undefined)
                    text = assigned + '(' + name + ')';
                else if (nick !== undefined)
                    text = nick + '(' + name + ')';
                else
                    text = name;
                return React.createElement("div", { key: id, style: toStyle },
                    text,
                    " \u00A0",
                    React.createElement("button", { type: "button", className: "close", "aria-label": "Close", onClick: () => this.removeTo(v) },
                        React.createElement("span", { "aria-hidden": "true" }, "\u00D7")));
            }));
        }
        return React.createElement(React.Fragment, null,
            tosDiv,
            React.createElement("input", { className: "w-100 form-control", ref: input => this.input = input, type: "text", onKeyPress: this.keyPress, onKeyDown: this.keyDown, onFocus: this.onFocus, placeholder: holder }),
            React.createElement("div", { style: { color: 'red', fontSize: 'smaller', marginTop: '0.2em' } }, error));
    }
}
//# sourceMappingURL=tosControl.js.map