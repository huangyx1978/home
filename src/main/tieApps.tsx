import * as React from 'react';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {nav, Page, ListView, ListItem} from 'tonva-tools';
import consts from '../consts';
import {UnitApps, App} from '../model';
import {store} from '../store';

// interface TieAppsProps extends UnitApps {
//}

@observer
export class TieApps extends React.Component {
    constructor(props) {
        super(props);
        this.appClick = this.appClick.bind(this);
        this.appConverter = this.appConverter.bind(this);
    }
    async appClick(app:App) {
        //let url = app.url + '#' + this.props.id + '-' + app.id;
        nav.navToApp(app.url, store.unitApps.id, app.id);
        // let api = await mainData.getAppApi(this.props.id, app.id, 'apis');
        // nav.navToApp('http://jjol.cn', false);
    }
    appConverter(app:App):ListItem {
        return {
            key: app.id,
            date: undefined,
            main: app.name,
            vice: app.discription,
            icon : app.icon || consts.appItemIcon,
            //unread: 0,
        }
    }
    async clickToAdmin() {
        let adminApp = await store.getAdminApp();
        //nav.push(<UnitMan {...this.props} />);
        nav.navToApp(adminApp.url, store.unitApps.id, adminApp.id);
    }
    render() {
        let {id, name, discription, apps, icon, ownerName, ownerNick, isOwner, isAdmin} = store.unitApps;
        if (ownerNick !== undefined) ownerNick = '- ' + ownerNick;
        let right;
        if (isOwner !== 0 || isAdmin !== 0) {
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
                    <Button onClick={()=>store.changeIsAdmin()}>Test</Button>
                </div>
            </div>
            <ListView items={apps} converter={this.appConverter} itemClick={this.appClick} />
        </Page>;
    }
}
