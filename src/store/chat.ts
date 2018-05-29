import { Entities, Query } from 'tonva-react-usql-entities';
import {PagedItems, Page, ChatApi} from 'tonva-tools';
import {Unit, UnitMessages} from './index';

export class Chat {
    private unit: Unit;
    //private chatApi: AppApi;
    private entities: Entities;
    //private loadMessages: Query;
    messages: UnitMessages;

    constructor(unit:Unit) {
        this.unit = unit;
    }

    async load():Promise<boolean> {
        if (this.entities !== undefined) return true;
        let chatApi = new ChatApi(this.unit.id);
        //let {url, ws, token, apiOwner, apiName, access} = this.chatApi;
        let ws = undefined;
        let access = '*';
        this.entities = new Entities(chatApi, ws, access);
        await this.entities.loadEntities();
        let query = this.entities.queryArr.find(v => v.name === 'getmymessages');
        await query.loadSchema();
        this.messages = new UnitMessages(this.unit, query);
        this.messages.first(undefined);
        return true
    }
/*
    async loadMessages():Promise<boolean> {
        let query = this.entities.queryArr.find(v => v.name === 'getmymessages');
        await query.loadPage();
        return true;
    }
*/
}
