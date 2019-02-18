import * as React from 'react';
import {Media, PropGrid, Prop, FA, IconText, TonvaForm, FormRow, SubmitResult, Fields, List, LMR, Image} from 'tonva-react-form';
import {nav, User, Page, VPage} from 'tonva-tools';
import consts from 'consts';
import mainApi from 'mainApi';
import { VAbout } from './vAbout';
import { CHome } from './cHome';
import { Unit } from './unit';

const applyUnit = "创建小号";
const applyDev = "创建开发号";

export class VMe extends VPage<CHome> {
    async open() {
        this.openPage(this.page);
    }

    private exit = () => {
        this.openPage(this.confirmLogout);
    }

    private confirmLogout = () => {
        return <Page header="安全退出" back="close">
            <div className="m-5 border border-info bg-white rounded p-3 text-center">
                <div>退出当前账号不会删除任何历史数据，下次登录依然可以使用本账号</div>
                <div className="mt-3">
                    <button className="btn btn-danger" onClick={()=>this.controller.logout()}>退出</button>
                </div>
            </div>
        </Page>;
    }

    private about = () => {
        this.openVPage(VAbout);
    }

    private apply = () => {
        let {allowDev, sumDev, allowUnit, sumUnit} = this.controller.grant;
        let rows:Prop[] = [];
        if (allowDev > sumDev) {
            rows.push(
                '',
                {
                    type: 'component', 
                    component: <IconText iconClass="text-info mr-2" icon="laptop" text={applyUnit} />,
                    onClick: this.applyUnit
                },
            );
        }
        if (allowUnit > sumUnit) {
            rows.push(
                '=',
                {
                    type: 'component', 
                    component: <IconText iconClass="text-info mr-2" icon="desktop" text={applyDev} />,
                    onClick: this.applyDev
                },
            );
        }
        nav.push(<Page header="创建">
            <PropGrid rows={rows} values={{}} />
        </Page>);
    }
    private applyUnit = () => {
        this.showApplyPage('unit');
    }
    private applyDev = () => {
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
    private onApplySubmit = async (type:'unit'|'dev', values:any):Promise<SubmitResult> => {
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

    private renderAdminUnit = (unit:Unit, index:number):JSX.Element => {
        let {name, icon, isAdmin, isOwner, isDev, isHao} = unit;
        let right:any, unitType:any;
        let roles:string[] = [];
        if (isOwner) roles.push('所有者');
        if (isAdmin) roles.push('管理员');
        if (roles.length > 0) right = <small className="text-muted">{roles.join(', ')}</small>;

        let types: string[] = [];
        if (isHao === true) types.push('小号');
        if (isDev === true) types.push('开发号');
        if (types.length > 0) unitType = <> &nbsp; <small className="text-muted">{types.join(', ')}</small></>;

        return <LMR className="py-2" right={right}>
            <Image className="w-1-5c mr-2" src={icon} />{name}{unitType}
        </LMR>
    }

    private clickAdminUnit = (unit:Unit) => {
        this.controller.navToAdmin(unit);
    }

    page = () => {
        const {user} = nav;
        let rows:Prop[] = [
            '',
            {
                type: 'component', 
                component: <Media icon={consts.appIcon} main={user.name} discription={String(user.id)} />
            },
        ];
        if (this.controller.adminUnits.length > 0) {
            rows.push('');
            rows.push({
                type: 'component', 
                component: <List className="w-100" items={this.controller.adminUnits} 
                    item={{render:this.renderAdminUnit, onClick:this.clickAdminUnit}} />
            });
        }

        let {allowDev, sumDev, allowUnit, sumUnit} = this.controller.grant;
        if (allowDev > sumDev || allowUnit > sumUnit) {
            rows.push(
                '',
                {
                    type: 'component', 
                    component: <IconText iconClass="text-info mr-2" icon="envelope-o" text="创建" />,
                    onClick: this.apply
                },
            );
        }

        rows.push(
            '',
            {
                type: 'component', 
                component: <IconText iconClass="text-info mr-2" icon="key" text="修改密码" />,
                onClick: this.changePassword
            },
            {
                type: 'component', 
                component: <IconText iconClass="text-info mr-2" icon="smile-o" text="关于同花" />,
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
            }
        );
        return <Page header="我">
            <PropGrid rows={rows} values={{}} />
        </Page>;
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
        let ret = await mainApi.resetPassword({orgPassword: orgPassword, newPassword:newPassword});
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
