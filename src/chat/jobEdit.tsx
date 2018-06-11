import * as React from 'react';
import * as className from 'classnames';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {TonvaForm, FormRow, EasyDate, LMR, FA, Muted, PropGrid, Prop, Media, IconText, 
    SubmitResult, ControlBase, FormView} from 'tonva-react-form';
import {Page, nav} from 'tonva-tools';
import consts from '../consts';
import {store, Templet} from '../store';
import {default as mainApi} from '../mainApi';
import {TosControl} from './tosControl';

export interface JobEditProps {
    templet: Templet;
}

export class JobEdit extends React.Component<JobEditProps> {
    private tosControl:TosControl;    
    private rowTo = {
        label: '接收人', 
        //field: {name:'to', type: 'string', required: true},
        //face: {type: 'string', placeholder: '一个或多个接收人'}
        createControl: (form:FormView, row: FormRow) => {
            return this.tosControl = new TosControl(form);
        }
    };
    private rowSubject:FormRow = {
        label: '主题', 
        field: {name:'subject', type: 'string', maxLength: 60},
        face: {type: 'string', placeholder: '简明扼要'}
    };
    private rowContent:FormRow = {
        label: '任务描述', 
        field: {name:'discription', maxLength: 200, required: true},
        face: {type: 'textarea', placeholder: '简要说明任务', rows: 6}
    };
    private rows:FormRow[];
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        let {templet} = this.props;
        let {content} = templet;
        let {needTo} = content;
        this.rows = [];
        if (needTo === true) this.rows.push(this.rowTo);
        //this.rows.push(this.rowSubject);
        this.rows.push(this.rowContent);
    }

    private async onSubmit(values:any):Promise<SubmitResult> {
        if (this.tosControl !== undefined) {
            if (await this.tosControl.confirmInput()===false) return;
        }
        let {templet} = this.props;
        let chat = store.unit.chat;
        let type:string = templet.name;
        let to:{toUser:number}[];
        let subject = values.subject;
        let discription = values.discription;
        switch (type) {
            case '$self':
                to = [{toUser:0}];
                break;
            case '$dispatch':
                to = this.validTos();
                if (to === undefined) return;
                break;
        }
        let msg = {
            type: type,
            subject: subject,
            discription: discription,
            to: to,
        };
        let id = await chat.newMessage(msg);
        nav.pop();
        return;
    }
    private validTos():{toUser:number}[] {
        let {toList} = this.tosControl;
        if (toList === undefined || toList.length === 0) {
            this.tosControl.setError('to', '请输入接收人');
            return;
        }
        return toList.map(v => {return {toUser: v.id}});
    }
    render() {
        return <Page header={this.props.templet.caption}>
            <TonvaForm className="px-3 py-2"
                formRows={this.rows} 
                onSubmit={this.onSubmit} />
        </Page>;
    }
}
