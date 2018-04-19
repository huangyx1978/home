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
import { nav, Page, WSChannel } from 'tonva-tools';
import { DropdownActions } from 'tonva-react-form';
import { store } from '../store';
import Home from './home';
import Follow from './follow';
import Find from './find';
import Me from './me';
import HaoSearch from './haoSearch';
const ws = new WSChannel(process.env.REACT_APP_WSHOST, undefined);
const tabs = [
    {
        title: '同花',
        content: React.createElement(Home, null),
        redDot: computed(() => {
            let sum = 0;
            //store.messageUnreadDict.forEach(v=>sum+=v);
            let unitDict = store.units;
            unitDict.forEach(unit => {
                let unread = unit.messages.unread;
                if (unread !== undefined)
                    sum += unread;
            });
            return -sum;
        }),
    },
    {
        title: '收录',
        content: React.createElement(Follow, null),
        redDot: computed(() => store.fellow.newInvitesCount),
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
export default class View extends React.Component {
    constructor(props) {
        super(props);
        this.rightMenu = [
            {
                caption: '添加小号',
                icon: 'plus',
                action: this.addXiaoHao,
            }
        ];
        this.addXiaoHao = this.addXiaoHao.bind(this);
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield ws.connect();
            this.wsId = ws.onWsReceiveAny((msg) => store.onWs(msg));
            yield store.loadMessageUnread();
        });
    }
    componentWillUnmount() {
        ws.endWsReceive(this.wsId);
        ws.close();
    }
    addXiaoHao() {
        nav.push(React.createElement(HaoSearch, null));
    }
    render() {
        let loc = parent === null ? 'null' : parent.location.href;
        let right = React.createElement(DropdownActions, { actions: this.rightMenu });
        return React.createElement(Page, { tabs: tabs, right: right });
    }
}
/*
<ButtonDropdown tag='div'
isOpen={this.state.dropdownOpen}
toggle={this.toggle}>
<DropdownToggle caret={true} size='sm'>+</DropdownToggle>
<DropdownMenu right={true}>
    <DropdownItem onClick={this.newApp}>新建App</DropdownItem>
    <DropdownItem>{loc}</DropdownItem>
</DropdownMenu>
</ButtonDropdown>;
*/ 
//# sourceMappingURL=index.js.map