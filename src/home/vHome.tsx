import * as React from 'react';
import _ from 'lodash';
import { observable } from 'mobx';
import { Controller, VPage, Page, nav } from "tonva-tools";
import { LMR, FA, Badge, EasyDate, List } from 'tonva-react-form';
import { observer } from 'mobx-react';
import consts from 'consts';
import { Sticky, StickyUnit, sysUnit } from './model';
import { VApps } from './vApps';
import { CHome } from './cHome';

export class VHome extends VPage<CHome> {
    private elToggleButton: HTMLDivElement;
    private elSideBar: HTMLDivElement;
    @observable private sideBarOpened: boolean = false;

    async showEntry() {
        document.addEventListener('click', this.handleDocumentClick);
        document.addEventListener('touchstart', this.handleDocumentClick);
        this.regConfirmClose(this.confirmClose)
        this.openPage(this.page);
    }

    private confirmClose = async ():Promise<boolean> => {
        document.removeEventListener('click', this.handleDocumentClick);
        document.removeEventListener('touchstart', this.handleDocumentClick);
        return true;
    }

    private handleDocumentClick = async (evt:any) => {
        if (this.elToggleButton && this.elToggleButton.contains(evt.target)) {
            if (this.sideBarOpened === false) await this.controller.loadStickies();
            this.toggleOpen();
            return;
        }
        if (!this.elSideBar) return;
        if (!this.elSideBar.contains(evt.target)) {
            this.closeSideBar();
        }
    }

    private page = observer(() => {
        let {unit} = this.controller;
        let left = <div ref={v => this.elToggleButton=v} className="p-2 cursor-pointer">
            <FA name="navicon" size="lg" />
        </div>
        /*
        let header = <LMR className="w-100 text-center align-items-center" left={left}>
            {unit? unit.name : '同花'}
        </LMR>;
        */
        let header = unit? unit.name : '同花';
        let cnMain = "flex-fill";
        let sideBar = this.sideBar();
        //let sideBar = <div>ddd</div>;
        return <Page header={header} right={left} sideBar={sideBar}>
            <div className="d-flex h-100">
                <div className={cnMain}>
                    {this.renderVm(VApps)}
                </div>
            </div>
        </Page>;
    });

    private toggleOpen = () => {
        this.sideBarOpened = !this.sideBarOpened;
    }
    private closeSideBar() {
        this.sideBarOpened = false;
    }

    private onMeClick = async () => {
        this.closeSideBar();
        await this.controller.showMe();
    }

    private onAboutUnit = async () => {
        this.closeSideBar();
        await this.controller.showUnitAbout();
    }

    private aboutUnit() {
        let {unit} = this.controller;
        if (unit === undefined) return null;
        let {icon, name} = unit;
        let left = <img className="w-2c mr-3" src={icon || consts.appIcon} />;
        let right = <FA name="chevron-right" />;
        return <LMR className="px-2 py-2 cursor-pointer border-bottom border-info align-items-center"
            left={left} right={right}
            onClick={this.onAboutUnit}>
            <small className="text-muted">关于</small> <span>{name}</span>
        </LMR>;
    }

    private sideBar() {
        if (this.sideBarOpened === false) return null;
        let {user} = nav;
        let {nick, icon, name} = user;
        let {stickies} = this.controller;
        let spanName:any = nick?
            <span>{nick} {name}</span> :
            <span>{name}</span>;

        return <div className="w-30c position-absolute bg-white h-100 shadow-lg border-right border-light"
            style={{zIndex:1001, right:0, overflowX: 'hidden', overflowY: 'auto'}}
            ref={v => this.elSideBar = v}>
            <div className="px-2 py-2 cursor-pointer border-bottom border-info"
                onClick={this.onMeClick}>
                <img className="w-2c mr-3" src={icon || consts.appIcon} />
                {spanName}
            </div>
            {this.aboutUnit()}
            <List items={stickies}
                item={{render: this.stickyRender, onClick: this.stickyClick, key: (v:Sticky) => String(v.objId)}} />
        </div>
    }
    private stickyClick = async (item:Sticky) => {
        this.closeSideBar();
        await this.controller.showUnit(item.objId);
    }
    private stickyRender = (s:Sticky, index:number):JSX.Element => {
        let {type, date, objId, obj} = s;
        let unread:number;
        let unit = this.controller.units.get(objId);
        if (unit !== undefined) {
            unread = unit.unread;
            date = unit.date;
            //unread = messages === undefined? 0 : messages.unread;
        }
        let {unit:curUnit} = this.controller;
        let curUnitId = curUnit && curUnit.id;
        switch (type) {
            case 3:
                if (obj === undefined) return null;
                if (obj.id === curUnitId) return null;
                return this.stickyUnit(date, obj as StickyUnit, unread);
            case 0:
                if (obj === undefined) return;
                return this.stickyUnit(date, obj as StickyUnit, unread);
        }
    }
    private stickyUnit(date:Date, unit:StickyUnit, unread:number):JSX.Element {
        let {name, nick, discription, icon, date:uDate, subject} = unit;
        let vice: any;
        if (subject !== undefined)
            vice = <div className="small text-success">{subject}</div>;
        else
            vice = <div className="small text-muted">{discription}</div>;
        return <LMR className="px-2 py-2"
            left={<Badge size="xs" badge={unread || unit.unread}><img src={icon || consts.appItemIcon} /></Badge>}
            right={<small className="text-muted"><EasyDate date={date} /></small>}
        >
            <div className="px-3">
                <div>{nick || name}</div>
                {vice}
            </div>
        </LMR>;
    }
}
