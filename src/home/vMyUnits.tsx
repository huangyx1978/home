import * as React from 'react';
import classNames from 'classnames';
import { CHome } from "./cHome";
import { VPage, Page, Image, nav } from 'tonva';
import { Prop, List, IconText, LMR, PropGrid, FA } from 'tonva';
import { Unit } from './unit';
import { VCreate } from './vCreate';
import { observer } from 'mobx-react';

const applyUnit = "创建小号";
const applyDev = "创建开发号";

const classItems = 'py-2 cursor-pointer border-bottom border-info align-items-center';

export class VMyUnits extends VPage<CHome> {
    async open() {
        this.openPage(this.page);
    }

    private page = observer(():JSX.Element => {
        let elUnits:any;
        let {adminUnits} = this.controller;
        if (adminUnits && adminUnits.length > 0) {
            let rows:Prop[] = [];
            rows.push('');
            rows.push({
                type: 'component', 
                component: <List className="w-100" items={adminUnits} 
                    item={{render:this.renderAdminUnit, onClick:this.clickAdminUnit}} />
            });
            elUnits = <PropGrid rows={rows} values={{}} />;
        }
        return <Page header="我的小号">
            {this.itemCreate()}
            {elUnits}
        </Page>
    });

    private itemCreate() {
        let {allowDev, sumDev, allowUnit, sumUnit} = this.controller.grant;
        let items:{icon:string, type:string, caption:string}[] = [];
        if (allowDev > sumDev) items.push({icon:'laptop', type:'dev', caption: '创建开发号'});
        if (allowUnit > sumUnit) items.push({icon: 'desktop', type:'unit', caption: '创建小号'});
        if (items.length === 0) return;
        let first = true;
        return <>
            {items.map((v,index) => {
                let cnItems = ['px-3 bg-white', classItems];
                if (first === true) {
                    cnItems.push('border-top');
                    first = false;
                }
                let {icon, type, caption} = v;
                let left = <FA name={icon} size='lg' className="text-info mr-3" />;
                return <LMR key={index} className={classNames(cnItems)}
                    left={left}
                    onClick={() => this.openVPage(VCreate, v)}>
                    {caption}
                </LMR>;
            })}
        </>;
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
        let left = <Image className="w-1-5c h-1-5c mr-2" src={icon} />;
        return <LMR className="py-2" left={left} right={right}>
            {name}{unitType}
        </LMR>
    }

    private clickAdminUnit = (unit:Unit) => {
        this.controller.navToAdmin(unit);
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
        /*
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
        */
        // 上面的代码不用了
    }
}