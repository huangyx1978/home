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
import _ from 'lodash';
import { PageItems, meInFrame } from 'tonva-tools';
import mainApi, { messageApi } from 'mainApi';
import { Fellow } from './fellow';
import { CacheUsers, CacheUnits } from './cacheIds';
export * from './sysTemplets';
const sysUnit = {
    id: 0,
    name: '同花系统',
    nick: undefined,
    discription: '同花平台',
    icon: undefined,
    date: undefined,
};
export class UnitMessages extends PageItems {
    constructor(unit, query) {
        super(true);
        this.unit = unit;
        this.query = query;
        this.appendPosition = 'head';
        //if (query !== undefined) query.resetPage(30, {});
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            //await this.query.loadPage();
            yield this.query.loadSchema();
            let ret = yield this.query.page(this.param, this.pageStart, this.pageSize);
            return ret['$page'];
            //return this.query.list;
        });
    }
    setPageStart(item) {
        if (item === undefined)
            this.pageStart = undefined;
        else
            this.pageStart = item.id;
    }
    end(id) {
        let item = this.items.find(v => v.id === id);
        if (item === undefined)
            return;
        //item.state = '#';
    }
    remove(id) {
        let item = this.items.find(v => v.id === id);
        if (item !== undefined)
            this.items.remove(item);
    }
    addMessage(um) {
        this.remove(um.id);
        this.append(um);
        if (this.unread === undefined)
            this.unread = 0;
        ++this.unread;
    }
}
__decorate([
    observable
], UnitMessages.prototype, "unread", void 0);
export class Unit {
    //unitx: Unitx;
    constructor(id) {
        this.id = id;
        this.messages = new UnitMessages(this, undefined);
        //this.unitx = new Unitx(this);
    }
    get isOwner() { return this._isOwner; }
    set isOwner(value) {
        this._isOwner = value;
    }
    get isAdmin() { return this._isAdmin; }
    set isAdmin(value) {
        this._isAdmin = value;
    }
    loadProps() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield mainApi.unitBase(this.id);
            if (ret === undefined)
                return;
            let { name, discription, icon, nick, isOwner, isAdmin, owner, ownerName, ownerNick, ownerIcon } = ret;
            this.name = name;
            this.discription = discription;
            this.nick = nick;
            this.icon = icon;
            this.isOwner = isOwner;
            this.isAdmin = isAdmin;
            this.owner = owner;
            this.ownerName = ownerName;
            this.ownerNick = ownerNick;
            this.ownerIcon = ownerIcon;
        });
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
            if (ret === undefined) {
                ret = {};
                _.assign(ret, sysUnit);
            }
            else if (ret.id === 0) {
                _.assign(ret, sysUnit);
            }
            _.assign(this, ret);
            this.apps = apps;
        });
    }
    loadMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            yield mainApi.messagesRead(this.id);
            if (this.messages.items !== undefined)
                return;
            yield this.messages.first(undefined);
        });
    }
    messageReadClear() {
        return __awaiter(this, void 0, void 0, function* () {
            this.unread = 0;
            this.messages.unread = 0;
            let s = store.stickies.find(v => v.objId === this.id);
            if (s !== undefined) {
                s.date = undefined;
                let sObj = s.obj;
                if (sObj !== undefined) {
                    sObj.subject = undefined;
                    sObj.unread = 0;
                }
            }
            yield mainApi.messagesRead(this.id);
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
__decorate([
    observable
], Unit.prototype, "unread", void 0);
__decorate([
    observable
], Unit.prototype, "date", void 0);
export class Store {
    constructor() {
        this.unitArray = [];
        this.units = new Map();
        this.unit = undefined;
        this.cacheUsers = new CacheUsers();
        this.cacheUnits = new CacheUnits();
        this.follow = new Fellow(this);
    }
    onWs(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let { from, to, body, push } = message;
            if (body === undefined)
                return;
            let { $type, $user, $unit, $io, action, data, msg } = body;
            if ($type !== 'msg')
                return;
            if (!data)
                return;
            let now = new Date;
            let ms = store.dataToMsg(data);
            for (let item of this.units) {
                let unit = item[1];
                if ($unit !== unit.id)
                    continue;
                this.onStickyMessage(unit, $io, now, ms.message && ms.message.subject);
                break;
            }
            if (message.id === undefined) {
                // msgId=0，则是发送给界面的操作指令
                this.processCommand(message);
                return;
            }
            this.processMessage(message);
        });
    }
    dataToMsg(data) {
        let parts = data.split('\t');
        function toNum(t) { if (t)
            return Number(t); }
        function toDate(t) { if (t)
            return new Date(Number(t) * 1000); }
        let id = toNum(parts[0]);
        let date = toDate(parts[4]);
        let branch = toNum(parts[8]);
        let done = toNum(parts[9]);
        let prevState = parts[10];
        let state = parts[11];
        let m;
        if (date !== undefined)
            m = {
                id: id,
                fromUser: toNum(parts[1]),
                fromUnit: toNum(parts[2]),
                type: parts[3],
                date: date,
                subject: parts[5],
                discription: parts[6],
                content: parts[7],
            };
        return {
            id: id,
            message: m,
            branch: branch,
            done: done,
            prevState: prevState,
            state: state,
        };
    }
    onStickyMessage(unit, io, now, discription) {
        unit.unread += io;
        unit.date = now;
        if (this.stickies === undefined)
            return;
        for (let s of this.stickies) {
            if (s.objId !== unit.id)
                continue;
            if (s.obj !== undefined) {
                s.obj.subject = discription;
            }
            break;
        }
    }
    processCommand(cmd) {
        let { type, content } = cmd;
        switch (type) {
            //default: alert(JSON.stringify(cmd)); break;
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
        u.messages.end(id);
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
        /*
        let toUnit = um.toUnit;
        let unit = this.units.get(toUnit);
        if (unit === undefined) return;
        unit.messages.addMessage(um);
        */
    }
    //private disposeUnits() {
    /*
    this.units.forEach(v => {
        v.dispose();
    });*/
    //this.units.clear();
    //}
    logout() {
        this.stickies.splice(0, this.stickies.length);
        //this.disposeUnits();
        this.units.clear();
        this.unit = undefined;
        this.cacheUsers.dict.clear();
        this.cacheUnits.dict.clear();
        this.follow.logout();
    }
    getAdminApp() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.adminApp !== undefined)
                return this.adminApp;
            return this.adminApp = yield mainApi.adminUrl();
        });
    }
    getAppFromId(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mainApi.appFromId(appId);
        });
    }
    loadStickies() {
        return __awaiter(this, void 0, void 0, function* () {
            let stickies = [];
            let ret = yield mainApi.stickies();
            //if (this.stickies === undefined) this.stickies = [];
            let t0 = ret[0];
            let t4 = ret[4];
            for (let s of t0) {
                switch (s.type) {
                    case 3:
                        let u = s.obj = t4.find(v => v.id === s.objId);
                        let { id, type, name, discription, icon, unread, date, owner } = u;
                        let unit = new Unit(id);
                        unit.type = type;
                        unit.name = name;
                        unit.discription = discription;
                        unit.icon = icon;
                        unit.unread = unread;
                        unit.date = date;
                        unit.owner = owner;
                        this.units.set(id, unit);
                        break;
                }
            }
            stickies.push(...t0);
            let sys = ret[5][0];
            if (sys !== undefined) {
                let { unread, date } = sys;
                this.addSysUnitStick(stickies, unread, date);
            }
            this.stickies = stickies;
        });
    }
    newUnit(unitId) {
        return __awaiter(this, void 0, void 0, function* () {
            let unit = new Unit(unitId);
            yield unit.loadProps();
            this.units.set(unitId, unit);
            this.unitArray.unshift(unit);
            if (this.unitArray.length > Store.maxUnitCount) {
                let u = this.unitArray.pop();
                this.units.delete(u.id);
            }
            return unit;
        });
    }
    setUnit(unitId) {
        return __awaiter(this, void 0, void 0, function* () {
            let unit = this.units.get(unitId);
            if (unit === undefined) {
                unit = yield this.newUnit(unitId);
            }
            else {
                let index = this.unitArray.findIndex(v => v === unit);
                if (index > 0) {
                    this.unitArray.splice(index, 1);
                    this.unitArray.unshift(unit);
                }
                //unit.unread = 0;
            }
            meInFrame.unit = unitId;
            this.unit = unit;
        });
    }
    setUnitRead() {
        return __awaiter(this, void 0, void 0, function* () {
            let { unread, id } = this.unit;
            if (unread > 0) {
                yield messageApi.messageRead(id);
                this.unit.unread = 0;
            }
        });
    }
    /*
    async unitCreate(name:string, msgId:number):Promise<number> {
        let ret = await mainApi.unitCreate(name, msgId);
        let {unit, sticky, removedMessages} = ret;
        if (removedMessages !== undefined) {
            for (let rm of removedMessages) {
                let {message, user, unit} = rm;
                this.removeMessage(unit, message);
            }
        }
        if (sticky !== undefined) {
            let stickUnit:StickyUnit = {
                id: unit,
                name: name,
                nick: undefined,
                discription: undefined,
                icon: undefined,
                date: undefined,
            };
            this.stickies.push({
                id: sticky,
                date: new Date,
                type: 3,
                //main: name,
                objId: unit,
                obj: stickUnit,
                //ex: undefined,
                //icon: undefined,
            });
        }
        return unit;
    }
    */
    acceptFellowInvite(um) {
        return __awaiter(this, void 0, void 0, function* () {
            let sticky = yield mainApi.unitAddFellow(um.id);
            this.follow.removeInvite(um);
            if (sticky !== undefined)
                this.stickies.unshift(sticky);
        });
    }
    addSysUnitStick(stickies, unread, date) {
        if (unread === undefined || unread <= 0)
            return;
        /*
        let unit0 = this.units.get(0);
        if (unit0 === undefined) {
            unit0 = _.clone(sysUnit) as any;
        }
        unit0.unread = unread;
        unit0.date = date;
        this.stickies.unshift({
            id: 0,
            date: date,
            type: 0,
            objId: 0,
            obj: unit0,
        });
        return;
        */
        let index = stickies.findIndex(v => (v.type === 0 || v.type === 3) && v.objId === 0);
        if (index < 0) {
            //let unit0 = this.units.get(0);
            //if (unit0 === undefined) return;
            let sticky = _.clone(sysUnit);
            sticky.unread = unread;
            //let {name, discription, icon} = sysUnit;
            stickies.unshift({
                id: 0,
                date: new Date,
                type: 0,
                //main: name,
                objId: 0,
                obj: sticky,
            });
            return;
        }
        if (index > 0) {
            let sticky = stickies.splice(index, 1)[0];
            stickies.unshift(sticky);
        }
    }
    followUnit(unitId) {
        return __awaiter(this, void 0, void 0, function* () {
            let stickyId = yield mainApi.searchUnitsFollow(unitId);
            let unit = this.units.get(unitId);
            if (unit === undefined) {
                unit = yield this.newUnit(unitId);
            }
            else {
                unit.apps = undefined;
            }
            //unit.name = name;
            //unit.nick = nick;
            //unit.discription = discription;
            //unit.icon = icon;
            this.stickies.unshift({
                id: stickyId,
                date: new Date(),
                type: 3,
                objId: unitId,
                obj: unit
            });
        });
    }
    unfollowUnit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.unit === undefined)
                return;
            this.unit.apps = undefined;
            let unitId = this.unit.id;
            yield mainApi.unitNotFollow(unitId);
            let index = this.stickies.findIndex(v => v.objId === unitId);
            if (index < 0)
                return;
            this.stickies.splice(index, 1);
        });
    }
}
Store.maxUnitCount = 2;
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