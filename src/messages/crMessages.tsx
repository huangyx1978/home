import React, { StatelessComponent } from 'react';
import { Coordinator, VmPage, VmView } from 'tonva-tools';
import { Page } from 'tonva-tools';
import { ApplyUnit, ApplyDev } from './applyXHao';
import { ApprovedUnit, ApprovedDev, UnitCreatePage } from './approvedXHao';
import { UnitFollowInvite } from './unitFollowInvite';
import { Message, PagedMessages } from './model';
import { List } from 'tonva-react-form';
import mainApi from 'mainApi';

/*
const typeMessageMap:{[type:string]: (msg:Message, onClick?:(msg:Message)=>Promise<void>)=>JSX.Element} = {
    "apply-unit": ApplyUnit,
    "apply-dev": ApplyDev,
    "approve-unit": ApprovedUnit,
    "approve-dev": ApprovedDev,
    //"unit-follow-invite": UnitFollowInvite,
};
*/

export class CrMessages extends Coordinator {
    messages: PagedMessages;

    protected async internalStart(param?:any) {
        this.messages = new PagedMessages;
        await this.messages.first(undefined);
        this.showVm(VmMessages);
    }

    onApplyItemClick = async (msg:Message) => {
        this.openPage(this.applyPage(msg));
    }

    onApproveItemClick = async (msg:Message, unitType:number, title:string) => {
        await this.showVm(UnitCreatePage, {msg:msg, unitType:unitType, title:title});
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

class VmMessages extends VmPage<CrMessages> {
    //protected coordinator: CrMessages;

    async showEntry(param?:any) {
        this.openPage(this.messagesPage);
    }

    private renderMessage = (msg:Message) => {
        let messageRow: (msg:Message, onClick?:(msg:Message, unitType?:number, title?:string)=>Promise<void>)=>JSX.Element;
        let onClick: (msg:Message, unitType?:number, title?:string) => Promise<void>;
        switch (msg.type) {
            case 'apply-unit':
                messageRow = ApplyUnit;
                onClick = this.coordinator.onApplyItemClick;
                break;
            case 'apply-dev':
                messageRow = ApplyDev;
                onClick = this.coordinator.onApplyItemClick;
                break;
            case 'approve-unit':
                messageRow = ApprovedUnit;
                onClick = this.coordinator.onApproveItemClick;
                break;
            case 'approve-dev':
                messageRow = ApprovedDev;
                onClick = this.coordinator.onApproveItemClick;
                break;
            //"unit-follow-invite": UnitFollowInvite,
        }
        //let MessageRow = typeMessageMap[msg.type];
        //return MessageRow(msg);
        return messageRow(msg, onClick);
    }

    /*
    private clickMessage = (msg: Message) => {
        alert(msg);
    }*/

    private messagesPage = () => {
        let {items} = this.coordinator.messages;
        return <Page header="消息">
            <List items={items} item={{render:this.renderMessage, onClick: undefined }} />
        </Page>;
    }
}
