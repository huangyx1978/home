import * as React from 'react';
import _ from 'lodash';
import { observable } from 'mobx';
import { Controller, VPage, Page, nav } from "tonva-tools";
import mainApi from './mainApi';
import { Unit } from './unit';
import { Sticky, StickyUnit, sysUnit, App } from './model';
import { VMe } from './vMe';
import { VHome } from './vHome';
import { VUnitAbout } from './vUnitAbout';
import { navToApp } from 'navToApp';

export class CHome extends Controller {
    @observable stickies: Sticky[];
    @observable units = new Map<number, Unit>();
    @observable unit:Unit = undefined;
    adminUnits: Unit[];
    private adminApp: App;

    protected async internalStart() {
        //this.loadStickies();
        await this.showUnit(undefined);
        this.showVPage(VHome);
    }

    async showUnit(unitId: number) {
        if (this.unit === undefined) {
            this.unit = new Unit(undefined);
            await this.unit.loadApps();
            this.units[this.unit.id] = this.unit;
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
        this.showVPage(VUnitAbout);
    }

    async loadStickies() {
        if (this.stickies !== undefined) return;
        let stickies = [];
        let ret = await mainApi.stickies();
        //if (this.stickies === undefined) this.stickies = [];
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
                    //unit.unread = unread;
                    //unit.date = date;
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
        /*
        for (let i=0; i<30; i++) {
            let s = _.clone(stickies[0]);
            s.id = 10000 + i;
            s.objId = 10000 + i;
            stickies.push(s);
        } */
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
        let index = stickies.findIndex(v => (v.type === 0 || v.type === 3) && v.objId === 0);
        if (index < 0) {
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
        }
        if (index > 0) {
            let sticky = stickies.splice(index, 1)[0];
            stickies.unshift(sticky);
        }
    }

    async showMe() {
        if (this.adminUnits === undefined) {
            let ret = await mainApi.adminUnits();
            this.adminUnits = [];
            for (let r of ret) {
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
        }
        this.showVPage(VMe);
        //nav.push(<Page header="我"><Me /></Page>);
    }

    async navToAdmin(unit?: Unit) {
        if (this.adminApp === undefined) {
            this.adminApp = await mainApi.adminUrl();
        }
        if (!unit) unit = this.unit;
        if (!unit) return;
        navToApp(this.adminApp, unit.id);
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
}
