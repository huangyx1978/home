import * as React from 'react';
import * as className from 'classnames';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {List, EasyDate, LMR, FA, Muted, PropGrid, Prop, Media, IconText} from 'tonva-react-form';
import {Page, nav} from 'tonva-tools';
import {store, Templet, sysTemplets} from '../store';

export class Folders extends React.Component {
    private rows:Prop[] = [
        '',
        {
            type: 'component', 
            component: <IconText iconClass="text-info" icon="envelope" text="我发出任务" />,
            onClick: this.sendBox
        },
        {
            type: 'component', 
            component: <IconText iconClass="text-info" icon="envelope" text="我经手任务" />,
            onClick: this.doBox
        },
        '',
        {
            type: 'component', 
            component: <IconText iconClass="text-info" icon="envelope" text="已完成归档" />,
            onClick: this.archiveBox
        },
    ];

    private sendBox() {
        nav.push(<SendBox />);
    }

    private doBox() {
        nav.push(<DoBox />);
    }
    
    private allBox() {
        nav.push(<AllBox />);
    }

    private archiveBox() {
        nav.push(<ArchiveBox />);
    }

    render() {
        return <div>
            <PropGrid rows={this.rows} values={{}} />
        </div>;
    }
}

class SendBox extends React.Component {
    render() {
        return <Page header="我发出任务">
            正在开发中...
        </Page>;
    }
}

class DoBox extends React.Component {
    render() {
        return <Page header="我经手任务">
            正在开发中...
        </Page>;
    }
}

class AllBox extends React.Component {
    render() {
        return <Page header="全部任务">
            正在开发中...
        </Page>;
    }
}

class ArchiveBox extends React.Component {
    render() {
        return <Page header="完成归档">
            正在开发中...
        </Page>;
    }
}
