var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CenterApi } from 'tonva-tools';
class MainApi extends CenterApi {
    stickies() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('sticky/list', { start: 0, pageSize: 30 });
        });
    }
    ties() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tie/list', { start: 0, pageSize: 30 });
        });
    }
    apps(unit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tie/apps', { unit: unit });
        });
    }
    adminUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.get('tie/admin-url', {});
            return ret;
        });
    }
    appApi(unit, app, apiName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tie/app-api', { unit: unit, app: app, apiName: apiName });
        });
    }
    unitMessages(unit, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tie/message-inbox', { unit: unit, pageStart: pageStart, pageSize: pageSize });
        });
    }
    readMessages(unit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tie/message-read', { unit: unit });
        });
    }
    unitAddFellow(invite) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('unit/add-fellow', { invite: invite });
        });
    }
    removeMessage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.get('tie/remove-message', { id: id });
        });
    }
    unitAdmins(unit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('unit/admins', { unit: unit });
        });
    }
    unitCreate(name, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('unit/create', { name: name, message: message });
        });
    }
    saveMessage(param
    //to:string, unit:number, app:number, type:string, message:any, norepeat?:boolean}
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('tie/message-save', param);
        });
    }
    actMessage(param) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.post('tie/message-act', param);
        });
    }
    userBase(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tie/user', { id: id });
        });
    }
    unitBase(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tie/unit', { id: id });
        });
    }
    postMessage(toUser, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('test/post', { to: toUser, message: msg });
        });
    }
}
const mainApi = new MainApi('tv/');
export default mainApi;
class MessageApi extends CenterApi {
    //async messages():Promise<any[]> {
    //    return await this.get('tie/messages', {});
    //}
    messageUnread() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tie/message-unread', {});
        });
    }
    typeMessageCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tie/message-type-count', {});
        });
    }
    readMessages(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ids.length === 0)
                return;
            yield this.post('tie/read-messages', { ids: ids.join(';') });
        });
    }
}
export const messageApi = new MessageApi('tv/', false);
//# sourceMappingURL=mainApi.js.map