/*
import React from 'react';
import className from 'classnames';
import _ from 'lodash';
import {List, EasyDate, LMR, FA, TonvaForm, FormRow, Fields, SubmitResult} from 'tonva-react-form';
import {Page, nav, VPage} from 'tonva-tools';
import {Message} from './model';
import {store} from 'store';
import {tagStyle, tagEndStyle} from './message';
*/
//import { CMessages } from './cMessages';

/*
const Approved = (
    msg:Message, unitType:number, title:string,
    onClick:(msg:Message, unitType:number, title:string)=>Promise<void>) => 
    { // {
    //protected title:string;
    //protected unitType:number;
    /*
    onClick() {
        let {msg, pointer} = this.props;
        if (pointer === false) return;
        nav.push(<UnitCreatePage title={this.title} unitType={this.unitType} msg={msg} />);
    }
    render() {
        let {fromUser, date, state} = msg;
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
            //style = _.assign({}, tagStyle);
            //if (this.props.pointer !== false) _.assign(style, {cursor: 'pointer'});
            py = 'py-2';
        }
        //style={style}
        return <LMR 
            onClick={()=>onClick(msg, unitType, title)}
            className={className('px-3', py, bg)}
            right={right}>
            <div>{title}</div>
            <div><small>申请时间: <EasyDate date={date} /></small></div>
        </LMR>
    //}
}

export const ApprovedDev = (msg:Message, onClick:(msg:Message, unitType:number, title:string)=>Promise<void>) => {
    let title = '创建开发号';
    let unitType = 0;
    return Approved(msg, unitType, title, onClick);
}

export const ApprovedUnit = (msg:Message, onClick:(msg:Message, unitType:number, title:string)=>Promise<void>) => {
    let title = '创建小号';
    let unitType = 1;
    return Approved(msg, unitType, title, onClick);
}

export class UnitCreatePage extends VPage<CMessages> { // React.Component<{title:string, unitType:number, msg:Message}> {
    //protected controller: CrMessages;
    private title:string;
    private unitType:number;
    private msg:Message;
    private form:TonvaForm;
    private fields:Fields = {
        name: {name:'name', type:'string', maxLength:250, required:true },
    };

    async open({title, unitType, msg}:{title:string, unitType:number, msg:Message}) {
        this.title = title;
        this.unitType = unitType;
        this.msg = msg;
        this.openPage(this.view);
    }

    private async onProcessMessage(action:'approve'|'refuse') {
        let {id} = this.msg;
        await store.unit.messageAct(id, action);
        nav.pop();
    }
    private onSubmit = async (values:any):Promise<SubmitResult> => {
        let {id} = this.msg;
        let unitId = await this.controller.unitCreate(values.name, id);
        let error:string;
        switch (unitId) {
            default:
                this.closePage();
                this.openPageElement(<Page>
                    <div className="p-3 text-success"><FA name="check" /> 创建完成</div>
                </Page>);
                return;
            case 0:
                error = '名字已经被使用了';
                break;
            case -1:
            case -2:
                error = '错误编号: ' + unitId;
                break;
        }
        this.form.formView.setError('name', error);
        return;
    }
    private view = () => {
        let caption = this.unitType === 0? '开发号': '小号';
        let rows:FormRow[] = [
            {
                label: caption, 
                field: this.fields.name, 
                face: {
                    type: 'string', 
                    placeholder: '唯一名', 
                    notes: caption + '唯一的身份名，一旦确定，不可能更改',
                }
            },
        ];
        return <Page header={this.title}>
            <div className="m-4" />
            <TonvaForm ref={tv => this.form = tv} 
                className="m-3" 
                formRows={rows} 
                onSubmit={this.onSubmit} />
        </Page>
    }
}
*/