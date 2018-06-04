import * as React from 'react';
import {computed} from 'mobx';
import {Page, Tab} from 'tonva-tools';
import {store, templetDict} from '../store';
import {ChatPage} from './chatPage';
import {AppsPage} from './apps';
import {JobsPage} from './jobs';
import {Folders} from './folders';

const tabs:Tab[] = [
    {
        title: '待办',
        content: <ChatPage />,
        redDot: computed(()=>{
            return store.unit.chat.messages.items.length;
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
    render() {
        return <Page tabs={tabs} header={store.unit.name} keepHeader={true} />;
    }
}
