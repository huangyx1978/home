import * as React from 'react';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import {List, EasyDate, LMR, FA, Muted, IconText, Prop, PropGrid} from 'tonva-react-form';
import {Page, nav, View} from 'tonva-tools';
import {templetDict} from 'store';
import {Message} from 'model';
import { navToAppId } from 'navToApp';
import { BoxId } from 'tonva-react-usql';
import { CUnitxUsq } from './cUnitxUsq';
import { UserSpan } from './userSpan';
import { DeskItem } from './models';

const light = {fontSize:'x-small', color:'lightgray'};

export class DeskPage extends View<CUnitxUsq> {
    private clickMessage = async (deskItem:DeskItem) => {
        let {message, read} = deskItem;
        if (typeof message === 'number') return;
        let boxId:BoxId = message as any;
        if (read !== 1) await this.controller.readMessage(boxId.id);
        let {unit} = this.controller;
        let msg = boxId.obj;
        let {type} = msg;
        switch (type) {
            default:
                this.controller.jobPage(msg);
                break;
            case 'sheetMsg':
                let obj = JSON.parse(msg.content);
                let {app:appId, id:sheetId, usq:usqId, sheet:sheetType} = obj;
                await navToAppId(appId, usqId, unit.id, sheetType, sheetId);
                break;
        }
    }
    private renderMessage = (deskItem:DeskItem, index:number):JSX.Element => {
        return <this.msgRow {...deskItem} />;
    }
    render() {
        let {desk} = this.controller;
        let {items, bottomDiv} = desk;
        return <>
            {/*this.controller.myFolders()*/}
            <List className="my-1"
                before={<Muted>读取中...</Muted>}
                none={<Muted className="px-3 py-2">暂无待办事项</Muted>}
                items={items} 
                item={{
                    key:(item:any)=>item.message.id,
                    className: 'bg-transparent', 
                    render:this.renderMessage, 
                    onClick:this.clickMessage}} />
            <div id={bottomDiv}/>
        </>;
    }

    private msgRow = observer((deskItem: DeskItem) => {
        let userId = nav.user.id;
        let {message, read} = deskItem;
        let rowCn = 'px-3 bg-white my-1';
        if (typeof message === 'number') {
            return <LMR className={rowCn + ' py-2'}><Muted>... {message} ...</Muted></LMR>;
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
    
        return ((message as any) as BoxId).content(messageTemplet);
    });
}

