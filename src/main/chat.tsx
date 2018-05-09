import * as React from 'react';
import * as className from 'classnames';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {List, EasyDate, LMR, FA} from 'tonva-react-form';
import {Page, nav} from 'tonva-tools';
import {store} from '../store';
import {Message} from '../model';
import {UnitSpan, UserSpan} from '../tools';
import {ApplyDev, ApplyUnit, ApprovedDev, ApprovedUnit, UnitFollowInvite} from '../messages';

const typeMessageMap:{[type:string]: new (props:{msg:Message}) => React.Component<{msg:Message}>} = {
    "apply-unit": ApplyUnit,
    "apply-dev": ApplyDev,
    "approve-unit": ApprovedUnit,
    "approve-dev": ApprovedDev,
    "unit-follow-invite": UnitFollowInvite,
};

@observer
export class Chat extends React.Component {
    constructor(props) {
        super(props);
        /*
        this.onDevClick = this.onDevClick.bind(this);
        this.onUnitClick = this.onUnitClick.bind(this);
        this.onCreateDevClick = this.onCreateDevClick.bind(this);
        this.onCreateUnitClick = this.onCreateUnitClick.bind(this);
        */
        this.renderMessage = this.renderMessage.bind(this);
    }
    componentWillMount() {
        store.unit.loadMessages();
    }
    /*
    private onDevClick(title:string, msg:Message) {
        nav.push(<MessagePage title={title} {...msg} />);
    }
    private onUnitClick(title:string, msg:Message) {
        nav.push(<MessagePage title={title} {...msg} />);
    }
    private onCreateDevClick(title:string, msg:Message) {
        nav.push(<MessagePage title={title} {...msg} />);
    }
    private onCreateUnitClick(title:string, msg:Message) {
        nav.push(<MessagePage title={title} {...msg} />);
    }*/
    private renderMessage(msg:Message, index:number):JSX.Element {
        //let Tag, title, onClick;
        let Tag = typeMessageMap[msg.type];
        if (Tag === undefined)
            return <div>{JSON.stringify(msg)}</div>;

        return <Tag msg={msg} />;
        /*
        switch (msg.type) {
            default: return <div>{JSON.stringify(msg)}</div>;
            case 'apply-dev':
                Tag = ApplyDev;
                title = '申请开发权限';
                onClick = this.onDevClick;
                break;
            case 'apply-unit':
                Tag = ApplyDev;
                title = '申请小号权限';
                onClick = this.onUnitClick;
                break;
            case 'approve-dev':
                Tag = ApprovedDev;
                title = '创建开发小号';
                onClick = this.onCreateDevClick;
                break;
            case 'approve-unit':
                Tag = ApprovedUnit;
                title = '创建小号';
                onClick = this.onCreateUnitClick;
                break;
        }*/
        //let oc;
        //if (msg.state === 0) oc = ()=>onClick(title, msg);
        //return <Tag title={title} onClick={oc} {...msg} />;
    }
    render() {
        return <Page header={store.unit.name}>
            <List className="my-1"
                items={store.unit.messages.items} 
                item={{className: 'bg-transparent', render:this.renderMessage}} />
        </Page>;
    }
}
