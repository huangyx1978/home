var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { nav } from 'tonva-tools';
import { store } from 'store';
import { NewFollows } from 'follows';
import consts from 'consts';
const bkStyle = { backgroundColor: '#cfcfff', margin: '0', padding: '6px' };
const iconStyle = { color: 'green' };
const icon = (name) => React.createElement("div", { style: bkStyle },
    React.createElement("i", { style: iconStyle, className: 'fa fa-lg fa-' + name }));
let Follow = class Follow extends React.Component {
    constructor(props) {
        super(props);
        this.actions = [
            {
                key: 1,
                main: '邀请你成为管理员',
                //right: '增删管理员',
                icon: icon('user-plus'),
                onClick: () => nav.push(React.createElement(NewFollows, null)),
                unread: computed(() => store.follow.newInvitesCount),
            },
        ];
        //this.rowMapper = this.rowMapper.bind(this);
    }
    tieConverter(tie) {
        return {
            key: tie.id,
            date: undefined,
            main: undefined,
            //vice: tie..discription,
            icon: consts.appItemIcon,
        };
    }
    render() {
        //let nf = mainData.newFollow;
        //this.actions[0].unread = nf;
        return React.createElement("div", { className: "p2" }, "\u5173\u6CE8\u7684\u5C0F\u53F7\uFF0C\u6B63\u5728\u5F00\u53D1\u4E2D...");
    }
};
Follow = __decorate([
    observer
], Follow);
export default Follow;
//# sourceMappingURL=follow.js.map