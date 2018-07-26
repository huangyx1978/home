import * as React from 'react';
import {List, EasyDate, LMR, FA, Muted, PropGrid, Prop, Media, IconText} from 'tonva-react-form';
import {Page, nav} from 'tonva-tools';
import {MyFolders, WholeFolders} from './folders';

export class Queries extends React.Component {
    private rows:Prop[] = [
        '',
        {
            type: 'component', 
            component: <IconText iconClass="text-primary" icon="building" text="项目" />,
            onClick: this.projects
        },
        {
            type: 'component', 
            component: <IconText iconClass="text-primary" icon="archive" text="办事人" />,
            onClick: this.persons
        },
    ];
    private projects() {
        nav.push(<Projects />);
    }
    private persons() {
        nav.push(<Persons />);
    }
    render() {
        return <>
            <PropGrid rows={this.rows} values={{}} />
            <MyFolders />
            <WholeFolders />
        </>;
    }
}

class Projects extends React.Component {
    render() {
        return <Page header="项目">
            <div className="m-3">
                按项目查看任务进展情况
            </div>
        </Page>
    }
}

class Persons extends React.Component {
    render() {
        return <Page header="办事人">
            <div className="m-3">
                按办事人查看任务进展情况
            </div>
        </Page>
    }
}