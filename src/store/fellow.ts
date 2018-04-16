import {observable, computed} from 'mobx';
import mainApi, { messageApi } from '../mainApi';
import {Message} from '../model';
import { Store } from './index';

export class Fellow {
    private store:Store;
    constructor(store:Store) {
        this.store = store;
    }

    @observable invites: Message[] = undefined;
    @observable newInvitesCount:number = 0;

    logout() {
        this.invites = undefined;
        this.newInvitesCount = 0;
    }

    msgUnitInvited(um:Message) {
        if (this.invites === undefined) {
            this.newInvitesCount++;
        }
        else if (this.invites.find(v => v.id === um.id) === undefined) {
            this.invites.push(um);
            //if (um.isNew === true && this.newInvitesCount !== undefined)
            //    this.newInvitesCount++;
        }
    }
    async loadInvites(): Promise<void> {
        if (this.invites === undefined) {
            this.invites = [];
            let ret; // = await mainApi.typeMessages('unit-fellow-invite');
            if (ret === undefined) return;
            //ret.forEach(v => this.mainData.processMessage(v));
        }
        //let ids = this.invites.filter(v => v.isNew === true).map(v => v.id);
        //await messageApi.readMessages(ids);
    }

    async refuseInvite(um:Message):Promise<void> {
        await mainApi.removeMessage(um.id);
        this.removeInvite(um);
    }
    removeInvite(um:Message) {
        let index = this.invites.findIndex(v => v.id === um.id);
        this.invites.splice(index, 1);
    }
}
