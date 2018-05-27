var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import { observer } from 'mobx-react';
import { List } from 'tonva-react-form';
import { Page } from 'tonva-tools';
import { store } from '../store';
import { ApplyDev, ApplyUnit, ApprovedDev, ApprovedUnit, UnitFollowInvite } from '../messages';
const typeMessageMap = {
    "apply-unit": ApplyUnit,
    "apply-dev": ApplyDev,
    "approve-unit": ApprovedUnit,
    "approve-dev": ApprovedDev,
    "unit-follow-invite": UnitFollowInvite,
};
let Chat = class Chat extends React.Component {
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
    renderMessage(msg, index) {
        //let Tag, title, onClick;
        let Tag = typeMessageMap[msg.type];
        if (Tag === undefined)
            return React.createElement("div", null, JSON.stringify(msg));
        return React.createElement(Tag, { msg: msg });
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
        return React.createElement(Page, { header: store.unit.name },
            React.createElement(List, { className: "my-1", items: store.unit.messages.items, item: { className: 'bg-transparent', render: this.renderMessage } }));
    }
};
Chat = __decorate([
    observer
], Chat);
export { Chat };
//# sourceMappingURL=chat.js.map