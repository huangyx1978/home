import * as React from 'react';
import {Card, CardHeader, CardBody, CardText, CardTitle} from 'reactstrap';
import {nav, Page, ListView, ListItem} from 'tonva-tools';
import consts from '../consts';
import {UnitApps, UnitAdmin} from '../model';
import {mainData} from '../mainData';
import UnitAdminsView from './admins';

const iconStyle={color:'#7f7fff', margin:'6px 0'};
const iconFont=(name) => <i style={iconStyle} className={'fa fa-lg fa-' + name} />;

export default class UnitMan extends React.Component<UnitApps, null> {
    private items: ListItem[] = [
        {
            main: '管理员',
            right: '增删管理员',
            icon: iconFont('universal-access'),
            onClick: () => nav.push(<UnitAdminsView {...this.props} />)
        },
        {
            main: '用户',
            right: '增删用户',
            icon: iconFont('users'),
            onClick: () => nav.push(<UnitAdminsView {...this.props} />)
        },
        {
            main: '开发',
            right: 'api, app, server 等资源',
            icon: iconFont('laptop'),
            onClick: () => nav.push(<UnitAdminsView {...this.props} />)
        }
    ];
    constructor(props) {
        super(props);
        if (this.props.isOwner === 0) this.items.shift();
    }
    async componentDidMount() {
        await mainData.loadUnitAdmins(this.props.id);
    }

    converter(admin: UnitAdmin):ListItem {
        return {
            key: admin.id,
            date: undefined,
            main: admin.name,
            vice: admin.nick,
            icon : admin.icon || consts.appItemIcon,
            unread: 0,
            right: <aside>ddd</aside>
        };
    }
    render() {
        return <Page header={this.props.name + " - 管理小号"}>
            <ListView items={this.items} />
        </Page>;
    }
}
