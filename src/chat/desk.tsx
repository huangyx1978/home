import * as React from 'react';
import * as className from 'classnames';
import {observer} from 'mobx-react';
import {Container, Row, Col, Button} from 'reactstrap';
import {List, EasyDate, LMR, FA, Muted} from 'tonva-react-form';
import {Page, nav, User} from 'tonva-tools';
import {Entities, Tuid} from 'tonva-react-usql-entities';
import {store, templetDict, DeskItem} from '../store';
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
export class DeskPage extends React.Component {
    constructor(props) {
        super(props);
        this.renderMessage = this.renderMessage.bind(this);
        this.clickMessage = this.clickMessage.bind(this);
    }
    async componentWillMount() {
    }
    componentDidUpdate() {
        let bd = store.unit.chat.desk.bottomDiv;
        let el = document.getElementById(bd);
        if (el) el.scrollIntoView();
    }
    private async clickMessage(deskItem:DeskItem) {
        let {id, read} = deskItem;
        if (read !== 1) await store.unit.chat.readMessage(id);
        let tuid = store.unit.chat.tuidMessage;
        let msg = tuid.getId(id);
        if (typeof msg === 'number') return;
        nav.push(<JobActionPage msg={msg} />);
    }
    private renderMessage(deskItem:DeskItem, index:number):JSX.Element {
        return <MsgRow deskItem={deskItem} />;
    }
    private async clickPlus():Promise<void> {
        //let templets = await store.unit.chat.getTemplets();
        //nav.push(<JobsPage templets={templets} />);
    }
    private clickApps() {
        nav.push(<AppsPage />);
    }
    render() {
        let {items, bottomDiv} = store.unit.chat.desk;
        let right = <Button onClick={this.clickApps} color="success" size="sm">功能应用</Button>;
        let footer = <div className="p-1">
            <Button color="primary" size="sm" onClick={this.clickPlus}><FA name="plus" /></Button>
            &nbsp; <div onClick={this.clickPlus}>发任务</div>
        </div>;
        //<Page header={store.unit.name} footer={footer} right={right}>
        return <>
            <List className="my-1"
                before={<Muted>读取中...</Muted>}
                none={<div className="p-2"><small style={{color:'lightgray'}}>暂无待办事项</small></div>}
                //items={store.unit.chat.messages.items} 
                items={items} 
                item={{
                    key:(item:any)=>item.id,
                    className: 'bg-transparent', 
                    render:this.renderMessage, 
                    onClick:this.clickMessage}} />
            <div id={bottomDiv}/>
        </>;
        //</Page>;
    }
}

interface MsgRowProps {
    deskItem: DeskItem;
}
const light = {fontSize:'x-small', color:'lightgray'};
@observer
class MsgRow extends React.Component<MsgRowProps> {
    render() {
        let userId = nav.user.id;
        let {tuidMessage, tuidUser} = store.unit.chat;
        let {deskItem} = this.props;
        let {id, read} = deskItem;
        let msg:Message = tuidMessage.getId(id);
        let rowCn = 'px-3 bg-white my-1';
        if (typeof msg === 'number') {
            return <LMR className={rowCn + ' py-2'}><small style={{color:'lightgray'}}>... {id} ...</small></LMR>;
        }
        let {date, type, fromUser, subject, discription, content} = msg;
        let td = templetDict[type];
        let cn, cnText;
        if (read === 1) {
            cn = 'mt-1 text-info';
            cnText = 'text-secondary';
        }
        else {
            cn = 'mt-1 text-danger';
            cnText = 'text-dark';
        }
        let from, size;
        if (fromUser != userId) {
            let user:User = tuidUser.getId(fromUser);
            if (user !== undefined) {
                from = <small>{user.nick || user.name}</small>;
            }
            else {
                from = <small>{fromUser}</small>;
            }
            size = '2x';
        }
        let caption;
        if (subject !== undefined) {
            caption = <div className="font-weight-bold">{subject}</div>
        }
        return <div className={rowCn + ' py-1 flex-column'}>
            <LMR left={<FA className={cn} size={size} name={(td && td.icon) || 'envelope'} />} >
                {from}
                <div style={light}><EasyDate date={date} /></div>
            </LMR>
            <div className="p-1">
                {caption}
                <div>{discription}</div>
            </div>
        </div>;
    }
}
//<span className={cnText}>{subject || content}</span>
//{disc}
