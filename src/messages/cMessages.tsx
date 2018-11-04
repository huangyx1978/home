import React, { StatelessComponent } from 'react';
import { Controller, VPage, View } from 'tonva-tools';
import { Page } from 'tonva-tools';
import { ApplyUnit, ApplyDev } from './applyXHao';
import { ApprovedUnit, ApprovedDev, UnitCreatePage } from './approvedXHao';
import { Message, PageMessages } from './model';
import { List } from 'tonva-react-form';
import mainApi from 'mainApi';

export class CMessages extends Controller {
    messages: PageMessages;
    constructor() {
        super({});
    }

    protected async internalStart(param?:any) {
        this.messages = new PageMessages;
        await this.messages.first(undefined);
        this.showVPage(VMessages);
    }

    onApplyItemClick = async (msg:Message) => {
        this.openPage(this.applyPage(msg));
    }

    onApproveItemClick = async (msg:Message, unitType:number, title:string) => {
        await this.showVPage(UnitCreatePage, {msg:msg, unitType:unitType, title:title});
    }
    
    async unitCreate(unitName:string, msgId:number):Promise<number> {
        let unitId = await mainApi.unitCreate(unitName, msgId);
        return unitId;
    }

    private approve = async (msg:Message) => {
        //alert('approve');
        //await store.unit.messageAct(msg.id, 'approve');
        await mainApi.actMessage({unit:0, id:msg.id, action:'approve'});
        msg.state = 1;
        this.closePage();
    }

    private refuse = async (msg:Message) => {
        //alert('refuse');
        //await store.unit.messageAct(msg.id, 'refuse');
        await mainApi.actMessage({unit:0, id:msg.id, action:'refuse'});
        msg.state = -1;
        this.closePage();
    }

    private applyPage = (msg:Message) => {
        let buttons;
        let {state} = msg;
        if (state === 0) {
            buttons = <div className="m-3">
                <button className="btn btn-success" onClick={()=>this.approve(msg)}>批准</button>
                <button onClick={()=>this.refuse(msg)} className="btn btn-outline-primary ml-3">拒绝</button>
            </div>;
        }
        return <Page header="处理申请">
            <div className="my-3 mx-2">
                <div className="bg-white">
                    {ApplyDev(msg, undefined)}
                </div>
                {buttons}
            </div>
        </Page>;
    }
}

class VMessages extends VPage<CMessages> {
    //protected controller: CrMessages;

    async showEntry(param?:any) {
        this.openPage(this.messagesPage);
    }

    private renderMessage = (msg:Message) => {
        let messageRow: (msg:Message, onClick?:(msg:Message, unitType?:number, title?:string)=>Promise<void>)=>JSX.Element;
        let onClick: (msg:Message, unitType?:number, title?:string) => Promise<void>;
        switch (msg.type) {
            default: throw msg.type;
            case 'apply-unit':
                messageRow = ApplyUnit;
                onClick = this.controller.onApplyItemClick;
                break;
            case 'apply-dev':
                messageRow = ApplyDev;
                onClick = this.controller.onApplyItemClick;
                break;
            case 'approve-unit':
                messageRow = ApprovedUnit;
                onClick = this.controller.onApproveItemClick;
                break;
            case 'approve-dev':
                messageRow = ApprovedDev;
                onClick = this.controller.onApproveItemClick;
                break;
        }
        return messageRow(msg, onClick);
    }

    private messagesPage = () => {
        let {items} = this.controller.messages;
        return <Page header="消息">
            <List items={items} item={{render:this.renderMessage, onClick: undefined }} />
        </Page>;
    }
}
