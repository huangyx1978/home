import {observable} from 'mobx';
import { Entities, Query, Action, Tuid } from 'tonva-react-usql-entities';
import {PagedItems, Page, ChatApi, CacheIds, nav} from 'tonva-tools';
import {Unit, UnitMessages, Desk, SendFolder, PassFolder, CcFolder, AllFolder} from './index';
import {Templet} from './templet';
import {sysTemplets} from './sysTemplets';
import {Message} from '../model';

interface MessageState {
    message: Message;
    branch:number;
    done:number;
}

export class Chat {
    private unit: Unit;
    private entities: Entities;
    private newMessageAction: Action;
    private templets: Templet[];
    private userMeUploaded:boolean = false;
    tuidMessage: Tuid;
    tuidUser: Tuid;
    desk: Desk;
    sendFolder: SendFolder;
    passFolder: PassFolder;
    ccFolder: CcFolder;
    allFolder: AllFolder;
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
        this.tuidMessage = this.entities.tuid('message');
        this.tuidMessage.setItemObservable();
        this.tuidUser = this.entities.tuid('user');
        let query = this.entities.query('getDesk');
        if (query === undefined) return false;
        //await query.loadSchema();
        //this.messages = new UnitMessages(this.unit, query);
        //await this.messages.first(undefined);
        this.desk = new Desk(this.unit, query);
        await this.desk.first(undefined);

        let getFolder = this.entities.query('getFolder');
        this.sendFolder = new SendFolder(this.unit, getFolder);
        this.passFolder = new PassFolder(this.unit, getFolder);
        this.ccFolder = new CcFolder(this.unit, getFolder);
        this.allFolder = new AllFolder(this.unit, getFolder);
        return true;
    }
    /*
    dispose() {
        for (let handle of this.receiveHandles) {
            this.entities.endWsReceive(handle);
        }
    }

    async onWsReceive(data:any):Promise<void> {
    }
    */
    getQuery(name:string):Query {
        return this.entities.query(name);
    }

    async readMessage(id: number):Promise<void> {
        let action = this.entities.action('readMessage');
        await action.submit({msg: id});
    }

    async actMessage(msg:Message, act:string, toState:string, to: {user:number}[]): Promise<void> {
        let action = this.entities.action('actMessage');
        let {id} = msg;
        await action.submit({
            msg: id,
            curState: toState,
            toState: '#',
            action: act,
            to: to
        });
    }

    async onWsMsg(message: any):Promise<void> {
        let {$type, msg, to, action, data} = message;
        if ($type !== 'msg') return;
        switch (action) {
            case 'to':
                this.addToDesk(this.dataToMsg(data));
                break;
            case 'cc':
                this.cc(this.dataToMsg(data));
                break;
            case 'away': this.removeFromDesk(msg); break;
            case 'read': this.messageBeReaden(msg); break;
        }
        //let msg = data.data;
        //if (id > 0) await this.addToDesk(id);
        //else await this.removeFromDesk(-id);
    }
    private dataToMsg(data:string):MessageState {
        let parts = data.split('\t');
        let id:number;
        let branch = Number(parts[8]);
        let done = Number(parts[9]);
        let m:Message = {
            id: id = Number(parts[0]),
            fromUser: Number(parts[1]),
            fromUnit: Number(parts[2]),
            type: parts[3],
            date: new Date(Number(parts[4])*1000),
            subject: parts[5],
            discription: parts[6],
            content: parts[7],
            //read: 0,
            //state: parts[8],
        };
        return {
            message: m,
            branch: branch,
            done: done
        };
    };
    private addToDesk(ms:MessageState) {
        let {message, branch, done} = ms;
        let {id, fromUser} = message;
        this.tuidMessage.cacheItem(id, message);
        let item = {id:id, read: 0, branch:branch, done:done};
        this.desk.addItem(item);
        this.desk.scrollToBottom();
        if (fromUser === nav.user.id)
            this.sendFolder.addItem(item);
        else
            this.passFolder.addItem(item);
        this.allFolder.addItem(item);
    }
    private removeFromDesk(id:number) {
        this.desk.remove(id);
    }
    private messageBeReaden(id:number) {
        let msg = this.desk.items.find(v => v.id === id);
        if (msg !== undefined) msg.read = 1;
    }
    private cc(ms:MessageState) {
        let {message, branch, done} = ms;
        let {id} = message;
        let item = {id:id, branch:branch, done:done};
        this.tuidMessage.cacheItem(id, message);
        this.ccFolder.addItem(item);
        this.allFolder.addItem(item);
    }
    async newMessage(msg:any):Promise<number> {
        if (this.newMessageAction === undefined) {
            this.newMessageAction = this.entities.action('newMessage');
            await this.newMessageAction.loadSchema();
        }
        if (this.userMeUploaded === false) {
            let {name, nick, icon} = nav.user;
            msg.meName = name;
            msg.meNick = nick;
            msg.meIcon = icon;
            this.userMeUploaded = true;
        }
        return await this.newMessageAction.submit(msg);
    }

    async getTemplets():Promise<Templet[]> {
        if (this.templets === undefined) {
            let query = this.entities.query('getTemplets');
            let ret = await query.query({});
            this.templets = ret.ret;
            //this.templets.unshift(...sysTemplets);
        }
        return this.templets;
    }

/*
    async loadMessages():Promise<boolean> {
        let query = this.entities.queryArr.find(v => v.name === 'getmymessages');
        await query.loadPage();
        return true;
    }
*/
}
