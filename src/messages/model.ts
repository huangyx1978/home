import { observable } from 'mobx';
import { PageItems } from "tonva-tools";
import mainApi from '../mainApi';

export interface Message {
    id: number;
    fromUser: number;
    fromUnit: number;
    type: string;
    date: Date;
    subject: string;
    discription: string;
    content: any;
    //read: number;
    state?: string|number;
}

export class PageMessages extends PageItems<Message> {
    /*
    private unit:Unit;
    private query:Query;
    */
   @observable unread: number;

    constructor(/*unit:Unit, query:Query*/) {
        super(true);
        /*
        this.unit = unit;
        this.query = query;
        */
        this.appendPosition = 'head';
        //if (query !== undefined) query.resetPage(30, {});
    }
    protected  async load():Promise<Message[]> {
        let ret = await mainApi.unitMessages(0, this.pageStart, this.pageSize);
        return ret; //['$page'];
    }
    protected setPageStart(item:Message) {
        if (item === undefined)
            this.pageStart = undefined;
        else
            this.pageStart = item.id;
    }
    end(id:number) {
        let item = this.items.find(v => v.id === id);
        if (item === undefined) return;
        //item.state = '#';
    }
    remove(id:number) {
        let item = this.items.find(v => v.id === id);
        if (item !== undefined) this.items.remove(item);
    }
    addMessage(um:Message) {
        this.remove(um.id);
        this.append(um);
        if (this.unread === undefined) this.unread = 0;
        ++this.unread;
    }
}

