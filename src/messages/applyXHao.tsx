import * as React from 'react';
import * as className from 'classnames';
import * as _ from 'lodash';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {List, EasyDate, LMR, FA} from 'tonva-react-form';
import {Page, nav} from 'tonva-tools';
import {Message} from '../model';
import {UnitSpan, UserSpan} from '../tools';
import {store} from '../store';
import {tagStyle, tagEndStyle} from './message';

abstract class ApplyItem extends React.Component<Message&{pointer?:boolean}> {
    protected title:string;
    onClick() {
        if (this.props.pointer === false) return;
        nav.push(<MessagePage title={this.title} {...this.props} />);
    }
    render() {
        let {fromUser, date, state} = this.props;
        let onClick;
        let bg, py, style;
        let right;
        if (state !== 0) {
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
            if (this.props.pointer !== false) _.assign(style, {cursor: 'pointer'});
            py = 'py-2';
        }
        return <div>
            <div onClick={()=>onClick()} className={className('px-3', py, 'my-1', 'mx-3', bg)} style={style}>
                <LMR left={<span>{this.title}</span>} right={right} />
                <div><small>申请人: <UserSpan id={fromUser} /></small></div>
                <div><small>时间: <EasyDate date={date} /></small></div>
            </div>
        </div>;
    }
}

export class ApplyDev extends ApplyItem {
    protected title:string = '申请开发权限';
}

export class ApplyUnit extends ApplyItem {
    protected title:string = '申请小号权限';
}

class MessagePage extends React.Component<{title:string}&Message> {
    private async onProcessMessage(action:'approve'|'refuse') {
        await store.unit.messageAct(this.props.id, action);
        nav.pop();
    }
    render() {
        return <Page header="消息">
            <div className="m-4" />
            <ApplyDev pointer={false} {...this.props} />
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
        </Page>
    }
}
