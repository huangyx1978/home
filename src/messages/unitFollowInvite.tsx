import * as React from 'react';
import * as className from 'classnames';
import * as _ from 'lodash';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {List, EasyDate, LMR, FA} from 'tonva-react-form';
import {Page, nav} from 'tonva-tools';
import {Message} from 'model';
import {UnitSpan, UserSpan} from 'tools';
import {store} from 'store';
import {tagStyle, tagEndStyle} from './message';

export class UnitFollowInvite extends React.Component<{msg: Message}> {
    private title:string = '小号邀请';
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    onClick() {
        //if (this.props.pointer === false) return;
        let {msg} = this.props;
        let {state} = msg;
        if (state===1 || state===-1) return;
        nav.push(<MessagePage title={this.title} msg={msg} />);
    }
    render() {
        let {fromUser, date, state} = this.props.msg;
        let onClick;
        let bg, py, style;
        let right;
        if (state !== '0') {
            bg = 'bg-transparent';
            style = tagEndStyle;
            py = 'py-1';
            let name, color, text;
            if (state === 1) {
                name = 'check';
                color = 'text-success';
                text = '已批准';
            }
            else if (state === -1) {
                name = 'times';
                color = 'text-danger';
                text = '已拒绝';
            }
            right = <span className={color}>
                <FA name={name} />
                {text}
            </span>;
        }
        else {
            //bg = 'bg-white';
            style = _.assign({}, tagStyle);
            _.assign(style, {cursor: 'pointer'});
            //if (this.props.pointer !== false) _.assign(style, {cursor: 'pointer'});
            py = 'py-2';
        }
        return <div>
            <div onClick={()=>this.onClick()} className={className('px-3', py, 'my-1', 'mx-3', bg)} style={style}>
                <LMR left={<span>{this.title}</span>} right={right} />
                <div><small>申请人: <UserSpan id={fromUser} /></small></div>
                <div><small>时间: <EasyDate date={date} /></small></div>
            </div>
        </div>;
    }
}

class MessagePage extends React.Component<{title:string; msg:Message}> {
    private async onProcessMessage(action:'approve'|'refuse') {
        let {msg} = this.props;
        await store.unit.messageAct(msg.id, action);
        nav.pop();
    }
    render() {
        let {title, msg} = this.props;
        return <Page header="消息">
            <div className="m-4" />
            <UnitFollowInvite msg={msg} />
            <div className="mx-3 my-4">
                <Button
                    onClick={() => this.onProcessMessage('approve')}
                    color="success">
                    批准
                </Button>
                <Button
                    onClick={() => this.onProcessMessage('refuse')}
                    className="ml-3"
                    color="primary"
                    outline={true}>
                    拒绝
                </Button>
            </div>
        </Page>;
    }
}