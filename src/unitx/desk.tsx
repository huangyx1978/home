import * as React from 'react';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import {List, EasyDate, LMR, FA, Muted, IconText, Prop, PropGrid} from 'tonva-react-form';
import {Page, nav, VmView} from 'tonva-tools';
import {templetDict, DeskItem, Folder, Item} from 'store';
import {Message} from 'model';
//import {ApplyDev, ApplyUnit, ApprovedDev, ApprovedUnit, UnitFollowInvite} from 'messages';
import { navToAppId } from 'navToApp';
import { IdBox } from 'tonva-react-usql';
import { CrUnitxUsq } from './crUnitxUsq';
import { UserSpan } from './userSpan';

const light = {fontSize:'x-small', color:'lightgray'};

export class DeskPage extends VmView<CrUnitxUsq> {
    //protected coordinator: CrUnitxUsq;
    /*
    componentDidMount() {
        let bd = store.unit.unitx.desk.bottomDiv;
        let el = document.getElementById(bd);
        if (el) el.scrollIntoView();
    }
    */
    private clickMessage = async (deskItem:DeskItem) => {
        let {message, read} = deskItem;
        let idBox:IdBox = message as any;
        if (read !== 1) await this.coordinator.readMessage(idBox.id);
        let {unit} = this.coordinator;
        //let tuid = this.coordinator.tuid_message;
        //let msg = tuid.valueFromId(id);
        let msg = idBox.obj;
        if (typeof message === 'number') return;
        let {type} = msg;
        switch (type) {
            default:
                //nav.push(<JobPage msg={msg} />);
                this.coordinator.jobPage(msg);
                break;
            case 'sheetMsg':
                //alert(JSON.stringify(msg));
                let obj = JSON.parse(msg.content);
                let {app:appId, id:sheetId, usq:usqId, sheet:sheetType} = obj;
                await navToAppId(appId, usqId, unit.id, sheetType, sheetId);
                break;
        }
    }
    private renderMessage = (deskItem:DeskItem, index:number):JSX.Element => {
        return <this.msgRow {...deskItem} />;
    }
    private clickPlus = async ():Promise<void> => {
        //let templets = await store.unit.chat.getTemplets();
        //nav.push(<JobsPage templets={templets} />);
    }
    private clickApps = () => {
        //this.openPage(AppsPage);
        //nav.push(<AppsPage />);
        this.coordinator.showAppsPage();
    }

    render() {
        return <this.view />;
    }
    private view = () => {
        let {desk} = this.coordinator;
        let {items, bottomDiv} = desk;
        /*
        let right = <Button onClick={this.clickApps} color="success" size="sm">功能应用</Button>;
        let footer = <div className="p-1">
            <Button color="primary" size="sm" onClick={this.clickPlus}><FA name="plus" /></Button>
            &nbsp; <div onClick={this.clickPlus}>发任务</div>
        </div>;
        */
        return <>
            {this.coordinator.myFolders()}
            <List className="my-1"
                before={<Muted>读取中...</Muted>}
                none={<div className="p-2"><small style={{color:'lightgray'}}>暂无待办事项</small></div>}
                items={items} 
                item={{
                    key:(item:any)=>item.message.id,
                    className: 'bg-transparent', 
                    render:this.renderMessage, 
                    onClick:this.clickMessage}} />
            <div id={bottomDiv}/>
        </>;
        //</Page>;
    }

    private msgRow = observer((deskItem: DeskItem) => {
        let userId = nav.user.id;
        let {tuid_message, tuid_user} = this.coordinator;
        let {message, read} = deskItem;
        //let msg:Message = tuid_message.valueFromId();
        //let msg:Message = {id: ((id as any) as IdBox).id} as any;
        let rowCn = 'px-3 bg-white my-1';
        if (typeof message === 'number') {
            return <LMR className={rowCn + ' py-2'}><small style={{color:'lightgray'}}>... {message} ...</small></LMR>;
        }
        let messageTemplet = (msg: Message) => {
            let {date, type, fromUser, subject, discription, content} = msg;
            let td = templetDict[type];
            let cn, cnText, dot, fontWeight;
            if (read === 1) {
                cn = 'mt-2 text-info';
                cnText = 'text-secondary';
            }
            else {
                cn = 'mt-2 text-info red-dot';
                cnText = 'text-dark';
                dot = <u className="message-dot" />;
                fontWeight = 'font-weight-bold';
            }
            let from, size;
            if (fromUser != userId) {
                from = <UserSpan userIds={[fromUser]} />;
                size = '1x';
            }
            let caption;
            if (subject !== undefined && subject.trim().length > 0) {
                caption = <><span className={fontWeight}>{subject}</span> - </>;
            }
            let left = <div className={classNames('px-3', cn)}>
                <FA size={size} name={(td && td.icon) || 'envelope'} />
                {dot}
            </div>;
            let mid = <div className={classNames('py-2', cnText)}>
                {caption}
                <small>{discription}</small>
            </div>;
            let right = <div className='py-2 px-2 text-right'>
                <span style={light}><EasyDate date={date} /></span>
            </div>;
            return <LMR className="bg-white" left={left} right={right}>{mid}</LMR>;
        };
    
        return ((message as any) as IdBox).content(messageTemplet);
    });
}

