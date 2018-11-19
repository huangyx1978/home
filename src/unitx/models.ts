import {observable} from 'mobx';
import { BoxId, Query } from 'tonva-react-usql';
import { PageItems } from 'tonva-tools';
import { Unit } from 'store';

export interface Item {
    message: BoxId; // number;
    branch: number;
    done: number;
    prevState: string;
    state: string;
    flow?: number;  // 如果undefined，则不是我当下需要处理的
}
export class FolderPageItems<T extends Item> extends PageItems<T> {
    private unit:Unit;
    private query:Query;
    @observable undone:number;
    @observable doing:number;

    constructor(unit:Unit, query:Query) {
        super(true);
        this.unit = unit;
        this.query = query;
        this.appendPosition = 'head';
        //if (query !== undefined) query.resetPage(30, {});
    }
    protected  async load():Promise<T[]> {
        let ret = await this.query.page(this.param, this.pageStart, this.pageSize);
        //let arr = ret['$page'];
        return ret;
    }
    protected setPageStart(item:T) {
        if (item === undefined)
            this.pageStart = undefined;
        else
            this.pageStart = item.message;
    }
    remove(id:number) {
        let item = this._items.find(v => v.message.id === id);
        if (item !== undefined) this.items.remove(item);
    }
    updateItem(item:T, doneDelete: boolean = true) {
        let {message, branch, done, flow, prevState, state} = item;
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
            if (done<branch) this.undone++;
            else this.undone--;
        }
        if (state.startsWith('#')) this.doing--;
        if (!prevState) this.doing++;
    }
}

export interface DeskItem extends Item {
    read: number;
    //state: string;
}
export class DeskPageItems extends FolderPageItems<DeskItem> {
    @observable unread: number;
    updateItem(item:DeskItem) {
        super.updateItem(item);
        if (this.loaded === true) {
            if (this.unread === undefined) this.unread = 0;
            ++this.unread;
        }
    }
}

export interface SendFolderItem extends Item {
}
export class SendFolder extends FolderPageItems<SendFolderItem> {
}

export interface PassFolderItem extends Item {
}
export class PassFolder extends FolderPageItems<PassFolderItem> {
}

export interface CcFolderItem extends Item {
}
export class CcFolder extends FolderPageItems<CcFolderItem> {
}

export interface AllFolderItem extends Item {
}
export class AllFolder extends FolderPageItems<AllFolderItem> {
}

