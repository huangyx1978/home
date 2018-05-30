import { Entities, Query, Action } from 'tonva-react-usql-entities';
import {PagedItems, Page, ChatApi} from 'tonva-tools';
import {Unit, UnitMessages} from './index';

export class Chat {
    private unit: Unit;
    //private chatApi: AppApi;
    private entities: Entities;
    private newMessageAction: Action;
    messages: UnitMessages;

    constructor(unit:Unit) {
        this.unit = unit;
    }

    async load():Promise<boolean> {
        if (this.entities !== undefined) return true;
        let chatApi = new ChatApi(this.unit.id);
        let access = '*';
        this.entities = new Entities(chatApi, access);
        await this.entities.loadEntities();
        let query = this.entities.queryArr.find(v => v.name === 'getmymessages');
        if (query === undefined) return false;
        await query.loadSchema();
        this.messages = new UnitMessages(this.unit, query);
        this.messages.first(undefined);
        this.entities.onWsReceiveAny(this.onWsReceive);
        return true
    }

    onWsReceive(data:any) {
        alert('收到服务器推送消息：' + JSON.stringify(data));
    }

    async newMessage(msg:any):Promise<number> {
        if (this.newMessageAction === undefined) {
            this.newMessageAction = this.entities.actionArr.find(v => v.name === 'newmessage');
            await this.newMessageAction.loadSchema();
        }
        return await this.newMessageAction.submit(msg);
    }
/*
    async loadMessages():Promise<boolean> {
        let query = this.entities.queryArr.find(v => v.name === 'getmymessages');
        await query.loadPage();
        return true;
    }
*/
}
