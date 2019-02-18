import * as React from 'react';
import { VPage, Page } from "tonva-tools";
import { CHome } from "./cHome";
import { LMR, Muted, Image } from 'tonva-react-form';
import consts from 'consts';

export class VUnitAbout extends VPage<CHome> {
    async open() {
        this.openPage(this.page);
    }

    clickToAdmin = async () => {
        await this.controller.navToAdmin();
    }

    private page = ():JSX.Element => {
        let {unit} = this.controller;
        let {id, name, discription, apps, icon, ownerName, ownerNick, isOwner, isAdmin} = unit;
        if (ownerNick) ownerNick = '- ' + ownerNick;
        let enterAdmins:any;
        if (isOwner === 1 || isAdmin === 1) {
            enterAdmins = <button 
                className="btn btn-success btn-sm align-self-start" onClick={()=>this.clickToAdmin()}>
                进入管理
            </button>
        }
        let divImg = <div className="mr-3"><Image src={icon} /></div>;
        return <Page header={'关于 ' + name}>
            <LMR className="my-3 container-fluid" left={divImg} right={enterAdmins}>
                <div className="row">
                    <h6 className="col-12">{name}</h6>
                </div>
                <div className="row">
                    <label className="small text-dark col-3">简介：</label>
                    <div className="col-9">{discription || <Muted>无</Muted>}</div>
                </div>
                <div className="row">
                    <label className="small text-dark col-3">发布者：</label>
                    <div className="col-9">{ownerName} {ownerNick}</div>
                </div>
            </LMR>
        </Page>;
    }
}