import * as React from 'react';
import * as className from 'classnames';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {List, EasyDate, LMR, FA} from 'tonva-react-form';
import {Page, nav} from 'tonva-tools';
import {Entities} from 'tonva-react-usql-entities';
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

export interface ChatProps {
    entities: Entities;
}

@observer
export class Chat extends React.Component<ChatProps> {
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
    async componentWillMount() {
        //let ret = await store.unit.getChatApi();
        await store.unit.loadMessages();
    }
    private renderMessage(msg:Message, index:number):JSX.Element {
        let Tag = typeMessageMap[msg.type];
        if (Tag === undefined)
            return <div>{JSON.stringify(msg)}</div>;
        return <Tag msg={msg} />;
    }
    render() {
        return <Page header={store.unit.name}>
            <List className="my-1"
                items={store.unit.messages.items} 
                item={{className: 'bg-transparent', render:this.renderMessage}} />
        </Page>;
    }
}
