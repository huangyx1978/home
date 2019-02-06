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
import { PageItems } from "tonva-tools";
import mainApi from '../mainApi';
export class PageMessages extends PageItems {
    constructor( /*unit:Unit, query:Query*/) {
        super(true);
        /*
        this.unit = unit;
        this.query = query;
        */
        this.appendPosition = 'head';
        //if (query !== undefined) query.resetPage(30, {});
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield mainApi.unitMessages(0, this.pageStart, this.pageSize);
            return ret; //['$page'];
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
], PageMessages.prototype, "unread", void 0);
//# sourceMappingURL=model.js.map