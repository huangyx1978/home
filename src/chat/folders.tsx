import * as React from 'react';
import {observer} from 'mobx-react';
import {List, EasyDate, LMR, FA, Muted, PropGrid, Prop, Media, IconText} from 'tonva-react-form';
import {Page, nav} from 'tonva-tools';
import {store, Folder, Templet, sysTemplets, templetDict, UnitMessages, Item} from '../store';
import {Message} from '../model';
import {UserSpan} from './userSpan';
import {JobPage} from './job';

export class MyFolders extends React.Component {
    private async sendBox() {
        let folder = store.unit.chat.sendFolder;
        folder.scrollToBottom();
        await folder.first({tag:'$me', undone: 1});
        nav.push(<SendBox />);
    }

    private async passBox() {
        let folder = store.unit.chat.passFolder;
        folder.scrollToBottom();
        await folder.first({tag:'$pass', undone: 1});
        nav.push(<PassBox />);
    }
    
    private async ccBox() {
        let folder = store.unit.chat.ccFolder;
        folder.scrollToBottom();
        await folder.first({tag:'$cc', undone: 1});
        nav.push(<CcBox />);
    }
    
    render() {
        let {desk, sendFolder, passFolder, ccFolder} = store.unit.chat;
        let rows:Prop[] = [
            '=',
            {
                type: 'component', 
                component: <FolderRow icon="share-square-o" text="我发出任务" folder={sendFolder} />,
                onClick: this.sendBox
            },
            {
                type: 'component', 
                component: <FolderRow icon="clipboard" text="我经手任务" folder={passFolder} />,
                onClick: this.passBox
            },
            {
                type: 'component', 
                component: <FolderRow icon="cc" text="抄送我的" folder={ccFolder} />,
                onClick: this.ccBox
            },
        ]
        return <PropGrid rows={rows} values={{}} />;
    }
}

interface FolderRowProps {
    icon: string;
    text: string;
    folder: Folder<Item>;
}
@observer
class FolderRow extends React.Component<FolderRowProps> {
    render() {
        let {icon, text, folder} = this.props;
        let {doing, undone} = folder;
        let right;
        if (undone > 0) {
            right = <>
                {doing>0? <span className="badge badge-info">{doing}</span>:undefined}
                <span className="badge badge-light">{undone}</span>
            </>;
        }
        return <LMR className="w-100 align-items-center"
            left={<IconText iconClass="text-primary" icon={icon} text={text} />}
            right={right} />;
    }
}

export class WholeFolders extends React.Component {
    private rows:Prop[] = [
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
    private async allBox() {
        let folder = store.unit.chat.allFolder;
        folder.scrollToBottom();
        await folder.first({tag:'$'});
        nav.push(<AllBox />);
    }

    private async archiveBox() {
        nav.push(<ArchiveBox />);
    }

    render() {
        return <PropGrid rows={this.rows} values={{}} />;
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
        let {tuid_message} = store.unit.chat;
        let {item} = this.props;
        let {id, branch, done, flow} = item;
        let msg:Message = tuid_message.getId(id);
        let rowCn = 'px-3 bg-white my-1';
        if (typeof msg === 'number') {
            return <LMR className={rowCn + ' py-2'}><small style={{color:'lightgray'}}>... {id} ...</small></LMR>;
        }
        let {date, type, fromUser, subject, discription, content} = msg;
        let right = done<branch?
            flow && <FA className="text-info" name="file-text-o" /> :
            <FA className="text-success" name="check-circle" />;
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
        let tuid = store.unit.chat.tuid_message;
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