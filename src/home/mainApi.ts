import {CenterApi, User} from 'tonva-tools';
import {App} from 'model';

class MainApi extends CenterApi {
    async stickies():Promise<any[][]> {
        return await this.get('sticky/list', {start:0, pageSize:30});
    }

    async ties():Promise<any[]> {
        return await this.get('tie/list', {start:0, pageSize:30});
    }

    async searchUnits(key:string, pageStart:number, pageSize:number):Promise<any[]> {
        return await this.get('tie/search-unit', {key:key, pageStart:pageStart, pageSize:pageSize});
    }

    async searchUnitsFollow(unit:number):Promise<number> {
        return await this.get('tie/search-unit-follow', {unit:unit});
    }

    async unitNotFollow(unit:number):Promise<void> {
        await this.get('tie/unit-not-follow', {unit:unit});
    }

    async apps(unit:number):Promise<any> {
        return await this.get('tie/apps', {unit:unit});
    }

    async unitxApi(unit:number):Promise<any> {
        return await this.get('tie/apps', {unit:unit});
    }

    async adminUrl():Promise<App> {
        let ret = await this.get('tie/admin-url', {});
        return ret;
    }

    async adminUnits(): Promise<any[][]> {
        return await this.get('tie/user-admin-units');
    }

    async appFromId(appId:number):Promise<App> {
        let ret = await this.get('tie/app-id', {appId:appId});
        return ret;
    }

    async appApi(unit:number, app:number, apiName:string) {
        return await this.get('tie/app-api', {unit:unit, app:app, apiName:apiName});
    }

    async unitMessages(unit:number, pageStart:number, pageSize:number):Promise<any[]> {
        return await this.get('tie/message-inbox', {unit:unit, pageStart:pageStart, pageSize:pageSize});
    }

    async messagesRead(unit:number):Promise<any[]> {
        return await this.get('tie/message-read', {unit:unit});
    }

    async unitAddFellow(invite:number):Promise<any> {
        return await this.get('unit/add-fellow', {invite:invite});
    }

    async removeMessage(id:number):Promise<void> {
        await this.get('tie/remove-message', {id:id});
    }

    async unitAdmins(unit:number):Promise<any[]> {
        return await this.get('unit/admins', {unit:unit});
    }

    async unitCreate(name:string, message:number):Promise<any> {
        return await this.post('unit/create', {name:name, message:message});
    }

    async unitCreateDirect(data:{name:string, type:'dev'|'unit', isPublic:number}):Promise<any> {
        return await this.post('unit/create-direct', data);
    }

    async saveMessage(
        param:{toUser:number, fromApp:number, type:string, content:string}
        //to:string, unit:number, app:number, type:string, message:any, norepeat?:boolean}
    ):Promise<any> {
        return await this.post('tie/message-save', param);
    }

    async actMessage(param:{unit:number, id:number, action: 'approve'|'refuse'}):Promise<void> {
        await this.post('tie/message-act', param);
    }

    async userBase(id:number):Promise<any> {
        return await this.get('tie/user', {id:id});
    }
    async unitBase(id:number):Promise<any> {
        return await this.get('tie/unit', {id:id});
    }
    
    async postMessage(toUser:number, msg:any) {
        return await this.post('test/post', {to: toUser, message: msg});
    }

    async membersFromName(param: {unit:number; name:string}):Promise<any[]> {
        return await this.get('unit/members-from-name', param);
    }

    async resetPassword(param: {orgPassword:string, newPassword:string}) {
        return await this.post('tie/reset-password', param);
    }

    async userSetProp(prop:string, value:any) {
        await this.post('tie/user-set-prop', {prop:prop, value:value});
    }
}

const mainApi = new MainApi('tv/', undefined);
export default mainApi;

class MessageApi extends CenterApi {
    //async messages():Promise<any[]> {
    //    return await this.get('tie/messages', {});
    //}
    async messageUnread():Promise<any[]> {
        return await this.get('tie/message-unread', {});
    }
    async messageRead(unit:number):Promise<any[]> {
        return await this.get('tie/message-read', {unit: unit});
    }
    async typeMessageCount():Promise<any[]> {
        return await this.get('tie/message-type-count', {});
    }
    async readMessages(ids:number[]):Promise<void> {
        if (ids.length === 0) return;
        await this.post('tie/read-messages', {ids: ids.join(';')});
    }
}

export const messageApi = new MessageApi('tv/', false);
