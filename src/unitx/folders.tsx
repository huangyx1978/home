import * as React from 'react';
import {observer} from 'mobx-react';
import {List, EasyDate, LMR, FA, Muted, PropGrid, Prop, Media, IconText} from 'tonva-react-form';
import {Page, nav, View, VPage} from 'tonva-tools';
import {templetDict} from 'store';
import {Message} from 'model';
import {UserSpan} from './userSpan';
import { CUnitxUq } from './cUnitxUq';
import { Item, FolderPageItems } from './models';
import { BoxId, tv } from 'tonva-react-uq';

export abstract class VFoldersView extends View<CUnitxUq> {
    private renderMessage = (item:Item, index:number) => {
        return React.createElement(MsgRow, item);
    }

    private clickMessage = (item:Item) => {
        let {message} = item;
        //let tuid = store.unit.unitx.tuid_message;
        //let msg:Message = {} as any; //tuid.valueFromId(id);
        if (typeof message === 'number') return;
        //nav.push(<JobPage msg={msg} />);
        this.controller.jobPage(message.obj);
    }
    
    protected folderView = ({header, folder}:FolderPageProps) => {
        //let {header, folder} = this.props;
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

export class MyFolders extends VFoldersView {
    private sendBox = async () => {
        let folder = this.controller.sendFolder;
        folder.scrollToBottom();
        await folder.first({tag:'$me', undone: 1});
        //nav.push(<SendBox />);
        this.openPage(this.folderView, {header:"我发出任务", folder:this.controller.sendFolder});
    }

    private passBox = async () => {
        let folder = this.controller.passFolder;
        folder.scrollToBottom();
        await folder.first({tag:'$pass', undone: 1});
        //nav.push(<PassBox />);
        this.openPage(this.folderView, {header:"我经手任务", folder:this.controller.passFolder});
    }
    
    private ccBox = async () => {
        let folder = this.controller.ccFolder;
        folder.scrollToBottom();
        await folder.first({tag:'$cc', undone: 1});
        //nav.push(<CcBox />);
        this.openPage(this.folderView, {header:"抄送我的", folder:this.controller.ccFolder});
    }

    private folderRow = observer(({icon, text, folder}:{icon:string, text:string, folder:any}) => {
        let {doing, undone} = folder;
        let right;
        if (undone > 0) {
            right = <>
                {doing>0? <span className="badge badge-info">{doing}</span>:undefined}
                <span className="badge badge-light">{undone}</span>
            </>;
        }
        return <LMR className="w-100 align-items-center my-2 text-dark"
            left={<FA className="text-info mr-3" name={icon} />}
            right={right}>
            {text}
        </LMR>;
    })
    
    render() {
        let {desk, sendFolder, passFolder, ccFolder} = this.controller;
        let rows:Prop[] = [
            '=',
            {
                type: 'component', 
                component: <this.folderRow icon="share-square-o" text="我发出任务" folder={sendFolder} />,
                onClick: this.sendBox
            },
            {
                type: 'component', 
                component: <this.folderRow icon="clipboard" text="我经手任务" folder={passFolder} />,
                onClick: this.passBox
            },
            {
                type: 'component', 
                component: <this.folderRow icon="cc" text="抄送我的" folder={ccFolder} />,
                onClick: this.ccBox
            },
        ]
        return <PropGrid rows={rows} values={{}} />;
    }
}

export class WholeFolders extends VFoldersView {
    private allBox = async () => {
        let folder = this.controller.allFolder;
        folder.scrollToBottom();
        await folder.first({tag:'$'});
        //nav.push(<AllBox />);
        this.openPage(this.folderView, {header:"全部任务", folder:this.controller.allFolder});
    }

    private archiveBox = async () => {
        nav.push(<ArchiveBox />);
    }

    private rows:Prop[] = [
        '',
        {
            type: 'component', 
            component: <IconText iconClass="text-primary" textClass="d-inline-block ml-3" icon="building" text="全部" />,
            onClick: this.allBox
        },
        {
            type: 'component', 
            component: <IconText iconClass="text-primary" textClass="d-inline-block ml-3" icon="archive" text="已归档" />,
            onClick: this.archiveBox
        },
    ];
    render() {
        return <PropGrid rows={this.rows} values={{}} />;
    }
}

const lnRegx = /\\r\\\\n|\\r|\\n/;
const light = {fontSize:'x-small', color:'lightgray'};
const MsgRow = (item: Item) => {
    let userId = nav.user.id;
    //let {tuid_message} = store.unit.unitx;
    let {message, branch, done, flow} = item;
    //let msg:Message = {} as any; //tuid_message.valueFromId(id);
    let rowCn = 'px-3 bg-white my-1';
    if (typeof message === 'number') {
        return <LMR className={rowCn + ' py-2'}><small style={{color:'lightgray'}}>... {message} ...</small></LMR>;
    }

    let tmo = typeof message.obj;
    if (tmo === 'number' || tmo === 'string') {
        return <>MSG: {message.id}</>;
    }
    let {date, type, fromUser, subject, discription, content} = message.obj;
    
    let right = done<branch?
        flow && <FA className="text-info" name="file-text-o" /> :
        <FA className="text-success" name="check-circle" />;
    let dateDiv = <div style={light}><EasyDate date={date} /></div>;
    let header;
    if (fromUser.id != userId) {
        let td = templetDict[type];
        let icon = <FA className="mt-1 text-info" size={'2x'} name={(td && td.icon) || 'envelope'} />;
        header = <LMR 
            left={icon}
            right={right}>
            {tv(fromUser)}
            {dateDiv}
        </LMR>;
        //<UserSpan userIds={[fromUser]} />
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
};

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
    folder: FolderPageItems<Item>;
}

class ArchiveBox extends React.Component {
    renderMessage(item:Item, index:number) {
        return React.createElement(MsgRow, item);
    }
    clickMessage(msg:Message) {

    }
    render() {
        return <Page header="已归档">
            <div className="p-3">归档正在建设中...</div>
        </Page>;
    }
}
