import * as React from 'react';
import _ from 'lodash';
import { Page, loadAppUqs, nav, meInFrame, Controller, TypeVPage, VPage, resLang, getExHash, isDevelopment} from 'tonva-tools';
import { List, LMR, FA } from 'tonva-react-form';
import { CUq, EntityType, UqUI } from './uq';
import { centerApi } from '../centerApi';

export interface RoleAppUI {
    CApp?: typeof CApp;
    CUq?: typeof CUq;
    main?: TypeVPage<CApp>;
    uqs: {[uq:string]: UqUI | (()=>Promise<UqUI>)};
    res?: any;
}

export interface AppUI extends RoleAppUI {
    appName: string; // 格式: owner/appName
    roles?: {[role:string]: RoleAppUI | (()=>Promise<RoleAppUI>)};
}

export class CApp extends Controller {
    private appOwner:string;
    private appName:string;
    private cImportUqs: {[uq:string]: CUq} = {};
    protected ui:AppUI;
    id: number;
    appUnits:any[];

    constructor(ui:AppUI) {
        super(resLang(ui && ui.res));
        let tonvaApp = ui.appName;
        if (tonvaApp === undefined) {
            throw 'appName like "owner/app" must be defined in UI';
        }
        let parts = tonvaApp.split('/');
        if (parts.length !== 2) {
            throw 'tonvaApp name must be / separated, owner/app';
        }
        this.appOwner = parts[0];
        this.appName = parts[1];
        if (ui.uqs === undefined) ui.uqs = {};
        this.ui = ui;
        this.caption = this.res.caption || 'Tonva';
    }
    
    readonly caption: string; // = 'View Model 版的 Uq App';
    cUqCollection: {[uq:string]: CUq} = {};

    async startDebug() {
        let appName = this.appOwner + '/' + this.appName;
        let cApp = new CApp({appName: appName, uqs:{}} );
        let keepNavBackButton = true;
        await cApp.start(keepNavBackButton);    
    }

    protected async loadUqs(): Promise<string[]> {
        let retErrors:string[] = [];
        let unit = meInFrame.unit;
        let app = await loadAppUqs(this.appOwner, this.appName);
        let {id, uqs} = app;
        this.id = id;

        let promises: PromiseLike<string>[] = [];
        let promiseChecks: PromiseLike<boolean>[] = [];
        let roleAppUI = await this.buildRoleAppUI();
        for (let appUq of uqs) {
            let {id:uqId, uqOwner, uqName, access} = appUq;
            let uq = uqOwner + '/' + uqName;
            let uqUI = roleAppUI && roleAppUI.uqs && roleAppUI.uqs[uq];
            let cUq = this.newCUq(uq, uqId, access, uqUI || {});
            this.cUqCollection[uq] = cUq;
            promises.push(cUq.loadSchema());
            promiseChecks.push(cUq.entities.uqApi.checkAccess());
        }
        let results = await Promise.all(promises);
        Promise.all(promiseChecks).then((checks) => {
            for (let c of checks) {
                if (c === false) {
                    //debugger;
                    //nav.start();
                    //return;
                }
            }
        });
        for (let result of results)
        {
            let retError = result; // await cUq.loadSchema();
            if (retError !== undefined) {
                retErrors.push(retError);
                continue;
            }
        }
        if (retErrors.length === 0) return;
        return retErrors;
    }

    private async buildRoleAppUI():Promise<RoleAppUI> {
        if (!this.ui) return undefined;
        let {hashParam} = nav;
        if (!hashParam) return this.ui;
        let {roles} = this.ui;
        let ret:RoleAppUI = {} as any;
        for (let i in this.ui) {
            if (i === 'roles') continue;
            ret[i] = _.cloneDeep(this.ui[i]);
        }
        let roleAppUI = roles && roles[hashParam];
        if (typeof roleAppUI === 'function') roleAppUI = await roleAppUI();
        _.merge(ret, roleAppUI);
        return ret;
    }

    async getImportUq(uqOwner:string, uqName:string):Promise<CUq> {
        let uq = uqOwner + '/' + uqName;
        let cUq = this.cImportUqs[uq];
        if (cUq !== undefined) return cUq;
        let ui = this.ui && this.ui.uqs && this.ui.uqs[uq];
        let uqId = -1; // unknown
        this.cImportUqs[uq] = cUq = this.newCUq(uq, uqId, undefined, ui || {});
        let retError = await cUq.loadSchema();
        if (retError !== undefined) {
            console.error(retError);
            debugger;
            return;
        }
        return cUq;
    }

    protected newCUq(uq:string, uqId:number, access:string, ui:any) {
        let cUq = new (this.ui.CUq || CUq)(this, uq, this.id, uqId, access, ui);        
        Object.setPrototypeOf(cUq.x, this.x);
        return cUq;
    }

    get cUqArr():CUq[] {
        let ret:CUq[] = [];
        for (let i in this.cUqCollection) {
            ret.push(this.cUqCollection[i]);
        }
        return ret;
    }

    getCUq(apiName:string):CUq {
        return this.cUqCollection[apiName];
    }

