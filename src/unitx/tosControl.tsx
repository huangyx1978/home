import * as React from 'react';
import * as className from 'classnames';
import {TonvaForm, FormRow, EasyDate, LMR, FA, Muted, PropGrid, Prop, Media, IconText, 
    SubmitResult, ControlBase, FormView} from 'tonva-react-form';
import {store, Templet} from 'store';
import {default as mainApi} from 'mainApi';

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
        //form-control-plaintext
        return <div className="">
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
const toStyle = {
    borderRadius:'0.7em', 
    border:'1px solid lightgray', 
    background:'#f8f8f8', 
    padding:'0.1em 0.3em 0.1em 0.8em', 
    marginRight:'0.3em'};
class TosInput extends React.Component<{}, TosInputState> {
    private input: HTMLInputElement;
    constructor(props) {
        super(props);
        this.keyPress = this.keyPress.bind(this);
        this.keyDown = this.keyDown.bind(this);
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
            if (this.list.findIndex(v => v.id === id) >= 0) continue;
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
        this.setState({error:undefined});
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
    private keyDown(evt:React.KeyboardEvent<any>) {
        this.setState({error:undefined});
    }
    private removeTo(user:User) {
        let index = this.list.findIndex(v => v.id === user.id);
        if (index < 0) return;
        this.list.splice(index, 1);
        this.setState({tos: this.list});
    }
    list: User[] = [];
    render() {
        let {tos, error} = this.state;
        let holder = tos.length === 0?
            '' : '';
        
        let tosDiv;
        if (tos !== undefined && tos.length > 0) {
            tosDiv = <div className="form-control-plaintext"
                style={{display:'flex', flexFlow: 'row', flexWrap: 'wrap'}}>
                {tos.map(v => {
                    let {id, name, nick, assigned} = v;
                    let text:string;
                    if (assigned !== undefined) text = assigned + '(' + name + ')';
                    else if (nick !== undefined) text = nick + '(' + name + ')';
                    else text = name;
                    return <div key={id} style={toStyle}>
                        {text} &nbsp;
                        <button type="button" className="close" aria-label="Close" 
                            onClick={()=>this.removeTo(v)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                })}
            </div>;
        }
        return <>
            {tosDiv}
            <input className="w-100 form-control" 
                ref={input=>this.input=input} 
                type="text" onKeyPress={this.keyPress} onKeyDown={this.keyDown}
                onFocus={this.onFocus}
                placeholder={holder} />
            <div style={{color:'red', fontSize:'smaller', marginTop:'0.2em'}}>
                {error}
            </div>
        </>;
    }
}
