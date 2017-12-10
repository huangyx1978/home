import * as React from 'react';
import * as _ from 'lodash';
import {computed} from 'mobx';
import {nav, Page, Tab, DropdownActions, Action, ws} from 'tonva-tools';
import {ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    Row, Col, Button, Form, FormGroup, Label, Input, 
    FormText, FormFeedback} from 'reactstrap';
import {mainData} from '../mainData';
import Home from './home';
import Follow from './follow';
import Find from './find';
import Me from './me';
import HaoSearch from './haoSearch';

const tabs:Tab[] = [
    {
        title: '同花',
        content: <Home />,
        redDot: computed(()=>-2),
    },
    {
        title: '收录',
        content: <Follow />,
        redDot: computed(()=>mainData.newFellowInvitesCount),
    },
    {
        title: 'b',
        content: <div />,
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
            caption: '新建App',
            action: this.newApp,
        }
    ];
    constructor(props) {
        super(props);
        //this.toggle = this.toggle.bind(this);
        this.newApp = this.newApp.bind(this);
        //this.onAppGroupChanged = this.onAppGroupChanged.bind(this);
        /*
        this.state = {
            dropdownOpen: false
        };*/
    }
    async componentDidMount() {
        await ws.connect();
        this.wsId = ws.onWsReceiveAny((msg) => mainData.onWs(msg));
        await mainData.loadMessages();
    }
    componentWillUnmount() {
        ws.endWsReceive(this.wsId);
        ws.close();
    }
    newApp() {
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