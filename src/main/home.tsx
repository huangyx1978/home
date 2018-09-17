import * as React from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {List, LMR, Badge, EasyDate, Muted, PropGrid, Prop, FA} from 'tonva-react-form';
import {nav, Page, meInFrame} from 'tonva-tools';
import consts from '../consts';
import {store} from '../store';
//import {MainPage} from '../unitx';
import {Sticky, StickyUnit} from '../model';
import { CrUnitxUsq } from 'unitx/crUnitxUsq';

@observer
class Home extends React.Component {
    async componentDidMount() {
        await store.loadStickies();
    }
    private stickyClick = async (item:Sticky) => {
        let objId = item.objId;
        meInFrame.unit = objId;
        
        await store.setUnit(objId);
        /*
        let unitx = await store.unit.unitx;
        if (await unitx.load() === false) {
            return;
        }
        */
        let crUnitxUsq = new CrUnitxUsq(store.unit);
        await crUnitxUsq.start();
        /*
        nav.push(<MainPage />);
        nav.regConfirmClose(async () => {
            store.setUnitRead();
            return true;
        });
        */
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
        let {name, nick, discription, icon, date:uDate} = unit;
        return <LMR className="px-3 py-2"
            left={<Badge badge={unread}><img src={icon || consts.appItemIcon} /></Badge>}
            right={<small className="text-muted"><EasyDate date={date} /></small>}
        >
            <div className="px-3">
                <div><b>{nick || name}</b></div>
                <div className="small text-muted">{discription}</div>
            </div>
        </LMR>;
    }
    render() {
        let stickies = store.stickies;
        return <div>
            <List items={stickies} item={{render: this.stickyRender, onClick: this.stickyClick}} />
        </div>;
    }
}

export default Home;