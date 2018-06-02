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

export interface JobEditProps {
    templet: Templet;
}

export class JobEdit extends React.Component<JobEditProps> {
    private tosControl:TosControl;    
    private rowTo = {
        label: '接收人', 
        //field: {name:'to', type: 'string', required: true},
        //face: {type: 'string', placeholder: '一个或多个接收人'}
        createControl: (form:FormView, row: FormRow) => {return this.tosControl = new TosControl(form);}
    };
    private rowSubject:FormRow = {
        label: '主题', 
        field: {name:'subject', type: 'string', maxLength: 100, required: true},
        face: {type: 'string', placeholder: '简明扼要'}
    };
    private rowContent:FormRow = {
        label: '描述', 
        field: {name:'discription'}, 
        face: {type: 'textarea', placeholder: '详细描述，可以不填', rows: 5}
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
        this.rows.push(this.rowSubject, this.rowContent);
    }

    private async onSubmit(values:any):Promise<SubmitResult> {
        if (await this.tosControl.confirmInput()===false) return;
        let {templet} = this.props;
        let chat = store.unit.chat;
        let type:string = templet.name;
        let to:{user:number}[];
        let subject = values.subject;
        let discription = values.discription;
        switch (type) {
            case '$self':
                to = [{user:0}];
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
    private validTos():{user:number}[] {
        let {toList} = this.tosControl;
        if (toList === undefined || toList.length === 0) {
            this.tosControl.setError('to', '请输入接收人');
            return;
        }
        return toList.map(v => {return {user: v.id}});
}
    render() {
        return <Page header={this.props.templet.caption}>
            <TonvaForm className="px-3 py-2"
                formRows={this.rows} 
                onSubmit={this.onSubmit} />
        </Page>;
    }
}

export class TosControl extends ControlBase {
    private ti:TosInput;
    constructor(formView:FormView) {
        super(formView);
    }
    get toList() {return this.ti.list;}
    setError(fieldName:string, error:string) {
        this.ti.setError(error);
    }
    async confirmInput():Promise<boolean> {
        return await this.ti.confirmInput();
    }
    renderControl():JSX.Element {
        return <div className="form-control-plaintext">
            <TosInput ref={ti=>this.ti=ti} />
        </div>;
    }
}

interface User {
    id: number;
    name: string;
    nick: string;
    assigned: string;
    icon: string;
}
interface TosInputState {
    tos: User[];
    error: string;
}
class TosInput extends React.Component<{}, TosInputState> {
    private input: HTMLInputElement;
    constructor(props) {
        super(props);
        this.keyPress = this.keyPress.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.state = {
            tos: this.list,
            error: undefined,
        }
    }
    setError(error:string) {
        this.setState({error:error});
    }
    async confirmInput():Promise<boolean> {
        let inputName = this.input.value.trim();
        if (inputName.length === 0) return true;
        let members = await mainApi.membersFromName({unit: store.unit.id, name: inputName});
        if (members.length === 0) {
            this.input.style.color = 'red';
            this.setState({error: '无法发送此接收人'});
            return false;
        }
        for (let m of members) {
        let {id, name, nick, assigned, icon} = m;
            this.list.push({
                id: id,
                name: name,
                nick: nick,
                assigned: assigned,
                icon: icon,
            });
        }
        this.input.value = '';
        this.setState({tos: this.list});
        return true;
    }
    private onFocus() {
        this.setState({error:undefined});
    }
    private async keyPress(evt:React.KeyboardEvent<any>) {
        this.input.style.color = '';
        switch (evt.key) {
            default: return;
            case 'Enter':
            case ';':
            case ',':
                break;
        }
        evt.preventDefault();
        this.confirmInput();
    }
    list: User[] = [];
    render() {
        let {tos, error} = this.state;
        return <>
            <div style={{display:'flex', flexFlow: 'row', flexWrap: 'wrap'}}>
                {tos && tos.map(v => <div key={v.id}>{v.name} - {v.nick} - {v.assigned}</div>)}
            </div>
            <input className="w-100" 
                ref={input=>this.input=input} 
                type="text" onKeyPress={this.keyPress}
                onFocus={this.onFocus} />
            <div style={{color:'red', fontSize:'smaller', marginTop:'0.2em'}}>{error}</div>
        </>;
    }
}