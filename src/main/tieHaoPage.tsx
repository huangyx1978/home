import * as React from 'react';
import * as classNames from 'classnames';
import {Button} from 'reactstrap'; 
import {nav, Page, ListView} from 'tonva-tools';
import homeApi from './homeApi';
import {Sticky} from './model';
import consts from '../consts';

export function navToHao(hao:number) {
    let tieHao = cachedTieHao[hao];
    if (tieHao !== undefined) {
        if (tieHao.applets.length > 0) {
            showTie(tieHao);
            return;
        }
    }
    homeApi.tieHao(hao).then(ret => {
        tieHao = cachedTieHao[hao] = ret;
        showTie(tieHao);
    });

    function showTie(tieHao: TieHao) {
        let {applets} = tieHao;
        let len = 0;
        if (applets !== undefined) len = applets.length;
        if (len === 0) {
            nav.push(<NoAppletsPage appName={tieHao.main || tieHao.ex} />);
            return;
        }
        else if (len === 1) {
            let applet = applets[0];
            let {id, url, urlDebug} = applet;
            //nav.navToApp(tieHao.id, id, url || urlDebug);
            return;
        }
        nav.push(<TieHaoPage tieHao={tieHao} isHome={true} />);
        return;
    }
}

export function navToHaoAttributes(hao:number) {
    let tieHao = cachedTieHao[hao];
    if (tieHao !== undefined) {
        showAttributes(tieHao);
        return;
    }
    homeApi.tieHao(hao).then(ret => {
        tieHao = cachedTieHao[hao] = ret;
        showAttributes(tieHao);
    });

    function showAttributes(tieHao: TieHao) {
        let {applets} = tieHao;
        if (applets === undefined || applets.length === 0) {
            alert('no applets');
            return;
        }
        nav.push(<TieHaoPage tieHao={tieHao} isHome={false} />);
    }
}

interface Applet {
    id: number;
    name: string;
    discription: string;
    icon: string;
    url: string;
    urlDebug: string;
    isDebug: number;
    access: string;
}
interface TieHao extends Sticky {
/*    
    id: number;
    hao: number;
    app: number;
    assigned: string;
    unread: number;
    name: string;
    discription: string;
    icon: string;
*/    
    onHome: number;
    applets: Applet[];
}

const cachedTieHao: {[id:number]: TieHao} = {};

interface TieHaoPageProps {
    tieHao: TieHao,
    isHome: boolean,
}
interface TieHaoPageState {
    onHome: boolean;
}
class TieHaoPage extends React.Component<TieHaoPageProps, TieHaoPageState> {
    constructor(props) {
        super(props);
        this.state = {
            onHome: this.props.tieHao.onHome > 0,
        }
        this.mapper = this.mapper.bind(this);
        // this.click = this.click.bind(this);
    }
    click(applet: Applet) {
        let {tieHao} = this.props;
        let {id, url, urlDebug} = applet;
        //nav.navToApp(tieHao.id, id, url || urlDebug);
    }
    mapper(applet: Applet, index:number) {
        const {name, discription, icon} = applet;
        return <li key={applet.id} className='app-row' onClick={() => this.click(applet)}>
            <label>
                <img src={icon || consts.appIcon} />
            </label>
            <div>
                <div>{name}</div>
                <span>{discription}</span>
            </div>
        </li>;
    }
    toHome() {
        let {tieHao} = this.props;
        homeApi.toHome(tieHao.id).then(res => {
            //dispatch(tieToHome(tieHao));
            this.setState({
                onHome: true,
            });
        });
    }
    render() {
        let {tieHao, isHome} = this.props;
        let tie = tieHao;
        let {onHome} = this.state;
        let toHome;
        if (isHome === false)
            toHome = onHome === false?
                <Button className='full-button' 
                    color='success' 
                    onClick={()=>this.toHome()}>加入同花首页</Button>
                :
                <Button disabled={true} 
                    className='full-button' 
                    outline={true} color='success'>在同花首页</Button>
        return <Page header={tie.main || tie.ex}>
            <div className='tiehao-top'>
                <label>{tie.ex}</label>
            </div>
            <ListView items={tieHao.applets}
                renderRow={this.mapper} />
            <br />
            {toHome}
        </Page>;
    }
}

interface NoAppletsPageProps {
    appName: string;
}
class NoAppletsPage extends React.Component<NoAppletsPageProps, null> {
    render() {
        return <Page header={this.props.appName}>
            <div style={{margin: '16px', color: 'gray', fontSize: 'smaller'}}>
                请跟小号所有者联络。
            </div>
        </Page>;
    }
}
