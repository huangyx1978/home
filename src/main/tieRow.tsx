import * as React from 'react';
import * as classNames from 'classnames';
import {nav, Page, ListView} from 'tonva-tools';
import homeApi from './homeApi';
import {Sticky} from '../model';
import {navToHao, navToHaoAttributes} from './tieHaoPage';
import consts from '../consts';
//import '../../css/app-row.css';

function dateText(date: Date) {
    if (!date) return;
    return '昨天';
}

interface Props {
    id: number;
    date: Date;
    type: number;
    main: string;
    objId: number;
    ex: string;
    icon: string;
    unread: number;
    isHome: boolean;
}
export default class TieRow extends React.Component<Props, null> {
    constructor(props) {
        super(props);
        this.click = this.click.bind(this);
    }

    private click() {
        let {id, isHome} = this.props;
        if (isHome)
            navToHao(id);
        else
            navToHaoAttributes(id);
    }

    private renderUnread(num: number) {
        if (!num) return null;
        return (<i>{num>99? '99+': num}</i>);
    }

    private renderMessage(msg, time) {
        if (msg === undefined) return null;
        let dt, sp;
        if (time) {
            dt = dateText(time) + ':';
            sp = '\u00a0\u00a0';
        }
        return <span>{dt}{sp}{msg}</span>;
    }

    render() {
        const {id, date, type, main, objId, ex, icon, unread, isHome} = this.props;
        let elUnread, elMessage, elDiscription;
        elDiscription = <span>{ex}</span>;
        if (isHome === true) {
            elUnread = this.renderUnread(unread);
            elMessage = this.renderMessage(main, date) || elDiscription;
        }
        else {
            elMessage = elDiscription;
        }
        return <li key={id} className='app-row' onClick={this.click}>
            <label>
                <img src={icon || consts.appIcon} />
                {elUnread}
            </label>
            <div>
                <div>{main}</div>
                {elMessage}
            </div>
        </li>;
    }
}

