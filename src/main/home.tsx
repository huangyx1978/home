import * as React from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import * as classNames from 'classnames';
import {nav, Page, ListView, ListItem} from 'tonva-tools'; //views, View,
//import {Unit, UnitsGroup, UnitRole, UnitApp, UnitMessage,
//    HomeApp as HomeRowData, HomeAppItem as HomeRowItemData} from '../home/model';
import consts from '../consts';
import {mainData} from '../mainData';
import {TieApps} from './tieApps';
//import api from '../../api';
//import {loadHome} from '../home/action';

import {Sticky} from '../model';
import { Fragment } from 'react';

const bkStyle={backgroundColor: '#cfcfff', margin:'0', padding:'6px'};
const iconStyle={color:'green'};
const icon=(name) => <div style={bkStyle}><i style={iconStyle} className={'fa fa-lg fa-' + name} /></div>;

@observer
class Home extends React.Component {
    private actions:ListItem[] = [
        {
            key: 1,
            main: '创建小号',
            //right: '增删管理员',
            icon: icon('user-plus'),
            onClick: () => alert('a'), //nav.push(<NewFollows />),
            //unread: computed(()=>mainData.newFollow),
        },
    ];

    constructor(props) {
        super(props);
        this.itemClick = this.itemClick.bind(this);
    }
    async componentDidMount() {
        await mainData.loadStickies();
        //this.props.dispatch(loadHome(undefined));
        //dispatch(loadHome(undefined));
    }
    converter(s:Sticky):ListItem {
        return {
            key: s.id,
            main: s.main,
            icon: s.icon || consts.appItemIcon,
            date: s.date,
            vice: s.ex,
            unread: s.unread || 2,
        };
    }
    async itemClick(item:Sticky) {
        let objId = item.objId;
        let unitApps = await mainData.loadApps(objId);
        if (unitApps === undefined) {
            console.log('cannot load unit apps of ' + objId);
            return;
        }
        nav.push(<TieApps {...unitApps} />);
/*
        setTimeout(()=>{
            alert(JSON.stringify(unitApps));
        }, 100);
        //alert(JSON.stringify(mainData.ties));

        //this.showAlert(JSON.stringify(mainData.ties)).then(()=>{});
*/
    }
    /*
    showAlert(msg:string):Promise<void> {
        return new Promise<void>((resolve, reject) => {
            alert(msg);
            resolve();
        });
    }*/
    render() {
        let actions = <Fragment>
            <ListView items={this.actions} />
            <div style={{height:'10px'}} />
        </Fragment>
        
        return <div>
            {actions}
            <ListView
                items={mainData.stickies}
                itemClick={this.itemClick}
                converter={this.converter}
                //mapper={this.rowMapper}
            />
        </div>;
    }
}

export default Home;