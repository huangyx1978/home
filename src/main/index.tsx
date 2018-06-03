import * as React from 'react';
import * as _ from 'lodash';
import {computed} from 'mobx';
import {nav, Page, Tab, WSChannel} from 'tonva-tools';
import {Action, DropdownActions} from 'tonva-react-form';
import {ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    Row, Col, Button, Form, FormGroup, Label, Input, 
    FormText, FormFeedback} from 'reactstrap';
import {store} from '../store';
import Home from './home';
import Follow from './follow';
import Find from './find';
import Me from './me';
import HaoSearch from './haoSearch';

const ws = new WSChannel(process.env.REACT_APP_WSHOST, undefined);

const tabs:Tab[] = [
    {
        title: '同花',
        content: <Home />,
        redDot: computed(()=>{
            let sum = 0;
            //store.messageUnreadDict.forEach(v=>sum+=v);
            let unitDict = store.units;
            unitDict.forEach(unit => {
                let messages = unit.messages;
                if (messages === undefined) return;
                let unread = messages.unread;
                if (unread !== undefined) sum += unread;
            });
            return -sum;
        }),
    },
    {
        title: '收录',
        content: <Follow />,
        redDot: computed(()=>store.follow.newInvitesCount),
    },
    {
        title: '发现',
        content: <Find />,
    },
    {
        title: '我',
        content: <Me />,
    }
];

export default class View extends React.Component<{}, null> {
    private wsId:number;  
    private rightMenu:Action[] = [
        {
            caption: '添加小号',
            icon: 'plus',
            action: this.addXiaoHao,
        }
    ];
    constructor(props) {
        super(props);
        this.addXiaoHao = this.addXiaoHao.bind(this);
        this.onWs = this.onWs.bind(this);
    }
    async componentDidMount() {
        await ws.connect();
        this.wsId = ws.onWsReceiveAny(this.onWs);
        await store.loadMessageUnread();
    }
    private async onWs(msg:any):Promise<void> {
        console.log('ws received: %s' + msg);
        store.onWs(msg);
    }
    componentWillUnmount() {
        ws.endWsReceive(this.wsId);
        ws.close();
    }
    addXiaoHao() {
        nav.push(<HaoSearch />);
    }
    render() {
        let loc = parent===null? 'null':parent.location.href;
        let right = <DropdownActions actions={this.rightMenu} />;
        return <Page tabs={tabs} right={right} />
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