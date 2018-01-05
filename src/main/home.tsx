import * as React from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import * as classNames from 'classnames';
import {List, LMR, Badge, EasyDate, Muted, PropGrid, Prop, FA} from 'tonva-react-form';
import {nav, Page} from 'tonva-tools';
import consts from '../consts';
import {store} from '../store';
import {TieApps} from './tieApps';
import {Sticky} from '../model';
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
        await store.loadApps(objId);
        /*
        if (unitApps === undefined) {
            console.log('cannot load unit apps of ' + objId);
            return;
        }*/
        nav.push(<TieApps />);
    }
    private stickyRender(s:Sticky, index:number):JSX.Element {
        let {type, icon, date, main, ex, objId} = s;
        let unread:number;
        if (type === 3) { // unit
            let unit = store.unitDict.get(objId);
            if (unit !== undefined) unread = unit.unread;
            //unread = store.messageUnreadDict.get(objId);
        }
        return <LMR className="p-2"
            left={<Badge badge={unread}><img src={icon || consts.appItemIcon} /></Badge>}
            right={<small className="text-muted"><EasyDate date={date} /></small>}
        >
            <b>{main}</b>
            <small className="text-muted">{ex}</small>
        </LMR>;
    }
    render() {
        let rows:Prop[] = [
            {
                type: 'component',
                onClick: () => alert('a'),
                component: <LMR
                    className="py-2 align-items-center"
                    left={<FA className="text-primary" name="user-plus" size="lg" fixWidth={true} />}
                >
                    创建小号
                </LMR>,
            },
            '=',
        ];
        
        return <div>
            <PropGrid rows={rows} values={undefined} />
            <List items={store.stickies} item={{render: this.stickyRender, onClick: this.stickyClick}} />
        </div>;
    }
}

export default Home;