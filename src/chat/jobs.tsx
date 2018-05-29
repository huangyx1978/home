import * as React from 'react';
import * as className from 'classnames';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {List, EasyDate, LMR, FA, Muted, PropGrid, Prop, Media, IconText} from 'tonva-react-form';
import {Page, nav} from 'tonva-tools';
import consts from '../consts';

export class JobsPage extends React.Component {
    private rows:Prop[] = [
        '',
        {
            type: 'component', 
            component: <IconText iconClass="text-info" icon="envelope" text="啥任务，不知道" />,
            //onClick: this.apply
        },
        '',
        {
            type: 'component', 
            component: <IconText iconClass="text-info" icon="envelope" text="得想想，怎么做" />,
            //onClick: this.about
        },
        '',
        /*
        '',
        {
            type: 'component', 
            bk: '', 
            component: <button className="btn btn-danger w-100" onClick={this.onClick}>
                <FA name="sign-out" size="lg" /> 退出登录
            </button>
        },*/
    ];
    private onClick() {

    }
    render() {
        return <Page header="发任务">
            <PropGrid rows={this.rows} values={{}} />
        </Page>;
    }
}