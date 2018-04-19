import * as React from 'react';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {nav, Page, ListView, ListItem, isBridged} from 'tonva-tools';
import {List, LMR, Badge, EasyDate, Muted, PropGrid, Prop, FA} from 'tonva-react-form';
import consts from '../consts';
import {Unit, App} from '../model';
import {store} from '../store';
import {Chat} from './chat';

// interface TieAppsProps extends UnitApps {
//}

@observer
export class TieApps extends React.Component {
    constructor(props) {
        super(props);
        this.appClick = this.appClick.bind(this);
        //this.appConverter = this.appConverter.bind(this);
        this.renderRow = this.renderRow.bind(this);
    }
    async appClick(app:App) {
        let appId = app.id;
        if (appId === 0) {
            nav.push(<Chat />);
        }
        else {
            let unitId = store.unit.id;
            let url = app.url;
            if (url === undefined) {
                alert('APP: ' + app.name + '\n' + app.discription + '\n尚未绑定服务');
            }
            else {
                nav.navToApp(url, unitId);
            }
        }
    }
    /*
    appConverter(app:App):ListItem {
        return {
            key: app.id,
            date: undefined,
            main: app.name,
            vice: app.discription,
            icon : app.icon || consts.appItemIcon,
            //unread: 0,
        }
    }*/
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
        let right;
        if (isOwner === 1 || isAdmin === 1) {
            right = <Button color="success" size="sm" onClick={()=>this.clickToAdmin()}>进入管理</Button>;
        }
        return <Page header={name} right={right}>
            <div className='apps-list-top'>
                <img src={icon || consts.appItemIcon} />
                <div>
                    <header>{name}</header>
                    <div>
                        <label>简介：</label>
                        <span>{discription}</span>
                    </div>
                    <div>
                        <label>发布者：</label>
                        <span>{ownerName} {ownerNick}</span>
                    </div>
                </div>
            </div>
            <List items={apps} item={{render:this.renderRow, onClick:this.appClick}} />
        </Page>;
        // <ListView items={apps} converter={this.appConverter} itemClick={this.appClick} />
    }
}
