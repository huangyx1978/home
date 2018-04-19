var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { observer } from 'mobx-react';
import { Card, CardBody, CardText, CardTitle, Button } from 'reactstrap';
import { nav, Page, ListView } from 'tonva-tools';
import mainApi from '../mainApi';
import { store } from '../store';
import consts from '../consts';
let NewFollows = class NewFollows extends React.Component {
    constructor(props) {
        super(props);
        this.converter = this.converter.bind(this);
        this.accept = this.accept.bind(this);
        this.refuse = this.refuse.bind(this);
    }
    test0() {
        return __awaiter(this, void 0, void 0, function* () {
            yield mainApi.postMessage(1, { type: 'new-follow', count: 0 });
        });
    }
    test1() {
        return __awaiter(this, void 0, void 0, function* () {
            yield mainApi.postMessage(1, { type: 'new-follow', count: 1 });
        });
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            let fellow = store.fellow;
            yield fellow.loadInvites();
            fellow.newInvitesCount = undefined;
        });
    }
    componentWillUnmount() {
        return __awaiter(this, void 0, void 0, function* () {
            store.fellow.newInvitesCount = 0;
        });
    }
    accept(um) {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.acceptFellowInvite(um);
            nav.replace(React.createElement(Page, { header: '\u63A5\u53D7\u9080\u8BF7', back: "close" },
                React.createElement(Card, null,
                    React.createElement(CardBody, null,
                        React.createElement(CardTitle, null, "\u5C0F\u53F7\u6210\u5458"),
                        React.createElement(CardText, null,
                            "\u4F60\u5DF2\u6210\u4E3A",
                            "-",
                            "\u7684\u6210\u5458\u3002"),
                        React.createElement(Button, { color: 'primary', onClick: () => nav.back() }, "\u5B8C\u6210")))));
        });
    }
    refuse(um) {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.fellow.refuseInvite(um);
        });
    }
    converter(um) {
        let { name, nick, icon } = { name: 'name', nick: 'nick', icon: 'icon' };
        let main = name;
        if (nick !== undefined)
            main += ' - ' + nick;
        let accept = () => __awaiter(this, void 0, void 0, function* () { return yield this.accept(um); });
        let refuse = () => __awaiter(this, void 0, void 0, function* () { return yield this.refuse(um); });
        return {
            key: um.id,
            main: main,
            icon: icon || consts.appIcon,
            middle: "邀请成为小号管理员",
            midSize: 3,
            right: React.createElement("div", null,
                React.createElement(Button, { className: 'mr-2', color: 'success', size: 'sm', onClick: accept }, "\u63A5\u53D7"),
                React.createElement(Button, { color: 'danger', outline: true, size: 'sm', onClick: refuse }, "\u62D2\u7EDD")),
        };
    }
    render() {
        let fai = store.fellow.invites;
        return React.createElement(Page, { header: "\u9080\u8BF7" },
            "\u65B0\u6536\u5F55",
            React.createElement(Button, { onClick: this.test1 }, "WS1"),
            React.createElement(Button, { onClick: this.test0 }, "WS0"),
            React.createElement(ListView, { items: fai, converter: this.converter }));
    }
};
NewFollows = __decorate([
    observer
], NewFollows);
export default NewFollows;
//# sourceMappingURL=newFollows.js.map