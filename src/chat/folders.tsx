import * as React from 'react';
import * as className from 'classnames';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {List, EasyDate, LMR, FA, Muted, PropGrid, Prop, Media, IconText} from 'tonva-react-form';
import {Page, nav} from 'tonva-tools';
import {store, Templet, sysTemplets, templetDict, UnitMessages, Item} from '../store';
import {Message} from '../model';

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
        await store.unit.chat.sendFolder.first({tag:'$me'});
        nav.push(<SendBox />);
    }

    private async passBox() {
        await store.unit.chat.passFolder.first({tag:'$pass'});
        nav.push(<PassBox />);
    }
    
    private async ccBox() {
        await store.unit.chat.ccFolder.first({tag:'$cc'});
        nav.push(<CcBox />);
    }
    
    private async allBox() {
        await store.unit.chat.allFolder.first({tag:'$'});
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
@observer
class MsgRow extends React.Component<MsgRowProps> {
    render() {
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
            {fromUser} <br/>
            <span style={{fontSize:'smaller'}}><EasyDate date={date} /></span>
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
    }
}

class SendBox extends React.Component {
    renderMessage(item:Item, index:number) {
        return <MsgRow item={item} />;
    }
    clickMessage(msg:Message) {

    }
    render() {
        let items = store.unit.chat.sendFolder.items;
        return <Page header="我发出任务">
            <List className="my-1"
                before={<Muted>[无内容]</Muted>}
                items={items} 
                item={{className: 'bg-transparent', render:this.renderMessage, onClick:this.clickMessage}} />
        </Page>;
    }
}

class PassBox extends React.Component {
    renderMessage(item:Item, index:number) {
        return <MsgRow item={item} />;
    }
    clickMessage(msg:Message) {

    }
    render() {
        let items = store.unit.chat.passFolder.items;
        return <Page header="我经手任务">
            <List className="my-1"
                before={<Muted>[无内容]</Muted>}
                items={items} 
                item={{className: 'bg-transparent', render:this.renderMessage, onClick:this.clickMessage}} />
        </Page>;
    }
}

class CcBox extends React.Component {
    renderMessage(item:Item, index:number) {
        return <MsgRow item={item} />;
    }
    clickMessage(msg:Message) {

    }
    render() {
        let items = store.unit.chat.ccFolder.items;
        return <Page header="已完成">
            <List className="my-1"
                before={<Muted>[无内容]</Muted>}
                items={items} 
                item={{className: 'bg-transparent', render:this.renderMessage, onClick:this.clickMessage}} />
        </Page>;
    }
}

class AllBox extends React.Component {
    renderMessage(item:Item, index:number) {
        return <MsgRow item={item} />;
    }
    clickMessage(msg:Message) {

    }
    render() {
        let items = store.unit.chat.allFolder.items;
        return <Page header="全部任务">
            <List className="my-1"
                before={<Muted>[无内容]</Muted>}
                items={items} 
                item={{className: 'bg-transparent', render:this.renderMessage, onClick:this.clickMessage}} />
        </Page>;
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