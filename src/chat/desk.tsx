import * as React from 'react';
import * as className from 'classnames';
import {observer} from 'mobx-react';
import {Container, Row, Col, Button} from 'reactstrap';
import {List, EasyDate, LMR, FA, Muted, IconText, Prop, PropGrid} from 'tonva-react-form';
import {Page, nav, User} from 'tonva-tools';
import {Entities, Tuid} from 'tonva-react-usql-entities';
import {store, templetDict, DeskItem, Folder} from '../store';
import {Message} from '../model';
//import {UnitSpan, UserSpan} from '../tools';
import {ApplyDev, ApplyUnit, ApprovedDev, ApprovedUnit, UnitFollowInvite} from '../messages';
import {Chat} from '../store/chat';
import {JobsPage} from './jobs';
import {UserSpan} from './userSpan';
import {JobPage} from './job';
import { AppsPage } from './apps';
import {SendBox, PassBox, CcBox} from './folders';

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

    private async sendBox() {
        let folder = store.unit.chat.sendFolder;
        folder.scrollToBottom();
        await folder.first({tag:'$me'});
        nav.push(<SendBox />);
    }

    private async passBox() {
        let folder = store.unit.chat.passFolder;
        folder.scrollToBottom();
        await folder.first({tag:'$pass'});
        nav.push(<PassBox />);
    }
    
    private async ccBox() {
        let folder = store.unit.chat.ccFolder;
        folder.scrollToBottom();
        await folder.first({tag:'$cc'});
        nav.push(<CcBox />);
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
        nav.push(<JobPage msg={msg} />);
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
        let {desk, sendFolder, passFolder, ccFolder} = store.unit.chat;
        let {items, bottomDiv} = desk;
        let right = <Button onClick={this.clickApps} color="success" size="sm">功能应用</Button>;
        let footer = <div className="p-1">
            <Button color="primary" size="sm" onClick={this.clickPlus}><FA name="plus" /></Button>
            &nbsp; <div onClick={this.clickPlus}>发任务</div>
        </div>;
        let rows:Prop[] = [
            {
                type: 'component', 
                component: <FolderRow icon="share-square-o" text="我发出任务" undone={sendFolder.undone} />,
                onClick: this.sendBox
            },
            {
                type: 'component', 
                component: <FolderRow icon="clipboard" text="我经手任务" undone={passFolder.undone} />,
                onClick: this.passBox
            },
            {
                type: 'component', 
                component: <FolderRow icon="cc" text="抄送我的" undone={ccFolder.undone} />,
                onClick: this.ccBox
            },
        ];
        return <>
            <PropGrid className="mt-2" rows={rows} values={{}} />
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

interface FolderRowProps {
    icon: string;
    text: string;
    undone: number;
}
class FolderRow extends React.Component<FolderRowProps> {
    render() {
        let {icon, text, undone} = this.props;
        return <LMR className="w-100 align-items-center"
            left={<IconText iconClass="text-primary" icon={icon} text={text} />}
            right={undone>0? <span className="badge badge-info">{undone}</span>:undefined} />;
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
            from = <UserSpan userIds={[fromUser]} />;
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
