import * as React from 'react';
import {nav, Page, ListView, ListItem} from 'tonva-tools';
import consts from '../consts';
import {UnitApps, App} from './model';
import {mainData} from './mainData';

interface TieAppsProps extends UnitApps {
}

export class TieApps extends React.Component<TieAppsProps> {
    constructor(props) {
        super(props);
        this.appClick = this.appClick.bind(this);
        this.appConverter = this.appConverter.bind(this);
    }
    async appClick(app:App) {
        let api = await mainData.getAppApi(this.props.id, app.id, 'apis');
        //alert(JSON.stringify(api));
        nav.navToApp('http://jjol.cn');
    }
    appConverter(app:App):ListItem {
        return {
            key: app.id,
            date: undefined,
            main: app.name,
            vice: app.discription,
            icon : app.icon || consts.appItemIcon,
            unread: 0,
        }
    }
    render() {
        let {name, discription, apps, icon, ownerName, ownerNick} = this.props;
        if (ownerNick !== undefined) ownerNick = '- ' + ownerNick;
        return <Page header={name}>
            <div className='app-top'>
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
            <ListView items={apps} converter={this.appConverter} itemClick={this.appClick} />
        </Page>;
    }
}
