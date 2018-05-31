import { Entities, Query, Action, Tuid } from 'tonva-react-usql-entities';
import {PagedItems, Page, ChatApi} from 'tonva-tools';
import {Unit, UnitMessages} from './index';

export class Chat {
    private unit: Unit;
    private receiveHandles:number[] = [];
    private entities: Entities;
    private newMessageAction: Action;
    private message: Tuid;
    messages: UnitMessages;

    constructor(unit:Unit) {
        this.unit = unit;
        this.onWsReceive = this.onWsReceive.bind(this);
        this.onWsMsg = this.onWsMsg.bind(this);
    }

    async load():Promise<boolean> {
        if (this.entities !== undefined) return true;
        let chatApi = new ChatApi(this.unit.id);
        let access = '*';
        this.entities = new Entities(chatApi, access);
        await this.entities.loadEntities();
        let query = this.entities.query('getdesk');
        if (query === undefined) return false;
        await query.loadSchema();
        this.messages = new UnitMessages(this.unit, query);
        this.messages.first(undefined);
        this.receiveHandles.push(this.entities.onWsReceiveAny(this.onWsReceive));
        this.receiveHandles.push(this.entities.onWsReceive('msg', this.onWsMsg));
        return true
    }

    dispose() {
        for (let handle of this.receiveHandles) {
            this.entities.endWsReceive(handle);
        }
    }

    async onWsReceive(data:any):Promise<void> {
    }
    async onWsMsg(data: any):Promise<void> {
        if (this.message === undefined) {
            this.message = this.entities.tuid('message');
            await this.message.loadSchema();
        }
        let msg = await this.message.load(data.data);
        this.messages.addMessage(msg);
    }
    async newMessage(msg:any):Promise<number> {
        if (this.newMessageAction === undefined) {
            this.newMessageAction = this.entities.action('newmessage');
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
