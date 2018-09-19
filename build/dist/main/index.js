var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { computed } from 'mobx';
import { nav, Page } from 'tonva-tools';
import { DropdownActions } from 'tonva-react-form';
import { store } from 'store';
import Home from './home';
import Follow from './follow';
import Find from './find';
import Me from './me';
import HaoSearch from './haoSearch';
const tabs = [
    {
        title: '同花',
        content: React.createElement(Home, null),
        redDot: computed(() => {
            let sum = 0;
            //store.messageUnreadDict.forEach(v=>sum+=v);
            let unitDict = store.units;
            unitDict.forEach(unit => {
                //let messages = unit.messages;
                //if (messages === undefined) return;
                let unread = unit.unread;
                if (unread !== undefined)
                    sum += unread;
            });
            return -sum;
        }),
    },
    {
        title: '收录',
        content: React.createElement(Follow, null),
        redDot: computed(() => store.follow.newInvitesCount),
    },
    {
        title: '发现',
        content: React.createElement(Find, null),
    },
    {
        title: '我',
        content: React.createElement(Me, null),
    }
];
export default class AppView extends React.Component {
    constructor() {
        super(...arguments);
        this.addXiaoHao = () => __awaiter(this, void 0, void 0, function* () { return nav.push(React.createElement(HaoSearch, null)); });
        this.rightMenu = [
            {
                caption: '添加小号',
                icon: 'plus',
                action: this.addXiaoHao,
            }
        ];
        this.onWs = (msg) => __awaiter(this, void 0, void 0, function* () {
            console.log('ws received: %s', msg);
            yield store.onWs(msg);
        });
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            this.rcvHandler = nav.registerReceiveHandler(this.onWs);
        });
    }
    componentWillUnmount() {
        nav.unregisterReceiveHandler(this.rcvHandler);
    }
    render() {
        let loc = parent === null ? 'null' : parent.location.href;
        let right = React.createElement(DropdownActions, { actions: this.rightMenu });
        return React.createElement(Page, { tabs: tabs, right: right });
    }
}
//# sourceMappingURL=index.js.map