import * as React from 'react';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {nav, Page, ListView, ListItem, isBridged, Api} from 'tonva-tools';
import {List, LMR, Badge, EasyDate, Muted, PropGrid, Prop, FA, Action, DropdownActions} from 'tonva-react-form';
import consts from '../consts';
import {Unit, App} from '../model';
import {store} from '../store';
import {MainPage} from '../chat';
import mainApi from '../mainApi';

@observer
export class AppsPage extends React.Component {
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
        let {unit} = store;
        if (unit.apps === undefined) {
            await unit.loadApps();
        }
    }
    appClick = async (app:App) => {
        let unitId = store.unit.id;
        let appId = app.id;
        if (appId === 0) {
            let api = new Api(undefined, undefined, undefined, undefined, undefined);
            let chat = await store.unit.chat;
            if (await chat.load() === false) {
                alert('chat api 创建出错');
                return;
            }
            nav.push(<MainPage />);
        }
        else {
            this.navToApp(app, unitId);
        }
    }
    private renderRow = (app:App, index:number):JSX.Element => {
        let {id:appId, name, icon, discription} = app;
        let unread:number = undefined;
        if (appId === 0) {
            unread = store.unit.messages.unread;
            //let dict = store.messageUnreadDict;
            //unread = dict.get(unit);
        }
        return <LMR className="p-2"
            left={<Badge badge={unread}><img src={icon || consts.appItemIcon} /></Badge>}
        >
            <b>{name}</b>
            <small className="text-muted">{discription}</small>
        </LMR>;
    }
    clickToAdmin = async () => {
        let adminApp = await store.getAdminApp();
        let unitId = store.unit.id;
        //nav.push(<UnitMan {...this.props} />);
        //isBridged();
        //nav.navToApp(adminApp.url, unitId);
        this.navToApp(adminApp, unitId);
    }
    private async navToApp(app, unitId) {
        let {url, urlDebug} = app;
        if (url === undefined) {
            alert('APP: ' + app.name + '\n' + app.discription + '\n尚未绑定服务');
            return;
        }
        else {
            if (urlDebug !== undefined
                && document.location.hostname === 'localhost')
            {
                try {
                    let urlTry = urlDebug + 'manifest.json';
                    let ret = await fetch(urlTry, {
                        method: "GET",
                        mode: "no-cors", // no-cors, cors, *same-origin
                        headers: {
                            "Content-Type": "text/plain"
                        },
                    });
                    url = urlDebug;
                    console.log('urlDebug %s is ok', urlDebug);
                }
                catch (err) {
                    console.log('urlDebug %s not run, use %s', urlDebug, url);
                }
            }
            nav.navToApp(url, unitId);
        }
    }
    render() {
        let {id, name, discription, apps, icon, ownerName, ownerNick, isOwner, isAdmin} = store.unit;
        if (ownerNick !== undefined) ownerNick = '- ' + ownerNick;
        let enterAdmins;
        if (isOwner === 1 || isAdmin === 1) {
            enterAdmins = <Button color="success align-self-start" size="sm" onClick={()=>this.clickToAdmin()}>进入管理</Button>
        }
        let appsView;
        if (apps !== undefined) {
            appsView = <List items={apps} item={{render:this.renderRow, onClick:this.appClick}} />;
        }
        return <div>
            <div className="my-3 container-fluid">
                <div className="row no-gutters">
                    <div className="col-sm-2">
                        <img src={icon || consts.appItemIcon} />
                    </div>
                    <div className="col-sm-8">
                        <div className="row">
                            <h5 className="col-sm-12">{name}</h5>
                        </div>
                        <div className="row">
                            <label className="col-sm-3">简介：</label>
                            <div className="col-sm-9">{discription || '无'}</div>
                        </div>
                        <div className="row">
                            <label className="col-sm-3">发布者：</label>
                            <div className="col-sm-9">{ownerName} {ownerNick}</div>
                        </div>
                    </div>
                    <div className="col-sm-2 d-flex justify-content-end">
                        {enterAdmins}
                    </div>
                </div>
            </div>
            {appsView}
        </div>;
    }
}
