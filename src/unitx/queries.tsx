import * as React from 'react';
import {PropGrid, Prop, IconText} from 'tonva-react-form';
import {Page} from 'tonva-tools';
import { VmView } from 'tonva-react-usql';
import { CrUnitxUsq } from './crUnitxUsq';

export class Queries extends VmView {
    protected coordinator: CrUnitxUsq;

    private rows:Prop[] = [
        '',
        {
            type: 'component', 
            component: <IconText iconClass="text-primary" icon="building" text="项目" />,
            onClick: () => this.openPageElement(<Projects />),
        },
        {
            type: 'component', 
            component: <IconText iconClass="text-primary" icon="archive" text="办事人" />,
            onClick: () => this.openPageElement(<Persons />),
        },
    ];
    render() {
        return <>
            <PropGrid rows={this.rows} values={{}} />
            {this.coordinator.myFolders()}
            {this.coordinator.wholeFolders()}
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