    protected get VAppMain():TypeVPage<CApp> {return (this.ui&&this.ui.main) || VAppMain}
    protected async beforeStart():Promise<boolean> {
        try {
            let {unit} = meInFrame;
            if (isDevelopment === true) {
                let app = await loadAppUqs(this.appOwner, this.appName);
                let {id} = app;
                this.id = id;
                let {user} = nav;
                if (user !== undefined && user.id > 0) {
                    await this.loadAppUnits();
                    switch (this.appUnits.length) {
                        case 0:
                            this.showUnsupport(unit);
                            return false;
                        case 1:
                            let appUnit = this.appUnits[0].id;
                            if (appUnit === undefined || appUnit < 0 || 
                                unit !== undefined && appUnit != unit)
                            {
                                this.showUnsupport(unit);
                                return false;
                            }
                            meInFrame.unit = appUnit;
                            break;
                        default:
                            if (unit>0 && this.appUnits.find(v => v.id===unit) !== undefined) {
                                meInFrame.unit = unit;
                                break;
                            }
                            nav.push(<this.selectUnitPage />)
                            return false;
                    }
                }
            }

            let retErrors = await this.loadUqs();
            if (retErrors !== undefined) {
                this.openPage(<Page header="ERROR">
                    <div className="m-3">
                        <div>Load Uqs 发生错误：</div>
                        {retErrors.map((r, i) => <div key={i}>{r}</div>)}
                    </div>
                </Page>);
                return false;
            }
            return true;
        }
        catch (err) {
            nav.push(<Page header="App start error!">
                <pre>
                    {typeof err === 'string'? err : err.message}
                </pre>
            </Page>);
            return false;
        }
    }

    protected async internalStart(param:any) {
        if (param !== true) {
            this.clearPrevPages();
        }
        await this.showMainPage();
    }
    async load() {
        await this.beforeStart();
    }

    render(): JSX.Element {
        return this.renderView(this.VAppMain);
    }

    // 如果是独立app，删去显示app之前的页面。
    // 如果非独立app，则不删
    protected clearPrevPages() {
        nav.clear();
    }

    private showUnsupport(unit:number) {
        this.clearPrevPages();
        let {user} = nav;
        let userName:string = user? user.name : '[未登录]';
        this.openPage(<Page header="APP无法运行" logout={true}>
            <div className="m-3 text-danger container">
                <div className="form-group row">
                    <div className="col-2">登录用户: </div>
                    <div className="col">{userName}</div>
                </div>
                <div className="form-group row">
                    <div className="col-2">App:</div>
                    <div className="col">{`${this.appOwner}/${this.appName}`}</div>
                </div>
                <div className="form-group row">
                    <div className="col-2">小号:</div>
                    <div className="col">{unit || <small className="text-muted">[无小号]</small>}</div>
                </div>
                <div className="form-group row">
                    <div className="col-2">
                        <FA name="exclamation-triangle" />
                    </div>
                    <div className="col">
                        <div className="text-muted">无法运行可能原因：</div>
                        <ul className="p-0">
                            <li>没有小号运行 {this.ui.appName}</li>
                            <li>用户 <b>{userName}</b> 没有加入任何一个运行{this.ui.appName}的小号</li>
                            <li>用户 <b>{userName}</b> 没有加入小号 unit={unit}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </Page>)
    }

    private async showMainPage() {
        // #tv-RwPBwMef-23-sheet-api-108
        let exHash = getExHash();
        if (exHash !== undefined) {
            let parts = exHash.split('-');
            if (parts.length > 3) {
                let action = parts[3];
                // sheet_debug 表示centerUrl是debug方式的
                if (action === 'sheet' || action === 'sheet_debug') {
                    let uqId = Number(parts[4]);
                    let sheetTypeId = Number(parts[5]);
                    let sheetId = Number(parts[6]);
                    let cUq = this.getCUqFromId(uqId);
                    if (cUq === undefined) {
                        alert('unknown uqId: ' + uqId);
                        return;
                    }
                    this.clearPrevPages();
                    await cUq.navSheet(sheetTypeId, sheetId);
                    return;
                }
            }
        }
        this.openVPage(this.VAppMain);
    }

    private getCUqFromId(uqId:number): CUq {
        for (let i in this.cUqCollection) {
            let cUq = this.cUqCollection[i];
            if (cUq.id === uqId) return cUq;
        }
        return;
    }

    private async loadAppUnits() {
        let ret = await centerApi.userAppUnits(this.id);
        this.appUnits = ret;
        /*
        if (ret.length === 1) {
            meInFrame.unit = ret[0].id;
        }*/
    }

    renderRow = (item: any, index: number):JSX.Element => {
        let {id, nick, name} = item;
        return <LMR className="px-3 py-2" right={'id: ' + id}>
            <div>{nick || name}</div>
        </LMR>;
    }
    onRowClick = async (item: any) => {
        meInFrame.unit = item.id; // 25;
        await this.start();
    }

    protected selectUnitPage = () => {
        return <Page header="选择小号" logout={true}>
            <List items={this.appUnits} item={{render: this.renderRow, onClick: this.onRowClick}}/>
        </Page>
    }
}

class VAppMain extends VPage<CApp> {
    async open(param?:any) {
        this.openPage(this.appPage);
    }

    render(param?:any) {
        return this.appContent();
    }

    protected appPage() {
        let {caption} = this.controller;
        return <Page header={caption} logout={async()=>{meInFrame.unit = undefined}}>
            {this.appContent()}
        </Page>;
    }

    protected appContent = () => {
        let {cUqArr} = this.controller;
        let content:any;
        if (cUqArr.length === 0) {
            content = <div className="text-danger">
                <FA name="" /> 此APP没有绑定任何的UQ
            </div>;
        }
        else {
            content = cUqArr.map((v,i) => <div key={i}>{v.render()}</div>);
        }
        return <>{content}</>;
    };
}
