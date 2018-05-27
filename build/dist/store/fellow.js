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
import mainApi from '../mainApi';
export class Fellow {
    constructor(store) {
        this.invites = undefined;
        this.newInvitesCount = 0;
        this.store = store;
    }
    logout() {
        this.invites = undefined;
        this.newInvitesCount = 0;
    }
    msgUnitInvited(um) {
        if (this.invites === undefined) {
            this.newInvitesCount++;
        }
        else if (this.invites.find(v => v.id === um.id) === undefined) {
            this.invites.push(um);
            //if (um.isNew === true && this.newInvitesCount !== undefined)
            //    this.newInvitesCount++;
        }
    }
    loadInvites() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.invites === undefined) {
                this.invites = [];
                let ret; // = await mainApi.typeMessages('unit-follow-invite');
                if (ret === undefined)
                    return;
                //ret.forEach(v => this.mainData.processMessage(v));
            }
            //let ids = this.invites.filter(v => v.isNew === true).map(v => v.id);
            //await messageApi.readMessages(ids);
        });
    }
    refuseInvite(um) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mainApi.removeMessage(um.id);
            this.removeInvite(um);
        });
    }
    removeInvite(um) {
        let index = this.invites.findIndex(v => v.id === um.id);
        this.invites.splice(index, 1);
    }
}
__decorate([
    observable
], Fellow.prototype, "invites", void 0);
__decorate([
    observable
], Fellow.prototype, "newInvitesCount", void 0);
//# sourceMappingURL=fellow.js.map