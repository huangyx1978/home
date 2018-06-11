import {CacheIds} from 'tonva-tools';
import {UserBase, UnitBase} from '../model';
import mainApi from '../mainApi';

export class CacheUsers extends CacheIds<UserBase> {
    protected async _loadIds(ids:number[]):Promise<UserBase[]> {
        return;
    }
    protected async _loadId(id:number):Promise<UserBase> {
        return await mainApi.userBase(id);
    }
}

export class CacheUnits extends CacheIds<UnitBase> {
    protected async _loadIds(ids:number[]):Promise<UnitBase[]> {
        return;
    }
    protected async _loadId(id:number):Promise<UnitBase> {
        return await mainApi.unitBase(id);
    }
}
