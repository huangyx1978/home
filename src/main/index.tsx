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

const tabs:Tab[] = [
    {
        title: '同花',
        content: <Home />,
        redDot: computed(()=>{
            let sum = 0;
            //store.messageUnreadDict.forEach(v=>sum+=v);
            let unitDict = store.units;
            unitDict.forEach(unit => {
                //let messages = unit.messages;
                //if (messages === undefined) return;
                let unread = unit.unread;
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

export default class AppView extends React.Component {
    private rcvHandler: number;
    private addXiaoHao = async () => nav.push(<HaoSearch />);
    private rightMenu:Action[] = [
        {
            caption: '添加小号',
            icon: 'plus',
            action: this.addXiaoHao,
        }
    ];
    async componentDidMount() {
        this.rcvHandler = nav.registerReceiveHandler(this.onWs);
        // await store.loadMessageUnread();
    }
    private onWs = async (msg:any):Promise<void> => {
        console.log('ws received: %s' + msg);
        store.onWs(msg);
    }
    componentWillUnmount() {
        nav.unregisterReceiveHandler(this.rcvHandler);
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