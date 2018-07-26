import * as React from 'react';
import {computed} from 'mobx';
import {Page, Tab, nav, isBridged} from 'tonva-tools';
import {Action, DropdownActions} from 'tonva-react-form';
import {store, templetDict} from 'store';
import {DeskPage} from './desk';
import {AppsPage} from './apps';
import {JobsPage} from './jobs';
import {Queries} from './queries';

const tabs:Tab[] = [
    {
        title: '待办',
        content: <DeskPage />,
        redDot: computed(()=>{
            return store.unit.unitx.desk.items.length;
        })
    },
    {
        title: '新建',
        content: <JobsPage />,
        //redDot: computed(()=>store.follow.newInvitesCount),
    },
    {
        title: '查看',
        content: <Queries />,
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
        if (id > 0) {
            right = <DropdownActions actions={this.rightMenu} />;
        }
        return <Page tabs={tabs} header={store.unit.name} keepHeader={true} right={right} />;
    }
}
