import * as React from 'react';
import * as className from 'classnames';
import * as _ from 'lodash';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {List, EasyDate, LMR, FA, TonvaForm, FormRow, Fields, SubmitResult} from 'tonva-react-form';
import {Page, nav} from 'tonva-tools';
import {Message} from '../model';
import {store} from '../store';
import mainApi from '../mainApi';
import {tagStyle, tagEndStyle} from './message';

abstract class Approved extends React.Component<Message&{pointer?:boolean}> {
    protected title:string;
    protected unitType:number;
    onClick() {
        if (this.props.pointer === false) return;
        nav.push(<UnitCreatePage title={this.title} unitType={this.unitType} {...this.props} />);
    }
    render() {
        let {fromUser, date, state} = this.props;
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
            <div onClick={()=>this.onClick()} className={className('px-3', py, 'my-1', 'mx-3', bg)} style={style}>
                <LMR left={<span>{this.title}</span>} right={right} />
                <div><small>申请时间: <EasyDate date={date} /></small></div>
            </div>
        </div>;
    }
}

export class ApprovedDev extends Approved {
    protected title = '创建开发号';
    protected unitType = 0;
}

export class ApprovedUnit extends ApprovedDev {
    protected title = '创建小号';
    protected unitType = 1;
}

class UnitCreatePage extends React.Component<{title:string, unitType:number}&Message> {
    private form:TonvaForm;
    private fields:Fields = {
        name: {name:'name', type:'string', maxLength:250, required:true },
    };
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }
    private async onProcessMessage(action:'approve'|'refuse') {
        await store.unit.messageAct(this.props.id, action);
        nav.pop();
    }
    private async onSubmit(values:any):Promise<SubmitResult> {
        //values.unitType = this.props.unitType;
        //alert(JSON.stringify(values));
        let unitId = await store.unitCreate(values.name, this.props.id);
        let error:string;
        switch (unitId) {
            default:
                nav.push(<UnitSuccessPage />);
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
    render() {
        let caption = this.props.unitType === 0? '开发号': '小号';
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
        let {title} = this.props;
        return <Page header={title}>
            <div className="m-4" />
            <TonvaForm ref={tv => this.form = tv} 
                className="m-3" 
                formRows={rows} 
                onSubmit={this.onSubmit} />
        </Page>
    }
}

class UnitSuccessPage extends React.Component {
    render() {
        return <Page>
            创建完成
        </Page>;
    }
}