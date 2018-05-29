import * as React from 'react';
import * as className from 'classnames';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {List, EasyDate, LMR, FA, Muted, PropGrid, Prop, Media, IconText} from 'tonva-react-form';
import {Page, nav} from 'tonva-tools';
import {Message} from '../model';

export interface JobActionPageProps {
    msg:Message
}

export class JobActionPage extends React.Component<JobActionPageProps> {
    private onClick() {

    }
    render() {
        return <Page header="处理任务">
            {JSON.stringify(this.props.msg)}
        </Page>;
    }
}