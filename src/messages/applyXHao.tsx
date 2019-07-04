import * as React from 'react';
import className from 'classnames';
import _ from 'lodash';
import {List, EasyDate, LMR, FA} from 'tonva';
import {Page, nav} from 'tonva';
import {Message} from './model';
import {UnitSpan, UserSpan} from '../tools';
import {tagStyle, tagEndStyle} from './message';

const ApplyItem = (msg:Message, title:string, onClick:(msg:Message)=>Promise<void>) => { //} extends View { //} React.Component<{msg: Message, noClick?:boolean}> {
    /*
    protected title:string;
    private onClick = () => {
        //if (this.props.pointer === false) return;
        let {msg} = this.props;
        let {state} = msg;
        if (state===1 || state===-1) return;
        nav.push(<MessagePage title={this.title} msg={msg} />);
    }*/
    //render() {
        //let {msg, noClick} = this.props;
        let {fromUser, date, state} = msg;
        //let onClick;
        let bg, py, style;
        let right;
        if (state !== 0) {
            bg = 'bg-light';
            style = tagEndStyle;
            py = 'py-1';
            let name, color, text;
            if (state === 1) {
                name = 'check';
                color = 'text-success';
                text = '已准';
            }
            else if (state === -1) {
                name = 'times';
                color = 'text-danger';
                text = '已拒';
            }
            right = <span className={className(color, 'small')}>
                <FA name={name} />&nbsp;{text}
            </span>;
        }
        else {
            //bg = 'bg-white';
            style = _.assign({}, tagStyle);
            _.assign(style, {cursor: 'pointer'});
            //if (this.props.pointer !== false) _.assign(style, {cursor: 'pointer'});
            //if (noClick !== true) onClick = this.onClick;
            py = 'py-2';
        }
        //style={style}
        return <LMR onClick={()=>onClick(msg)}
            className={className('px-3', py, bg)}
            right={right}>
            <div>{title}  &nbsp; <small className="text-muted"><EasyDate date={date} /></small></div>
            <div><small>申请人: <UserSpan id={fromUser} /></small></div>
        </LMR>;
    //}
}

export const ApplyDev = (msg:Message, onClick?:(msg:Message)=>Promise<void>) => {
    return ApplyItem(msg, '申请开发权限', onClick); //protected title:string = '申请开发权限';
}

export const ApplyUnit = (msg:Message, onClick?:(msg:Message)=>Promise<void>) => {
    //protected title:string = '申请小号权限';
    return ApplyItem(msg, '申请小号权限', onClick); //protected title:string = '申请开发权限';
}
/*
export class VmApplyPage extends VPage { //} React.Component<{title:string, msg:Message}> {
    private approve = async () => this.onProcessMessage('approve');
    private refuse = async () => this.onProcessMessage('refuse');
    private async onProcessMessage(action:'approve'|'refuse') {
        let {msg} = this.props;
        await store.unit.messageAct(msg.id, action);
        nav.pop();
    }
    render() {
        let {msg} = this.props;
        return <Page header="处理申请">
            <div className="my-3 mx-2">
                <div className="bg-white">
                    {ApplyDev(msg, undefined)}
                </div>
                <div className="m-3">
                    <button className="btn btn-success" onClick={this.approve}>批准</button>
                    <button onClick={this.refuse} className="btn btn-outline-primary ml-3">拒绝</button>
                </div>
            </div>
        </Page>
    }
}
*/
