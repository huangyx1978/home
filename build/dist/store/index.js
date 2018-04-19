var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { observable } from 'mobx';
import * as _ from 'lodash';
import { PagedItems } from 'tonva-tools';
import mainApi, { messageApi } from '../mainApi';
import { Fellow } from './fellow';
import { CacheUsers, CacheUnits } from './cacheIds';
const sysUnit = {
    id: 0,
    name: '同花系统',
    nick: undefined,
    discription: '同花平台',
    icon: undefined,
};
class UnitMessages extends PagedItems {
    constructor(unit) {
        super();
        this.unit = unit;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mainApi.unitMessages(this.unit.id, this.pageStart, this.pageSize);
        });
    }
    setPageStart(item) {
        if (item === undefined)
            this.pageStart = undefined;
        else
            this.pageStart = item.id;
    }
    end(id, state) {
        let item = this.items.find(v => v.id === id);
        if (item === undefined)
            return;
        item.state = state;
    }
    remove(id) {
        let index = this.items.findIndex(v => v.id === id);
        if (index >= 0)
            this.items.splice(index, 1);
    }
    addMessage(um) {
        if (this.items !== undefined) {
            this.items.push(um);
        }
        if (this.unread === undefined)
            this.unread = 0;
        ++this.unread;
    }
}
__decorate([
    observable
], UnitMessages.prototype, "unread", void 0);
export class Unit {
    constructor(id) {
        this.id = id;
        this.messages = new UnitMessages(this);
    }
    loadApps() {
        return __awaiter(this, void 0, void 0, function* () {
            let apps;
            let ret = yield mainApi.apps(this.id);
            if (ret === undefined) {
                apps = [];
            }
            else {
                apps = ret.apps;
            }
            apps.unshift({
                id: 0,
                owner: 0,
                ownerName: undefined,
                ownerDiscription: undefined,
                url: undefined,
                name: '会话',
                icon: undefined,
                discription: '收到的信息',
            });
            if (ret === undefined || ret.id === 0) {
                _.assign(ret, sysUnit);
            }
            else {
                _.assign(this, ret);
            }
            this.apps = apps;
        });
    }
    loadMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            yield mainApi.readMessages(this.id);
            this.messages.unread = 0;
            if (this.messages.items !== undefined)
                return;
            yield this.messages.first(undefined);
        });
    }
    messageAct(id, action) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mainApi.actMessage({ unit: this.id, id: id, action: action });
        });
    }
}
__decorate([
    observable
], Unit.prototype, "apps", void 0);
export class Store {
    constructor() {
        this.stickies = [];
        //@observable ties: Tie[];
        this.units = new Map();
        this.unit = undefined;
        this.cacheUsers = new CacheUsers();
        this.cacheUnits = new CacheUnits();
        this.fellow = new Fellow(this);
    }
    onWs(msg) {
        //let um = this.convertMessage(msg);
        if (msg.id === undefined) {
            // msgId=0，则是发送给界面的操作指令
            this.processCommand(msg);
            return;
        }
        this.processMessage(msg);
    }
    processCommand(cmd) {
        let { type, content } = cmd;
        switch (type) {
            default:
                alert(JSON.stringify(cmd));
                break;
            case 'message-end':
                this.messageEnd(content);
                break;
            case 'message-removed':
                this.messageRemoved(content);
                break;
        }
    }
    messageEnd(content) {
        let { id, unit, state } = content;
        let u = this.units.get(unit);
        if (u === undefined)
            return;
        u.messages.end(id, state);
    }
    messageRemoved(content) {
        let { id, unit } = content;
        this.removeMessage(unit, id);
    }
    removeMessage(unit, msgId) {
        let u = this.units.get(unit);
        if (u === undefined)
            return;
        u.messages.remove(msgId);
    }
    processMessage(um) {
        let toUnit = um.toUnit;
        let unit = this.units.get(toUnit);
        if (unit === undefined)
            return;
        unit.messages.addMessage(um);
    }
    logout() {
        this.stickies.splice(0, this.stickies.length);
        this.units.clear();
        this.unit = undefined;
        this.cacheUsers.dict.clear();
        this.cacheUnits.dict.clear();
        this.fellow.logout();
    }
    getAdminApp() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.adminApp !== undefined)
                return this.adminApp;
            return this.adminApp = yield mainApi.adminUrl();
        });
    }
    loadStickies() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield mainApi.stickies();
            //if (this.stickies === undefined) this.stickies = [];
            let t0 = ret[0];
            let t4 = ret[4];
            for (let s of t0) {
                switch (s.type) {
                    case 3:
                        s.obj = t4.find(v => v.id === s.objId);
                        break;
                }
            }
            this.stickies.push(...t0);
            this.addSysUnitStick();
        });
    }
    setUnit(unitId) {
        return __awaiter(this, void 0, void 0, function* () {
            let unit = this.units.get(unitId);
            if (unit === undefined) {
                unit = new Unit(unitId);
                this.units.set(unitId, unit);
            }
            if (unit.apps === undefined) {
                yield unit.loadApps();
            }
            this.unit = unit;
        });
    }
    unitCreate(name, msgId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield mainApi.unitCreate(name, msgId);
            let { unit, sticky, removedMessages } = ret;
            if (removedMessages !== undefined) {
                for (let rm of removedMessages) {
                    let { message, user, unit } = rm;
                    this.removeMessage(unit, message);
                }
            }
            if (sticky !== undefined) {
                let stickUnit = {
                    id: unit,
                    name: name,
                    nick: undefined,
                    discription: undefined,
                    icon: undefined,
                };
                this.stickies.push({
                    id: sticky,
                    date: new Date,
                    type: 3,
                    //main: name,
                    objId: unit,
                    obj: stickUnit,
                });
            }
            return unit;
        });
    }
    acceptFellowInvite(um) {
        return __awaiter(this, void 0, void 0, function* () {
            let sticky = yield mainApi.unitAddFellow(um.id);
            this.fellow.removeInvite(um);
            if (sticky !== undefined)
                this.stickies.unshift(sticky);
        });
    }
    addSysUnitStick() {
        //if (this.stickies === undefined) this.stickies = []; // return;
        let index = this.stickies.findIndex(v => (v.type === 0 || v.type === 3) && v.objId === 0);
        if (index < 0) {
            let unit0 = this.units.get(0);
            if (unit0 === undefined)
                return;
            let { name, discription, icon } = sysUnit;
            this.stickies.unshift({
                id: 0,
                date: new Date,
                type: 0,
                //main: name,
                objId: 0,
                obj: sysUnit,
            });
            return;
        }
        if (index > 0) {
            let sticky = this.stickies.splice(index, 1)[0];
            this.stickies.unshift(sticky);
        }
    }
    loadMessageUnread() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield messageApi.messageUnread();
            let len = ret.length;
            for (let i = 0; i < len; i++) {
                let { unit: unitId, unread, count } = ret[i];
                let unit = this.units.get(unitId);
                if (unit === undefined) {
                    unit = new Unit(unitId);
                    this.units.set(unitId, unit);
                }
                unit.messages.unread = unread;
                if (unitId === 0 && count > 0)
                    this.addSysUnitStick();
            }
        });
    }
}
__decorate([
    observable
], Store.prototype, "stickies", void 0);
__decorate([
    observable
], Store.prototype, "units", void 0);
__decorate([
    observable
], Store.prototype, "unit", void 0);
;
export const store = new Store();
//# sourceMappingURL=index.js.map