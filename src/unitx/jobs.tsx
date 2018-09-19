import * as React from 'react';
import { VmView } from 'tonva-tools';
import {List, EasyDate, LMR, FA, Muted, PropGrid, Prop, Media, IconText} from 'tonva-react-form';
import {Templet, sysTemplets} from 'store';
import { CrUnitxUsq } from './crUnitxUsq';

/*
export interface JobsPageState {
    templets: Templet[];
}
*/

export class JobsPage extends VmView<CrUnitxUsq> { //} React.Component<{}, JobsPageState> {
    //protected coordinator: CrUnitxUsq;

    private onClick = () => {

    }
    private newJob = async () => {
        //let chat = store.unit.unitx;
        let msg = {
            type: 'a',
            content: 'bbbb',
            to: [{user:0}]
        };
        let id = await this.coordinator.newMessage(msg);
        //nav.pop();
        this.closePage();
    }

    private rows:Prop[] = [
        '',
        {
            type: 'component', 
            component: <IconText iconClass="text-info" icon="envelope" text="新任务" />,
            onClick: this.newJob
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
    /*
    constructor(props) {
        super(props);
        this.state = {
            templets: undefined,
        }
    }
    */
    /*
    async componentWillMount() {
        let templets = await store.unit.unitx.getTemplets();
        if (templets.length > 0) {
            this.setState({
                templets: templets
            });
        }
    }
    */
    private renderRow = (templet:Templet, index:number):JSX.Element => {
        let {icon, name, caption, discription} = templet;
        let left = <>
            <FA className="text-success mr-3" name={icon} size="lg" fixWidth={true} />
        </>;
        let right = <Muted>{discription}</Muted>;
        return <LMR className='px-3 py-2 align-items-center' left={left} right={right}>
            {caption}
        </LMR>;
    }
    private templetClick = (templet:Templet) => {
        //nav.push(<JobEdit templet={templet} />);
        this.coordinator.jobEdit(templet);
    }
    render() {
        //let {templets} = this.state;
        let {templets} = this.coordinator;
        return <div>
            <List className="py-2"
                items={sysTemplets} 
                item={{render:this.renderRow, onClick:this.templetClick}} />
            {
                templets && <List items={templets} 
                item={{render:this.renderRow, onClick:this.templetClick}} />}
        </div>;
    }
}