import * as React from 'react';
import {Card, CardHeader, CardBody, CardText, CardTitle, Button,
    Container, Row, Col} from 'reactstrap';
import {Media, PropGrid, Prop, FA, IconText, TonvaForm, FormRow, SubmitResult, Fields} from 'tonva-react-form';
import {nav, User, Page} from 'tonva-tools';
import {store} from '../store';
import consts from '../consts';
import mainApi from '../mainApi';

class Me extends React.Component {
    constructor(props) {
        super(props);
        this.exit = this.exit.bind(this);
        this.apply = this.apply.bind(this);
        this.applyUnit = this.applyUnit.bind(this);
        this.applyDev = this.applyDev.bind(this);
    }
    private exit() {
        if (confirm('退出当前账号不会删除任何历史数据，下次登录依然可以使用本账号')) {
            nav.logout();
            store.logout();
            //nav.show(views.login);
            //nav.show(<LoginView />);
        }
    }
    private apply() {
        let rows:Prop[] = [
            '',
            {
                type: 'component', 
                component: <IconText iconClass="text-info" icon="envelope" text="申请创建小号" />,
                onClick: this.applyUnit
            },
            '=',
            {
                type: 'component', 
                component: <IconText iconClass="text-info" icon="envelope-o" text="申请开发应用" />,
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
        nav.push(<Page header={type==='unit'?'申请创建小号':'申请开发应用'}>
            <TonvaForm formRows={rows} onSubmit={this.onApplySubmit} />
        </Page>);
    }
    private async onApplySubmit(values:any):Promise<SubmitResult> {
        let ret = await mainApi.sendMessage({
            to:undefined,
            unit: 0,
            app: 0,
            type: 'apply-unit',
            message: values,
            norepeat: true
        });
        nav.pop(2);
        nav.push(<Page header="完成" close={true}>
            <Card>
                <CardBody>
                    <CardTitle>申请已发送</CardTitle>
                    <CardText>请稍等，我们会尽快处理。</CardText>
                    <Button color='primary' onClick={()=>nav.back()}>完成</Button>
                </CardBody>
            </Card>
        </Page>);
        return;
    }
    render() {
        const {user} = nav;
        let rows:Prop[] = [
            '',
            {type: 'component', component: <Media icon={consts.appIcon} main={user.name} discription={String(user.id)} />},
            '',
            {
                type: 'component', 
                component: <IconText iconClass="text-info" icon="envelope" text="申请" />,
                onClick: this.apply
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

export default Me;
