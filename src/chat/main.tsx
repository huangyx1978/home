import * as React from 'react';
import {computed} from 'mobx';
import {Button} from 'reactstrap';
import {Page, Tab, nav, isBridged} from 'tonva-tools';
import {Action, DropdownActions} from 'tonva-react-form';
import {store, templetDict} from '../store';
import {DeskPage} from './desk';
import {AppsPage} from './apps';
import {JobsPage} from './jobs';
import {Folders} from './folders';

const tabs:Tab[] = [
    {
        title: '待办',
        content: <DeskPage />,
        redDot: computed(()=>{
            return store.unit.chat.desk.items.length;
        })
    },
    {
        title: '查看',
        content: <Folders />,
    },
    {
        title: '新任务',
        content: <JobsPage />,
        //redDot: computed(()=>store.follow.newInvitesCount),
    },
    {
        title: '应用',
        content: <AppsPage />,
        //redDot: computed(()=>store.follow.newInvitesCount),
    },
];

export class MainPage extends React.Component {
    private rightMenu:Action[] = [
        {
            caption: '取消关注',
            icon: 'trash',
            action: this.unleash,
        }
    ];
    constructor(props) {
        super(props);
        this.unleash = this.unleash.bind(this);
    }
    async unleash() {
        if (confirm("真的要取消关注吗？") === false) return;
        await store.unfollowUnit();
        nav.pop();
    }
    async clickToAdmin() {
        let adminApp = await store.getAdminApp();
        //nav.push(<UnitMan {...this.props} />);
        let unitId = store.unit.id;
        isBridged();
        nav.navToApp(adminApp.url, unitId);
    }
    render() {
        let {id, name, discription, apps, icon, ownerName, ownerNick, isOwner, isAdmin} = store.unit;
        if (ownerNick !== undefined) ownerNick = '- ' + ownerNick;
        let right;
        if (isOwner === 1 || isAdmin === 1) {
            right = <Button color="success" size="sm" onClick={()=>this.clickToAdmin()}>进入管理</Button>;
        }
        else if (id > 0) {
            right = <DropdownActions actions={this.rightMenu} />;
        }
        return <Page tabs={tabs} header={store.unit.name} keepHeader={true} right={right} />;
    }
}
