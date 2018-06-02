import * as React from 'react';
import {Page, Tab} from 'tonva-tools';
import {store, templetDict} from '../store';
import {ChatPage} from './chatPage';
import {AppsPage} from './apps';
import {JobsPage} from './jobs';

const tabs:Tab[] = [
    {
        title: '待办',
        content: <ChatPage />,
        /*
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
        }),*/
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
