import * as React from 'react';
import _ from 'lodash';
import { observable } from 'mobx';
import { Controller, VPage, Page, nav } from "tonva-tools";
import mainApi from '../mainApi';
import { Unit } from './unit';
import { Sticky, StickyUnit, sysUnit, App, Grant } from './model';
import { VMe } from './vMe';
import { VHome } from './vHome';
import { VUnitAbout } from './vUnitAbout';
import { navToApp } from 'navToApp';
import { CMessages } from 'messages';

export class CHome extends Controller {
    @observable stickies: Sticky[];
    @observable units = new Map<number, Unit>();
    @observable unit:Unit = undefined;
    adminUnits: Unit[];
    grant: Grant;
    private adminApp: App;

    protected async internalStart() {
        //this.loadStickies();
        await this.showUnit(undefined);
        this.openVPage(VHome);
    }

    async showUnit(unitId: number) {
        /*
        if (unitId === 0) {
            let cMessages = new CMessages();
            await cMessages.start();
            return;
        }*/

        if (this.unit === undefined) {
            let unit = new Unit(undefined);
            await unit.loadApps();
            if (unit.id === undefined) return;
            this.unit = unit;
            this.units[unit.id] = this.unit;
            return;
        }
        if (this.unit.id === unitId) {
            return;
        }
        this.unit = this.units.get(unitId);
        if (!this.unit) {
            alert(unitId + 'not exists');
            return;
        }
        await this.unit.loadApps();
    }

    async showUnitAbout() {
        this.openVPage(VUnitAbout);
    }
    reloadStickies() {
        this.stickies = undefined;
    }
    async loadStickies() {
        if (this.stickies !== undefined) return;
        let stickies = [];
        let ret = await mainApi.stickies();
        let t0:Sticky[] = ret[0];
        let t4 = ret[4];
        for (let s of t0) {
            switch (s.type) {
                case 3: 
                    let u = s.obj = t4.find(v => v.id === s.objId);
                    let {id, type, name, discription, icon, unread, date, owner} = u;
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
            let {unread, date} = sys;
            this.addSysUnitStick(stickies, unread, date);
        }
        this.stickies = stickies;
    }

    private addSysUnitStick(stickies: Sticky[], unread:number, date:Date) {
        if (unread === undefined || unread <= 0) return;
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
        //let index = stickies.findIndex(v => (v.type === 0 || v.type === 3) && v.objId === 0);
        //if (index < 0) {
            //let unit0 = this.units.get(0);
            //if (unit0 === undefined) return;
            let sticky:StickyUnit = _.clone(sysUnit);
            sticky.unread = unread;
            //let {name, discription, icon} = sysUnit;
            stickies.unshift({
                id: 0,
                date: new Date,
                type: 0,
                //main: name,
                objId: 0,
                obj: sticky,
                //ex: discription,
                //icon: icon,
            });
            return;
        //}
        //if (index > 0) {
        //    let sticky = stickies.splice(index, 1)[0];
        //    stickies.unshift(sticky);
        //}
    }

    async loadAdminUnits() {
        if (this.adminUnits !== undefined) return;
        let ret = await mainApi.adminUnits();
        this.adminUnits = [];
        for (let r of ret[0]) {
            let {id, name, nick, discription, icon, type, isAdmin, isOwner} = r;
            let unit = new Unit(id);
            unit.name = name;
            unit.nick = nick;
            unit.discription = discription;
            unit.icon = icon;
            unit.type = type;
            unit.isAdmin = isAdmin;
            unit.isOwner = isOwner;
            this.adminUnits.push(unit);
        }
        let r1 = ret[1];
        if (r1.length === 0) {
            this.grant = {
                allowDev: 0,
                sumDev: 0,
                allowUnit: 0,
                sumUnit: 0,
            };
        }
        else {
            this.grant = r1[0];
        }
    }

    async showMe() {
        this.openVPage(VMe);
    }

    async navToAdmin(unit?: Unit) {
        if (this.adminApp === undefined) {
            this.adminApp = await mainApi.adminUrl();
        }
        if (!unit) unit = this.unit;
        if (!unit) return;
        await navToApp(this.adminApp, unit.id);
        await this.unit.loadApps(); // 重新加载unit及其apps
    }

    async logout() {
        this.stickies.splice(0, this.stickies.length);
        this.units.clear();
        this.unit = undefined;
        nav.logout();
        //this.cacheUsers.dict.clear();
        //this.cacheUnits.dict.clear();
        //this.follow.logout();
    }
    
    async unitCreate(data:any): Promise<any> {
        return await mainApi.unitCreateDirect(data);
    }
}
