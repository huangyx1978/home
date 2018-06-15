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
    private rightMenu:Action[] = [
        {
            caption: '取消关注',
            icon: 'trash',
            action: this.unleash,
        }
    ];
    constructor(props) {
        super(props);
        this.appClick = this.appClick.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.unleash = this.unleash.bind(this);
    }
    async componentWillMount() {
        let {unit} = store;
        if (unit.apps === undefined) {
            await unit.loadApps();
        }
    }
    async unleash() {
        if (confirm("真的要取消关注吗？") === false) return;
        await store.unfollowUnit();
        nav.pop();
    }
    async appClick(app:App) {
        let unitId = store.unit.id;
        let appId = app.id;
        if (appId === 0) {
            nav.debug();
            let api = new Api(undefined, undefined, undefined, undefined, undefined);
            let chat = await store.unit.chat;
            if (await chat.load() === false) {
                alert('chat api 创建出错');
                return;
            }
            nav.push(<MainPage />);
            //nav.navToApp('http://localhost:3016/', unitId);
        }
        else {
            let url = app.url;
            if (url === undefined) {
                alert('APP: ' + app.name + '\n' + app.discription + '\n尚未绑定服务');
            }
            else {
                nav.navToApp(url, unitId);
            }
        }
    }
    private renderRow(app:App, index:number):JSX.Element {
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
    async clickToAdmin() {
        let adminApp = await store.getAdminApp();
        //nav.push(<UnitMan {...this.props} />);
        let unitId = store.unit.id;
        isBridged();
        nav.navToApp(adminApp.url, unitId);
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
