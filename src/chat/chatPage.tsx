import * as React from 'react';
import * as className from 'classnames';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {List, EasyDate, LMR, FA, Muted} from 'tonva-react-form';
import {Page, nav} from 'tonva-tools';
import {Entities} from 'tonva-react-usql-entities';
import {store} from '../store';
import {Message} from '../model';
import {UnitSpan, UserSpan} from '../tools';
import {ApplyDev, ApplyUnit, ApprovedDev, ApprovedUnit, UnitFollowInvite} from '../messages';
import {Chat} from '../store/chat';
import {JobsPage} from './jobs';
import {JobActionPage} from './jobAction';
import { AppsPage } from './apps';

const typeMessageMap:{[type:string]: new (props:{msg:Message}) => React.Component<{msg:Message}>} = {
    "apply-unit": ApplyUnit,
    "apply-dev": ApplyDev,
    "approve-unit": ApprovedUnit,
    "approve-dev": ApprovedDev,
    "unit-follow-invite": UnitFollowInvite,
};

@observer
export class ChatPage extends React.Component {
    constructor(props) {
        super(props);
        /*
        this.onDevClick = this.onDevClick.bind(this);
        this.onUnitClick = this.onUnitClick.bind(this);
        this.onCreateDevClick = this.onCreateDevClick.bind(this);
        this.onCreateUnitClick = this.onCreateUnitClick.bind(this);
        */
        this.renderMessage = this.renderMessage.bind(this);
        this.clickMessage = this.clickMessage.bind(this);
    }
    async componentWillMount() {
        //let ret = await store.unit.getChatApi();
        //let chat = store.unit.chat;
        //await chat.messages.first(undefined);
    }
    private clickMessage(msg:Message) {
        nav.push(<JobActionPage msg={msg} />);
    }
    private renderMessage(msg:Message, index:number):JSX.Element {
        let Tag = typeMessageMap[msg.type];
        if (Tag === undefined) {
            //return <div className="px-2 py-1 bg-white">任务: {JSON.stringify(msg)}</div>;
            let {id, date, content} = msg;
            return <LMR className="px-2 py-1 bg-white"
                left={<Muted>{id}</Muted>} 
                right={<Muted><EasyDate date={date} /></Muted>}>{content}</LMR>;
        }
        return <Tag msg={msg} />;
    }
    private clickPlus() {
        nav.push(<JobsPage />);
    }
    private clickApps() {
        nav.push(<AppsPage />);
    }
    render() {
        let right = <Button onClick={this.clickApps} color="success" size="sm">功能应用</Button>;
        let footer = <div className="p-1">
            <Button color="primary" size="sm" onClick={this.clickPlus}><FA name="plus" /></Button>
            &nbsp; <div onClick={this.clickPlus}>发任务</div>
        </div>;
        return <Page header={store.unit.name} footer={footer} right={right}>
            <List className="my-1"
                before={<Muted>[无内容]</Muted>}
                items={store.unit.chat.messages.items} 
                item={{className: 'bg-transparent', render:this.renderMessage, onClick:this.clickMessage}} />
        </Page>;
    }
}
