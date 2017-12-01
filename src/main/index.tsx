import * as React from 'react';
import * as _ from 'lodash';
import {nav, Page, Tab} from 'tonva-tools';
import {ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    Row, Col, Button, Form, FormGroup, Label, Input, 
    FormText, FormFeedback} from 'reactstrap';
import Home from './home';
import Follow from './follow';
import Find from './find';
import Me from './me';
import HaoSearch from './haoSearch';
//import {Home, Follow, Find, Me, HaoSearch} from './components';
//import api from './api';
/*
interface TabProps {
    title: string;
    icon: string;
    cur: boolean;
    onClick: () => void;
}
class TabView extends React.Component<TabProps, null> {
    constructor() {
        super();
    }
    render() {
        let p = this.props;
        return <div className={p.cur ? 'cur' : ''} onClick={() => this.props.onClick()}>{p.title}</div>;
    }
}

interface Tab {
    title: string;
    icon: string;
}
interface HomeState {
    cur: number;
    homeItems: any[];
    dropdownOpen: boolean;
}
export default class HomeIndex extends React.Component<{}, HomeState> {
    private tabs: Tab[] = [
        {
            title: '首页',
            icon: 'b',
        },
        {
            title: '发现',
            icon: 'b' 
        },
        {
            title: '关注',
            icon: 'b'
        },
        {
            title: '我',
            icon: 'b'
        },
    ];
    constructor() {
        super();
        this.state = {
            cur: 0,
            homeItems: [],
            dropdownOpen: false
        };
        this.toggle = this.toggle.bind(this);
        this.newApp = this.newApp.bind(this);
        this.addApp = this.addApp.bind(this);
    }
    newApp() {
        nav.push(<Components.AppSearch />);
    }
    maxItemId(items:any[]) {
        let itemId = 0;
        items.forEach(v => {
            if (v.itemId>itemId) itemId = v.itemId;
        })
        return itemId;
    }
    addApp() {
        let items = this.state.homeItems.slice();
        let len = items.length;
        if (len === 0) return;
        let item = _.clone(items[0]);
        item.itemId = this.maxItemId(items) + 1;
        items.splice(len, 0, item);
        this.setState({
            homeItems: items
        });
    }
    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }
    componentWillMount() {
        let c = app.local.homeTabCur.get() || 0;
        this.setState({
            cur: c
        });
        api.home.items().then(res => {
            //this.homeItems = res;
            //nav.show(this.loginedView); //<HomeView />);
            this.setState({homeItems: res});
        });
    }
    tabClick(index: number) {
        app.local.homeTabCur.set(index);
        this.setState({cur: index});
    }    
    render() {
        let footer = <div>{
            this.tabs.map((t, i) => 
                <TabView key={i} title={t.title} icon={t.icon} 
                    cur={i === this.state.cur} 
                    onClick={() => this.tabClick(i)}/>
            )
        }
        </div>;
        let right= <ButtonDropdown tag='div' isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret={true} size='sm'>+</DropdownToggle>
            <DropdownMenu right={true}>
                <DropdownItem onClick={this.newApp}>新建App</DropdownItem>
                <DropdownItem onClick={this.addApp}>测试添加App</DropdownItem>
            </DropdownMenu>
        </ButtonDropdown>;
        let cur = this.state.cur;
        function visStyle(index:number) {
            if (cur !== index) return {
                visibility: 'hidden'
            };
        }
        return (
            <Page
                header={this.tabs[cur].title} 
                right={right}
                footer={footer}>
                <Components.Home style={visStyle(0)} items={this.state.homeItems} />
                <Components.Find style={visStyle(1)} />
                <Components.Follow style={visStyle(2)} />
                <Components.Me style={visStyle(3)}  />
            </Page>
        );
    }
}
*/

let arr = [];
for (let i=1; i<=100; i++) arr.push(i);

class TestTab extends React.Component<{}, null> {
    componentDidMount() {
        let s = null;
    }
    render() {
        return <div>
                {
                    arr.map(v => <div key={v}>
                        {v}: b1 bbb ddd 
                    </div>)}
        </div>;
    }
}

interface State {
    dropdownOpen: boolean;
}
export default class View extends React.Component<{}, State> {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.newApp = this.newApp.bind(this);
        //this.onAppGroupChanged = this.onAppGroupChanged.bind(this);
        this.state = {
            dropdownOpen: false
        };
    }
    newApp() {
        nav.push(<HaoSearch />);
    }
    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }
    render() {
        let tabs:Tab[] = [
            {
                title: '同花',
                content: <Home />,
            },
            {
                title: '关注',
                content: <Follow />,
            },
            {
                title: 'b',
                content: <TestTab />,
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
        let right = 
            <ButtonDropdown tag='div' 
                isOpen={this.state.dropdownOpen}
                toggle={this.toggle}>
                <DropdownToggle caret={true} size='sm'>+</DropdownToggle>
                <DropdownMenu right={true}>
                    <DropdownItem onClick={this.newApp}>新建App</DropdownItem>
                    <DropdownItem>{loc}</DropdownItem>
                </DropdownMenu>
            </ButtonDropdown>;
        return <Page tabs={tabs} right={right} />
    }
}
