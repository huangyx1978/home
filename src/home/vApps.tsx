import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { List, LMR, Muted, Badge } from 'tonva-react-form';
import { View, Image } from "tonva-tools";
import { CHome } from './cHome';
import { navToApp } from 'navToApp';
import { App } from './model';
import { unitDefaultMarkDown } from './unitDefaultMarkDown';

export class VApps extends View<CHome> { //} React.Component {
    appClick = async (app:App) => {
        let unitId = this.controller.unit.id;
        let appId = app.id;
        if (appId === 0) {
            //let api = new Api(undefined, undefined, undefined, undefined);
            /*
            let unitx = await store.unit.unitx;
            if (await unitx.load() === false) {
                alert('chat api 创建出错');
                return;
            }
            //nav.push(<MainPage />);
            nav.push(<>unitx MainPage</>);
            */
        }
        else {
            await navToApp(app, unitId);
        }
    }
    private renderRow = (app:App, index:number):JSX.Element => {
        let {id:appId, name, caption, icon, discription} = app;
        return <LMR className="px-3 py-2"
            left={<Badge><Image src={icon} /></Badge>}>
            <div className="px-3">
                <div><b>{caption || name}</b></div>
                <small className="text-muted">{discription}</small>
            </div>
        </LMR>;
    }
    clickToAdmin = async () => {
        let adminApp = undefined; //await store.getAdminApp();
        let unitId = this.controller.unit.id;
        await navToApp(adminApp, unitId);
    }
    render() {
        let {unit} = this.controller;
        if (!unit) return null;
        //let {id, name, discription, apps, icon, ownerName, ownerNick, isOwner, isAdmin} = unit;
        let {apps} = unit;
        if (apps === undefined || apps.length === 0) {
            return <ReactMarkdown className="bg-white p-3" source={unit.discription || unitDefaultMarkDown} />;
        }
        /*
        if (ownerNick) ownerNick = '- ' + ownerNick;
        let enterAdmins;
        if (isOwner === 1 || isAdmin === 1) {
            enterAdmins = <button 
                className="btn btn-success btn-sm align-self-start" onClick={()=>this.clickToAdmin()}>
                进入管理
            </button>
        }
        */

        return <List items={apps} item={{render:this.renderRow, onClick:this.appClick}} />;
    }
}
