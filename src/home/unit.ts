import _ from 'lodash';
import { observable } from 'mobx';
import mainApi from "../mainApi";
import { App, sysUnit } from './model';

export class Unit {
    id: number;
    type: number; // 1=dev, 2=unit, 3=dev & unit
    name: string;
    discription: string;
    nick: string;
    icon: string;
    private _isOwner:number;
    get isOwner(): number {return this._isOwner;}
    set isOwner(value:number) {
        if (value === null) value = 0;
        this._isOwner=value;
    }
    private _isAdmin:number;
    get isAdmin(): number {return this._isAdmin;}
    set isAdmin(value:number) {
        if (value === null) value = 0;
        this._isAdmin = value;
    }
    get isDev(): boolean {return (this.type & 1) !== 0}
    get isHao(): boolean {return (this.type & 2) !== 0}
    owner: number;
    ownerName: string;
    ownerNick: string;
    ownerIcon: string;
    @observable apps: App[];
    @observable unread: number;
    @observable date: Date;
    //messages: UnitMessages;
    //unitx: Unitx;

    constructor(id:number) {
        this.id = id;
        //this.messages = new UnitMessages(this, undefined);
        //this.unitx = new Unitx(this);
    }

    async loadProps(): Promise<void> {
        let ret = await mainApi.unitBase(this.id);
        if (ret === undefined) return;
        let {name, discription, icon, nick, type, isOwner, isAdmin, owner, ownerName, ownerNick, ownerIcon} = ret;
        this.name = name;
        this.discription = discription;
        this.nick = nick;
        this.icon = icon;
        this.type = type;
        this.isOwner = isOwner;
        this.isAdmin = isAdmin;
        this.owner = owner;
        this.ownerName = ownerName;
        this.ownerNick = ownerNick;
        this.ownerIcon = ownerIcon;
    }

    async loadApps(): Promise<void> {
        let apps:App[];
        let ret = await mainApi.apps(this.id);
        if (ret === undefined) return;

        apps = ret.apps;
        if (ret.id === 0) {
            _.assign(ret, sysUnit);
        }
        _.assign(this, ret);
        this.apps = apps;
    }

    async loadMessages(): Promise<void> {
        /*
        await mainApi.messagesRead(this.id);
        if (this.messages.items !== undefined) return;
        await this.messages.first(undefined);
        */
    }

    async messageReadClear() {
        /*
        this.unread = 0;
        this.messages.unread = 0;
        let s = store.stickies.find(v => v.objId === this.id);
        if (s !== undefined) {
            s.date = undefined;
            let sObj: StickyUnit = s.obj as StickyUnit;
            if (sObj !== undefined) {
                sObj.subject = undefined;
                sObj.unread = 0;
            }
        }
        await mainApi.messagesRead(this.id);
        */
    }

    async messageAct(id:number, action:'approve'|'refuse') {
        //await mainApi.actMessage({unit:this.id, id:id, action:action});
    }
    /*
    dispose() {
        if (this.chat === undefined) return;
        this.chat.dispose();
    }*/
}

