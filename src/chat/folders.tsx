import * as React from 'react';
import * as className from 'classnames';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {List, EasyDate, LMR, FA, Muted, PropGrid, Prop, Media, IconText} from 'tonva-react-form';
import {Page, nav} from 'tonva-tools';
import {store, Folder, Templet, sysTemplets, templetDict, UnitMessages, Item} from '../store';
import {Message} from '../model';
import {UserSpan} from './userSpan';
import {JobPage} from './job';

export class Folders extends React.Component {
    private rows:Prop[] = [
        '',
        {
            type: 'component', 
            component: <IconText iconClass="text-primary" icon="share-square-o" text="我发出任务" />,
            onClick: this.sendBox
        },
        {
            type: 'component', 
            component: <IconText iconClass="text-primary" icon="clipboard" text="我经手任务" />,
            onClick: this.passBox
        },
        {
            type: 'component', 
            component: <IconText iconClass="text-primary" icon="cc" text="抄送我的" />,
            onClick: this.ccBox
        },
        '',
        {
            type: 'component', 
            component: <IconText iconClass="text-primary" icon="building" text="全部" />,
            onClick: this.allBox
        },
        {
            type: 'component', 
            component: <IconText iconClass="text-primary" icon="archive" text="已归档" />,
            onClick: this.archiveBox
        },
    ];

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
    
    private async allBox() {
        let folder = store.unit.chat.allFolder;
        folder.scrollToBottom();
        await folder.first({tag:'$'});
        nav.push(<AllBox />);
    }

    private async archiveBox() {
        //await store.unit.chat.archiveFolder.first({type:0});
        nav.push(<ArchiveBox />);
    }

    render() {
        return <div>
            <PropGrid rows={this.rows} values={{}} />
        </div>;
    }
}

const lnRegx = /\\r\\\\n|\\r|\\n/;
interface MsgRowProps {
    item: Item
}
const light = {fontSize:'x-small', color:'lightgray'};
@observer
class MsgRow extends React.Component<MsgRowProps> {
    render() {
        let userId = nav.user.id;
        let {tuidMessage} = store.unit.chat;
        let {item} = this.props;
        let {id, branch, done} = item;
        let msg:Message = tuidMessage.getId(id);
        let rowCn = 'px-3 bg-white my-1';
        if (typeof msg === 'number') {
            return <LMR className={rowCn + ' py-2'}><small style={{color:'lightgray'}}>... {id} ...</small></LMR>;
        }
        let {date, type, fromUser, subject, discription, content} = msg;
        let rc, rtext;
        if (done<branch) {
            rc = 'text-danger';
            rtext = '待办';
        }
        else {
            rc = 'text-success';
            rtext = '完成';
        }
        let right = <small className={rc}>[{rtext}]</small>;
        let dateDiv = <div style={light}><EasyDate date={date} /></div>;
        let header;
        if (fromUser != userId) {
            let td = templetDict[type];
            let icon = <FA className="mt-1 text-info" size={'2x'} name={(td && td.icon) || 'envelope'} />;
            header = <LMR 
                left={icon}
                right={right}>
                {<UserSpan userIds={[fromUser]} />}
                {dateDiv}
            </LMR>;
        }
        else {
            header = <LMR 
                left={dateDiv}
                right={right} />
        }
        let caption;
        if (subject !== undefined) {
            caption = <div className="font-weight-bold">{subject}</div>
        }
        return <div className={rowCn + ' py-1 flex-column'}>
            {header}
            <div className="py-1">
                {caption}
                <div>{discription}</div>
            </div>
        </div>;
/*
        let tuid = store.unit.chat.tuidMessage;
        let {id, branch, done} = this.props.item;
        let msg = tuid.getId(id);
        let rowCn = 'px-2 bg-white';
        if (typeof msg === 'number') {
            return <LMR className={rowCn + ' py-2'}><small style={{color:'lightgray'}}>... {id} ...</small></LMR>;
        }
        let {date, type, fromUser, subject, discription, content} = msg;
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
            <UserSpan userIds={[fromUser]} /> <br/>
            <small style={{fontSize:'smaller'}}><EasyDate date={date} /></small>
        </Muted>;
        let td = templetDict[type];
        return <LMR className={rowCn + ' py-1'}
            left={<FA className="text-info mt-1" name={(td && td.icon) || 'envelope'} fixWidth={true} />} 
            right={right}>
            {
                done<branch? 
                    <small className="text-danger">[待办] &nbsp;</small>:
                    <small className="text-success">[完成] &nbsp;</small>
            }
            {subject || content}
            {disc}
        </LMR>;
*/        
    }
}

interface BottomDivProps {
    bottomId: string;
}
class BottomDiv extends React.Component<BottomDivProps> {
    private bottomTimer:any;
    constructor(props) {
        super(props);
        this.onAnyInput = this.onAnyInput.bind(this);
    }
    componentDidMount() {
        let bd = this.props.bottomId;
        this.bottomTimer = setInterval(()=> {
            let el = document.getElementById(bd);
            if (el) el.scrollIntoView();
        }, 100);
    }
    onAnyInput() {
        if (this.bottomTimer !== undefined) {
            clearInterval(this.bottomTimer);
            this.bottomTimer = undefined;
        }
    }
    render() {
        return <div onTouchStartCapture={this.onAnyInput}
            onWheelCapture={this.onAnyInput}
            onMouseDownCapture={this.onAnyInput}
            onKeyPressCapture={this.onAnyInput}>
            {this.props.children}
            <div id={this.props.bottomId} />
        </div>
    }
}

interface FolderPageProps {
    header: any;
    folder: Folder<Item>;
}
class FolderPage extends React.Component<FolderPageProps> {
    renderMessage(item:Item, index:number) {
        return <MsgRow item={item} />;
    }
    clickMessage(item:Item) {
        let {id} = item;
        let tuid = store.unit.chat.tuidMessage;
        let msg = tuid.getId(id);
        if (typeof msg === 'number') return;
        nav.push(<JobPage msg={msg} />);
    }
    render() {
        let {header, folder} = this.props;
        let {items, bottomDiv} = folder;
        return <Page header={header}>
            <BottomDiv bottomId={bottomDiv}>
                <List className="my-1"
                    before={<Muted>[无内容]</Muted>}
                    items={items} 
                    item={{className: 'bg-transparent', render:this.renderMessage, onClick:this.clickMessage}} />
            </BottomDiv>
        </Page>;
    }
}

export class SendBox extends React.Component {
    render() {
        return <FolderPage header="我发出任务" folder={store.unit.chat.sendFolder} />;
    }
}

export class PassBox extends React.Component {
    render() {
        return <FolderPage header="我经手任务" folder={store.unit.chat.passFolder} />;
    }
}

export class CcBox extends React.Component {
    render() {
        return <FolderPage header="抄送我的" folder={store.unit.chat.ccFolder} />;
    }
}

class AllBox extends React.Component {
    render() {
        return <FolderPage header="全部任务" folder={store.unit.chat.allFolder} />;
    }
}

class ArchiveBox extends React.Component {
    renderMessage(item:Item, index:number) {
        return <MsgRow item={item} />;
    }
    clickMessage(msg:Message) {

    }
    render() {
        return <Page header="已归档">
            <div className="p-3">归档正在建设中...</div>
        </Page>;
    }
}
/*
<List className="my-1"
before={<Muted>[无内容]</Muted>}
items={this.props.items} 
item={{className: 'bg-transparent', render:this.renderMessage, onClick:this.clickMessage}} />
*/