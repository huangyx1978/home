import * as React from 'react';
import * as _ from 'lodash';
import {nav, Page, Tab, DropdownActions, Action} from 'tonva-tools';
import {ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    Row, Col, Button, Form, FormGroup, Label, Input, 
    FormText, FormFeedback} from 'reactstrap';
import Home from './home';
import Follow from './follow';
import Find from './find';
import Me from './me';
import HaoSearch from './haoSearch';

/*
interface State {
    dropdownOpen: boolean;
}*/
export default class View extends React.Component<{}, null> {
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
    newApp() {
        nav.push(<HaoSearch />);
    }
    /*
    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }*/
    render() {
        let tabs:Tab[] = [
            {
                title: '同花',
                content: <Home />,
            },
            {
                title: '收录',
                content: <Follow />,
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