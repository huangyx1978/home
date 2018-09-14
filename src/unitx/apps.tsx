import * as React from 'react';
import { observer } from 'mobx-react';
import { Button } from 'reactstrap';
import { nav } from 'tonva-tools';
import { List, LMR, Badge, Action } from 'tonva-react-form';
import consts from '../consts';
import { App } from '../model';
import { store } from '../store';
//import { MainPage } from './main';
import { navToApp } from './navToApp';
import { VmView } from 'tonva-react-usql';
import { CrUnitxUsq } from './crUnitxUsq';

//@observer
export class AppsPage extends VmView { //} React.Component {
    protected coordinator: CrUnitxUsq;

    unleash = async () => {
        if (confirm("真的要取消关注吗？") === false) return;
        await store.unfollowUnit();
        nav.pop();
    }
    private rightMenu:Action[] = [
        {
            caption: '取消关注',
            icon: 'trash',
            action: this.unleash,
        }
    ];
    async componentWillMount() {
        let {unit} = this.coordinator;
        if (unit.apps === undefined) {
            await unit.loadApps();
        }
    }
    appClick = async (app:App) => {
        let unitId = this.coordinator.unit.id;
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
        let unread:number = undefined;
        if (appId === 0) {
            unread = this.coordinator.unit.messages.unread;
            //let dict = store.messageUnreadDict;
            //unread = dict.get(unit);
        }
        return <LMR className="p-2"
            left={<Badge className="mr-2" badge={unread}><img src={icon || consts.appItemIcon} /></Badge>}>
            <b>{name}</b>
            <small className="text-muted">{discription}</small>
        </LMR>;
    }
    clickToAdmin = async () => {
        let adminApp = await store.getAdminApp();
        let unitId = this.coordinator.unit.id;
        navToApp(adminApp, unitId);
    }
    render() {
        let {id, name, discription, apps, icon, ownerName, ownerNick, isOwner, isAdmin} = this.coordinator.unit;
        if (ownerNick !== undefined) ownerNick = '- ' + ownerNick;
        let enterAdmins;
        if (isOwner === 1 || isAdmin === 1) {
            enterAdmins = <Button color="success align-self-start" size="sm" onClick={()=>this.clickToAdmin()}>进入管理</Button>
        }
        let appsView;
        if (apps !== undefined) {
            appsView = <List items={apps} item={{render:this.renderRow, onClick:this.appClick}} />;
        }
        let divImg = <div className="mr-3"><img src={icon || consts.appItemIcon} /></div>;
        return <div>
            <LMR className="my-3 container-fluid" left={divImg}>
                <div className="row">
                    <h6 className="col-12">{name}</h6>
                </div>
                <div className="row">
                    <label className="small text-dark col-3">简介：</label>
                    <div className="col-9">{discription || '无'}</div>
                </div>
                <div className="row">
                    <label className="small text-dark col-3">发布者：</label>
                    <div className="col-9">{ownerName} {ownerNick}</div>
                </div>
            </LMR>
            {appsView}
        </div>;
    }
}
