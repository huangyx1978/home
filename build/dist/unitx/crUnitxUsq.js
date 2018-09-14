var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { computed } from 'mobx';
import { CrUsq, VmPage } from 'tonva-react-usql';
import { Page, nav, isBridged } from 'tonva-tools';
import { DropdownActions } from 'tonva-react-form';
import { store, Desk, SendFolder, PassFolder, CcFolder, AllFolder } from 'store';
import { DeskPage } from './desk';
import { JobsPage } from './jobs';
import { Queries } from './queries';
import { AppsPage } from './apps';
import { MyFolders, WholeFolders } from './folders';
import { JobPage } from './job';
import { JobEdit } from './jobEdit';
export class CrUnitxUsq extends CrUsq {
    constructor(unitId) {
        super('$$$/$unitx', 0, 0, undefined, undefined);
        this.userMeUploaded = false;
        this.pushId = 0;
        this.tabs = [
            {
                title: '待办',
                content: () => this.renderVm(DeskPage),
                redDot: computed(() => {
                    return this.desk.items.length;
                })
            },
            {
                title: '新建',
                content: () => this.renderVm(JobsPage),
                load: () => __awaiter(this, void 0, void 0, function* () {
                    this.templets = yield this.getTemplets();
                }),
            },
            {
                title: '查看',
                content: () => this.renderVm(Queries),
            },
            {
                title: '应用',
                content: () => this.renderVm(AppsPage),
            },
        ];
        this.unitId = unitId;
    }
    internalStart() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSchema();
            this.tuid_message = this.entities.tuid('message'),
                this.tuid_user = this.entities.tuid('user'),
                this.action_readMessage = this.entities.action('readMessage'),
                this.action_newMessage = this.entities.action('newMessage'),
                this.action_actMessage = this.entities.action('actMessage'),
                this.query_getDesk = this.entities.query('getDesk'),
                this.query_getFolder = this.entities.query('getFolder'),
                this.query_getFolderUndone = this.entities.query('getFolderUndone'),
                this.query_getMessage = this.entities.query('getMessage'),
                this.query_getTemplets = this.entities.query('getTemplets'),
                //this.tuid_message.setItemObservable();
                this.desk = new Desk(this.unit, this.query_getDesk);
            this.desk.scrollToBottom();
            yield this.desk.first(undefined);
            this.sendFolder = new SendFolder(this.unit, this.query_getFolder);
            this.passFolder = new PassFolder(this.unit, this.query_getFolder);
            this.ccFolder = new CcFolder(this.unit, this.query_getFolder);
            this.allFolder = new AllFolder(this.unit, this.query_getFolder);
            this.loadFoldsUndone();
            yield this.showVm(VmUnitx);
        });
    }
    showAppsPage() {
        //this.showVm(AppsPage);
        alert('AppsPage cannot show');
    }
    jobPage(msg) {
        this.showVm(JobPage, msg);
    }
    jobEdit(templet) {
        this.showVm(JobEdit, templet);
    }
    myFolders() {
        return this.renderVm(MyFolders);
    }
    wholeFolders() {
        return this.renderVm(WholeFolders);
    }
    getQuery(name) {
        return this.entities.query(name);
    }
    readMessage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.action_readMessage.submit({ msg: id });
        });
    }
    actMessage(msg, act, toState, to) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id } = msg;
            yield this.action_actMessage.submit({
                msg: id,
                curState: toState,
                toState: '#',
                action: act,
                to: to
            });
        });
    }
    onMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let { $type, $push, msg, to, action, data } = message;
            this.pushId = $push;
            if ($type !== 'msg')
                return;
            if (!action)
                return;
            console.log('ws message: ', message);
            let parts = action.split('\t');
            for (let p of parts) {
                switch (p) {
                    default:
                        this.to(p, this.dataToMsg(data));
                        break;
                    case '$away':
                        this.removeFromDesk(msg);
                        break;
                    case '$read':
                        this.messageBeReaden(msg);
                        break;
                }
            }
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
            id: this.tuid_message.createID(id),
            message: m,
            branch: branch,
            done: done,
            prevState: prevState,
            state: state,
        };
    }
    ;
    to(action, ms) {
        let { id, message, branch, done, prevState, state } = ms;
        let folder;
        let parts = action.split(',');
        for (let p of parts) {
            switch (p) {
                default: return;
                case '$desk':
                    //this.changeUread(1);
                    folder = this.desk;
                    break;
                case '$me':
                    folder = this.sendFolder;
                    break;
                case '$pass':
                    folder = this.passFolder;
                    break;
                case '$cc':
                    folder = this.ccFolder;
                    break;
            }
            // folder === undefined, then chat not loaded
            if (folder === undefined)
                return;
            if (message !== undefined) {
                let { fromUser } = message;
                this.tuid_message.cacheValue(message);
                this.tuid_user.useId(fromUser);
            }
            let item = {
                id: id,
                read: 0,
                branch: branch,
                done: done,
                prevState: prevState,
                state: state
            };
            this.allFolder.updateItem(item, false);
            folder.updateItem(item);
            folder.scrollToBottom();
        }
    }
    changeUread(delta) {
        let unread = this.unit.unread;
        if (unread !== undefined) {
            unread += delta;
            if (unread >= 0) {
                this.unit.unread = unread;
            }
        }
    }
    removeFromDesk(id) {
        //this.changeUread(-1);
        if (this.desk !== undefined)
            this.desk.remove(id);
    }
    messageBeReaden(id) {
        if (this.desk === undefined)
            return;
        let msg = this.desk.items.find(v => v.message.id === id);
        if (msg !== undefined)
            msg.read = 1;
    }
    newMessage(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.userMeUploaded === false) {
                let { name, nick, icon } = nav.user;
                msg.meName = name;
                msg.meNick = nick;
                msg.meIcon = icon;
                this.userMeUploaded = true;
            }
            return yield this.action_newMessage.submit(msg);
        });
    }
    loadFoldsUndone() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.query_getFolderUndone.query({});
            let { unDesk, unMe, onMe, unPass, onPass, unCc, onCc } = ret.ret[0];
            // this.unit.unread = unDesk;
            this.sendFolder.undone = unMe;
            this.sendFolder.doing = onMe;
            this.passFolder.undone = unPass;
            this.passFolder.doing = onPass;
            this.ccFolder.undone = unCc;
            this.ccFolder.doing = onCc;
        });
    }
    getMessage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.query_getMessage.query({ msg: id });
            let { ret, flow } = result;
            if (ret.length === 0)
                return;
            let r = ret[0];
            return {
                msg: ret[0],
                flow: r.flow,
                flows: flow,
            };
        });
    }
    getTemplets() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.templets === undefined) {
                let ret = yield this.query_getTemplets.query({});
                this.templets = ret.ret;
            }
            return this.templets;
        });
    }
}
class VmUnitx extends VmPage {
    constructor() {
        super(...arguments);
        this.unleash = () => __awaiter(this, void 0, void 0, function* () {
            if (confirm("真的要取消关注吗？") === false)
                return;
            yield store.unfollowUnit();
            this.closePage();
        });
        this.rightMenu = [
            {
                caption: '取消关注',
                icon: 'trash',
                action: this.unleash,
            }
        ];
        this.clickToAdmin = () => __awaiter(this, void 0, void 0, function* () {
            let adminApp = yield store.getAdminApp();
            let unitId = store.unit.id;
            isBridged();
            nav.navToApp(adminApp.url, unitId);
        });
        this.view = () => {
            let { tabs } = this.coordinator;
            let { id, name, discription, apps, icon, ownerName, ownerNick, isOwner, isAdmin } = store.unit;
            if (ownerNick !== undefined)
                ownerNick = '- ' + ownerNick;
            let right;
            if (id > 0) {
                right = React.createElement(DropdownActions, { actions: this.rightMenu });
            }
            return React.createElement(Page, { tabs: tabs, header: store.unit.name, keepHeader: true, right: right });
        };
    }
    showEntry() {
        return __awaiter(this, void 0, void 0, function* () {
            this.openPage(this.view);
        });
    }
}
//# sourceMappingURL=crUnitxUsq.js.map