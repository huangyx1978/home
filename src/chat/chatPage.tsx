import * as React from 'react';
import * as className from 'classnames';
import {observer} from 'mobx-react';
import {Container, Row, Col, Button} from 'reactstrap';
import {List, EasyDate, LMR, FA, Muted} from 'tonva-react-form';
import {Page, nav} from 'tonva-tools';
import {Entities} from 'tonva-react-usql-entities';
import {store, templetDict} from '../store';
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
const lnRegx = /\\r\\\\n|\\r|\\n/;

@observer
export class ChatPage extends React.Component {
    constructor(props) {
        super(props);
        this.renderMessage = this.renderMessage.bind(this);
        this.clickMessage = this.clickMessage.bind(this);
    }
    async componentWillMount() {
    }
    private clickMessage(msg:Message) {
        nav.push(<JobActionPage msg={msg} />);
    }
    private renderMessage(msg:Message, index:number):JSX.Element {
        let Tag = typeMessageMap[msg.type];
        if (Tag === undefined) {
            //return <div className="px-2 py-1 bg-white">任务: {JSON.stringify(msg)}</div>;
            let {id, date, type, fromUser, subject, discription, content} = msg;
            let disc, lines:string[];
            if (discription !== undefined) {
                lines = discription.split(lnRegx, 3);
                if (lines.length === 3) {
                    lines.pop();
                    lines.push('...');
                }
                disc = <div className="chat-row-discription">{
                    lines.map((v,index) => <React.Fragment key={index}>{v}<br/></React.Fragment>)}
                </div>
            }
            let right = <Muted className="text-right">
                {fromUser}<br/>
                <span style={{fontSize:'smaller'}}><EasyDate date={date} /></span>
            </Muted>;
            let td = templetDict[type];
            return <LMR className="px-2 py-1 bg-white"
                left={<FA className="text-info mt-1" name={(td && td.icon) || 'envelope'} />} 
                right={right}>
                {subject || content}
                {disc}
            </LMR>;
        }
        return <Tag msg={msg} />;
    }
    private async clickPlus():Promise<void> {
        //let templets = await store.unit.chat.getTemplets();
        //nav.push(<JobsPage templets={templets} />);
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
        //<Page header={store.unit.name} footer={footer} right={right}>
        return <List className="my-1"
                before={<Muted>[无内容]</Muted>}
                items={store.unit.chat.messages.items} 
                item={{className: 'bg-transparent', render:this.renderMessage, onClick:this.clickMessage}} />
        //</Page>;
    }
}
