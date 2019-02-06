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
import { PageItems } from 'tonva-tools';
export class FolderPageItems extends PageItems {
    constructor(unit, query) {
        super(true);
        this.unit = unit;
        this.query = query;
        this.appendPosition = 'head';
        //if (query !== undefined) query.resetPage(30, {});
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.query.page(this.param, this.pageStart, this.pageSize);
            //let arr = ret['$page'];
            return ret;
        });
    }
    setPageStart(item) {
        if (item === undefined)
            this.pageStart = undefined;
        else
            this.pageStart = item.message;
    }
    remove(id) {
        let item = this._items.find(v => v.message.id === id);
        if (item !== undefined)
            this.items.remove(item);
    }
    updateItem(item, doneDelete = true) {
        let { message, branch, done, flow, prevState, state } = item;
        if (this.loaded === true) {
            let index = this._items.findIndex(v => v.message === message);
            if (index < 0) {
                if (done === undefined || done < branch) {
                    this.append(item);
                    this.undone++;
                }
            }
            else {
                let _item = this._items[index];
                if (doneDelete === true) {
                    if (done >= branch) {
                        item.done = done;
                        this.undone--;
                        this._items.splice(index, 1);
                    }
                }
                _item.branch = branch;
                _item.done = done;
                _item.flow = flow;
            }
        }
        else {
            if (done < branch)
                this.undone++;
            else
                this.undone--;
        }
        if (state.startsWith('#'))
            this.doing--;
        if (!prevState)
            this.doing++;
    }
}
__decorate([
    observable
], FolderPageItems.prototype, "undone", void 0);
__decorate([
    observable
], FolderPageItems.prototype, "doing", void 0);
export class DeskPageItems extends FolderPageItems {
    updateItem(item) {
        super.updateItem(item);
        if (this.loaded === true) {
            if (this.unread === undefined)
                this.unread = 0;
            ++this.unread;
        }
    }
}
__decorate([
    observable
], DeskPageItems.prototype, "unread", void 0);
export class SendFolder extends FolderPageItems {
}
export class PassFolder extends FolderPageItems {
}
export class CcFolder extends FolderPageItems {
}
export class AllFolder extends FolderPageItems {
}
//# sourceMappingURL=models.js.map