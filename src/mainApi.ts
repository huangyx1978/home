import {CenterApi, User} from 'tonva-tools';
import {App} from './model';

class MainApi extends CenterApi {
    async stickies():Promise<any[]> {
        return await this.get('sticky/list', {start:0, pageSize:30});
    }

    async ties():Promise<any[]> {
        return await this.get('tie/list', {start:0, pageSize:30});
    }

    async apps(unit:number):Promise<any> {
        return await this.get('tie/apps', {unit:unit});
    }

    async adminUrl():Promise<App> {
        let ret = await this.get('tie/admin-url', {});
        return ret;
    }

    async appApi(unit:number, app:number, apiName:string) {
        return await this.get('tie/app-api', {unit:unit, app:app, apiName:apiName});
    }

    async unitArchived(unit:number):Promise<any[]> {
        return await this.get('tie/unit-archived', {unit:unit});
    }

    async unitAddFellow(invite:number):Promise<void> {
        await this.get('unit/add-fellow', {invite:invite});
    }

    async removeMessage(id:number):Promise<void> {
        await this.get('tie/remove-message', {id:id});
    }

    async unitAdmins(unit:number) {
        return await this.get('unit/admins', {unit:unit});
    }

    async postMessage(toUser:number, msg:any) {
        return await this.post('test/post', {to: toUser, message: msg});
    }

    loadFollows(pageSize:number, minName:string) {
        return this.get('follows', {pageSize:pageSize, minName: minName});
    }
    tieHao(tie:number) {
        return this.get('tie-hao', {tie: tie});
    }
    toHome(tie:number) {
        return this.post('to-home', {tie: tie});
    }
    dbInit() {
        return this.get('dbInit', undefined).then(res => res);
    }
}

const mainApi = new MainApi('tv/');
export default mainApi;

class MessageApi extends CenterApi {
    async messages():Promise<any[]> {
        return await this.get('tie/messages', {});
    }
    async unitMessages(unit:number):Promise<any[]> {
        return await this.get('tie/unit-messages', {unit:unit});
    }
    async readMessages(ids:number[]):Promise<void> {
        if (ids.length === 0) return;
        await this.post('tie/read-messages', {ids: ids.join(';')});
    }
}

export const messageApi = new MessageApi('tv/', false);
