import * as React from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import * as classNames from 'classnames';
import {List, LMR, Badge, EasyDate, Muted, PropGrid, Prop, FA} from 'tonva-react-form';
import {nav, Page} from 'tonva-tools';
import consts from '../consts';
import {store} from '../store';
import {TieApps} from './tieApps';
import {Sticky, StickyUnit} from '../model';
import { Fragment } from 'react';

@observer
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.stickyClick = this.stickyClick.bind(this);
        this.stickyRender = this.stickyRender.bind(this);
    }
    async componentDidMount() {
        await store.loadStickies();
    }
    async stickyClick(item:Sticky) {
        let objId = item.objId;
        await store.setUnit(objId);
        nav.push(<TieApps />);
    }
    private stickyRender(s:Sticky, index:number):JSX.Element {
        let {type, date, objId, obj} = s;
        let unread:number;
        let unit = store.units.get(objId);
        if (unit !== undefined) {
            let {messages} = unit;
            unread = messages === undefined? 0 : messages.unread;
        }
        switch (type) {
            case 3:
                if (obj === undefined) return;
                return this.stickyUnit(date, obj as StickyUnit, unread);
            case 0:
                if (obj === undefined) return;
                return this.stickyUnit(date, obj as StickyUnit, unread);
        }
        /*
        let unread:number;
        if (type === 0 || type === 3) { // unit
        }
        return <LMR className="p-2"
            left={<Badge badge={unread}><img src={icon || consts.appItemIcon} /></Badge>}
            right={<small className="text-muted"><EasyDate date={date} /></small>}
        >
            <b>{main}</b>
            <small className="text-muted">{ex}</small>
        </LMR>;
        */
    }
    private stickyUnit(date:Date, unit:StickyUnit, unread:number):JSX.Element {
        let {name, nick, discription, icon} = unit;
        return <LMR className="p-2"
            left={<Badge badge={unread}><img src={icon || consts.appItemIcon} /></Badge>}
            right={<small className="text-muted"><EasyDate date={date} /></small>}
        >
            <b>{nick || name}</b>
            <small className="text-muted">{discription}</small>
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