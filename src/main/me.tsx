import * as React from 'react';
import {Media, PropGrid, Prop, FA, IconText, TonvaForm, FormRow, SubmitResult, Fields} from 'tonva-react-form';
import {nav, User, Page} from 'tonva-tools';
import {store} from 'store';
import consts from 'consts';
import mainApi from 'mainApi';
import {About} from './about';

const applyUnit = "申请创建小号";
const applyDev = "申请开发应用";

class Me extends React.Component {
    constructor(props) {
        super(props);
        this.exit = this.exit.bind(this);
        this.about = this.about.bind(this);
        this.apply = this.apply.bind(this);
        this.applyUnit = this.applyUnit.bind(this);
        this.applyDev = this.applyDev.bind(this);
        this.onApplySubmit = this.onApplySubmit.bind(this);
    }
    private exit() {
        if (confirm('退出当前账号不会删除任何历史数据，下次登录依然可以使用本账号')) {
            nav.logout();
            store.logout();
            //nav.show(views.login);
            //nav.show(<LoginView />);
        }
    }
    private about() {
        let right = <button className='btn btn-success btn-sm' onClick={this.showLogs}>log</button>;
        nav.push(<Page header="关于同花" right={right}>
            <About />
        </Page>);
    }
    
    private showLogs() {
        nav.push(<Page header="Logs">
            {nav.logs.map((v,i) => {
                return <div key={i} className="px-3 py-1">{v}</div>;
            })}
        </Page>);
    }
    
    private apply() {
        let rows:Prop[] = [
            '',
            {
                type: 'component', 
                component: <IconText iconClass="text-info" icon="envelope" text={applyUnit} />,
                onClick: this.applyUnit
            },
            '=',
            {
                type: 'component', 
                component: <IconText iconClass="text-info" icon="envelope-o" text={applyDev} />,
                onClick: this.applyDev
            },
        ];
        nav.push(<Page header="申请">
            <PropGrid rows={rows} values={{}} />
        </Page>);
    }
    private applyUnit() {
        this.showApplyPage('unit');
    }
    private applyDev() {
        this.showApplyPage('dev');
    }
    private showApplyPage(type:'unit'|'dev') {
        let fields:Fields = {
            name: {name:'name', type:'string', maxLength:50, required:true },
            phone: {name:'phone', type:'string', maxLength:20 },
            owner: {name:'owner', type:'string', maxLength:100 },
        };
        let rows:FormRow[] = [
            {label: '申请人', field: fields.name, face: {type: 'string', placeholder: '真实姓名'}},
            {label: '电话', field: fields.phone},
            {label: '单位', field: fields.owner, face: {type: 'textarea', placeholder: '申请单位'}},
        ];
        nav.push(<Page header={type==='unit'? applyUnit: applyDev}>
            <TonvaForm 
                className="m-3" 
                formRows={rows} onSubmit={(values:any) => this.onApplySubmit(type, values)} />
        </Page>);
    }
    private async onApplySubmit(type:'unit'|'dev', values:any):Promise<SubmitResult> {
        let ret = await mainApi.saveMessage({
            toUser: -1,
            fromApp: 0,
            type: 'apply-' + type,
            content: values,
        });
        nav.pop(2);
        nav.push(<Page header="完成" back="close">
            <div className="card">
                <div className="card-body">
                    <div className="card-title">申请已发送</div>
                    <div className="card-text">请稍等，我们会尽快处理。</div>
                    <button className='btn btn-primary' onClick={()=>nav.back()}>完成</button>
                </div>
            </div>
        </Page>);
        return;
    }
    private changePassword = () => {
        nav.push(<ChangePasswordPage />);
    }
    render() {
        const {user} = nav;
        let rows:Prop[] = [
            '',
            {
                type: 'component', 
                component: <Media icon={consts.appIcon} main={user.name} discription={String(user.id)} />
            },
            '',
            {
                type: 'component', 
                component: <IconText iconClass="text-info" icon="envelope" text="申请" />,
                onClick: this.apply
            },
            '',
            {
                type: 'component', 
                component: <IconText iconClass="text-info" icon="envelope" text="修改密码" />,
                onClick: this.changePassword
            },
            '',
            {
                type: 'component', 
                component: <IconText iconClass="text-info" icon="envelope" text="关于同花" />,
                onClick: this.about
            },
            '',
            '',
            {
                type: 'component', 
                bk: '', 
                component: <button className="btn btn-danger w-100" onClick={this.exit}>
                    <FA name="sign-out" size="lg" /> 退出登录
                </button>
            },
        ];
        return <PropGrid rows={rows} values={{}} />;
    }
}

class ChangePasswordPage extends React.Component {
    private form: TonvaForm;
    private onSubmit = async (values:any):Promise<SubmitResult> => {
        let {formView} = this.form;
        let {orgPassword, newPassword, newPassword1} = values;
        if (newPassword !== newPassword1) {
            formView.setError('newPassword1', '新密码错误，请重新输入');
            return;
        }
        let ret = await mainApi.changePassword({orgPassword: orgPassword, newPassword:newPassword});
        if (ret === false) {
            formView.setError('orgPassword', '原密码错误');
            return;
        }
        nav.replace(<Page header="修改密码" back="close">
            <div className="m-3  text-success">
                密码修改成功！
            </div>
        </Page>);
        return;
    }
    render() {
        let rows = [
            {
                label: '原密码', 
                field: {name:'orgPassword', type: 'string', maxLength: 60, required: true},
                face: {type: 'password', placeholder: '输入原来的密码'}
            },
            {
                label: '新密码', 
                field: {name:'newPassword', type: 'string', maxLength: 60, required: true},
                face: {type: 'password', placeholder: '输入新设的密码'}
            },
            {
                label: '确认密码', 
                field: {name:'newPassword1', type: 'string', maxLength: 60, required: true},
                face: {type: 'password', placeholder: '再次输入新设密码'}
            },
        ];
        return <Page header="修改密码">
            <TonvaForm 
                ref={tf => this.form = tf}
                className="m-3" 
                formRows={rows} 
                onSubmit={this.onSubmit} />
        </Page>;
    }
}

export default Me;
