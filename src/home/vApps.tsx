import * as React from 'react';
import { View } from "tonva-tools";
import { CHome } from './cHome';
import { List, LMR, Muted, Badge } from 'tonva-react-form';
import consts from 'consts';
import { navToApp } from 'navToApp';
import { App } from './model';

export class VApps extends View<CHome> { //} React.Component {
    appClick = async (app:App) => {
        let unitId = this.controller.unit.id;
        let appId = app.id;
        if (appId === 0) {
            //let api = new Api(undefined, undefined, undefined, undefined);
            /*
            let unitx = await store.unit.unitx;
            if (await unitx.load() === false) {
                alert('chat api 创建出错');
                return;
            }
            //nav.push(<MainPage />);
            nav.push(<>unitx MainPage</>);
            */
        }
        else {
            await navToApp(app, unitId);
        }
    }
    private renderRow = (app:App, index:number):JSX.Element => {
        let {id:appId, name, icon, discription} = app;
        return <LMR className="px-3 py-2"
            left={<Badge><img src={icon || consts.appItemIcon} /></Badge>}>
            <div className="px-3">
                <div><b>{name}</b></div>
                <small className="text-muted">{discription}</small>
            </div>
        </LMR>;
    }
    clickToAdmin = async () => {
        let adminApp = undefined; //await store.getAdminApp();
        let unitId = this.controller.unit.id;
        await navToApp(adminApp, unitId);
    }
    render() {
        let {unit} = this.controller;
        if (!unit) return null;
        //let {id, name, discription, apps, icon, ownerName, ownerNick, isOwner, isAdmin} = unit;
        let {apps} = unit;
        /*
        if (ownerNick) ownerNick = '- ' + ownerNick;
        let enterAdmins;
        if (isOwner === 1 || isAdmin === 1) {
            enterAdmins = <button 
                className="btn btn-success btn-sm align-self-start" onClick={()=>this.clickToAdmin()}>
                进入管理
            </button>
        }
        */
        let appsView:any;
        if (apps !== undefined) {
            appsView = <List items={apps} item={{render:this.renderRow, onClick:this.appClick}} />;
        }
        return appsView;
        /*
        let divImg = <div className="mr-3"><img src={icon || consts.appItemIcon} /></div>;
        return <div>
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
            {appsView}
        </div>;
        */
    }
}
