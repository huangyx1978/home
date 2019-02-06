import * as React from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {List, LMR, Badge, EasyDate, Muted, PropGrid, Prop, FA} from 'tonva-react-form';
import {nav, Page, meInFrame} from 'tonva-tools';
import consts from '../consts';
import {store} from '../store';
//import {MainPage} from '../unitx';
import {Sticky, StickyUnit} from '../model';
import { CUnitxUq } from 'unitx/cUnitxUsq';
import { CMessages } from 'messages';
import { navToApp } from 'navToApp';

@observer
class Home extends React.Component {
    async componentDidMount() {
        await store.loadStickies();
    }
    private stickyClick = async (item:Sticky) => {
        let objId = item.objId;
        if (objId === 0) {
            let cMessages = new CMessages();
            await cMessages.start();
            return;
        }
        let unitId = objId;
        meInFrame.unit = unitId;
        
        await store.setUnit(unitId);

        if (store.unit.type === 1) {
            // dev clicked
            let adminApp = await store.getAdminApp();
            navToApp(adminApp, unitId);
            return;
        }
        let crUnitxUsq = new CUnitxUq(store.unit);
        await crUnitxUsq.start();
    }
    private stickyRender = (s:Sticky, index:number):JSX.Element => {
        let {type, date, objId, obj} = s;
        let unread:number;
        let unit = store.units.get(objId);
        if (unit !== undefined) {
            unread = unit.unread;
            date = unit.date;
            //unread = messages === undefined? 0 : messages.unread;
        }
        switch (type) {
            case 3:
                if (obj === undefined) return;
                return this.stickyUnit(date, obj as StickyUnit, unread);
            case 0:
                if (obj === undefined) return;
                return this.stickyUnit(date, obj as StickyUnit, unread);
        }
    }
    private stickyUnit(date:Date, unit:StickyUnit, unread:number):JSX.Element {
        let {name, nick, discription, icon, date:uDate, subject} = unit;
        let vice;
        if (subject !== undefined)
            vice = <div className="small text-success">{subject}</div>;
        else
            vice = <div className="small text-muted">{discription}</div>;
        return <LMR className="px-3 py-2"
            left={<Badge badge={unread || unit.unread}><img src={icon || consts.appItemIcon} /></Badge>}
            right={<small className="text-muted"><EasyDate date={date} /></small>}
        >
            <div className="px-3">
                <div><b>{nick || name}</b></div>
                {vice}
            </div>
        </LMR>;
    }
    render() {
        let stickies = store.stickies;
        return <div>
            <List items={stickies} 
                item={{render: this.stickyRender, onClick: this.stickyClick}} 
                loading="读取..." />
        </div>;
    }
}

export default Home;