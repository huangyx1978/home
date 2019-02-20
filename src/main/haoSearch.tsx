import * as React from 'react';
import _ from 'lodash';
import {SearchBox, List, LMR, Muted, Badge, Media} from 'tonva-react-form';
import {nav, Page, Image} from 'tonva-tools';
import {store} from '../store';
import consts from '../consts';
import mainApi from '../mainApi';
import { CUnitxUq } from 'unitx/cUnitxUq';
//import {MainPage} from '../unitx';

interface Hao {
    unit: number;
    id: number;
    name: string;
    nick: string;
    discription: string;
    icon: string;
    isFollowed: number;
}

interface State {
    hasMore: boolean;
    loading: boolean;
    haos: Hao[];
}

interface HaoSearchProps {
    //dispatch: Dispatch<{}>
}

const pageSize = 30;
class HaoSearch extends React.Component<HaoSearchProps, State> {
    private haos: Hao[];
    private isSearching: boolean;
    private hasMore: boolean;
    constructor(props) {
        super(props);
        this.isSearching = false;
        this.hasMore = false;
        this.state = {
            hasMore: this.hasMore,
            loading: this.isSearching,
            haos: this.haos,
        };
    }
    private search() {
        this.isSearching = true;
    }
    private onSearch = async (key:string) => {
        this.setState({
            loading: true,
        });
        let res = await mainApi.searchUnits(key, 0, 30);
        this.setState({
            hasMore: false,
            loading: false,
            haos: res
        });
    }
    private onScrollBottom = () => {
        if (this.hasMore === false) return;
        //setTimeout(() => {
        this.search();
        //}, 3000);
    }
    private haoClicked = (hao:Hao) => {
        nav.push(<HaoFollow
            unit={hao.unit}
            hao={hao.id} 
            name={hao.name} 
            nick={hao.nick}
            discription={hao.discription} 
            icon={hao.icon}
            isFollowed={hao.isFollowed} />);
    }
    private renderUnit = (item:any, index:number):JSX.Element => {
        let {nick, discription, name, icon} = item;
        let left = <Badge><Image src={icon} /></Badge>;
        return <LMR className="px-3 py-2" left={left}>
            <div className="px-3">
                <div>{name}</div>
                <Muted>{discription}</Muted>
            </div>
        </LMR>;
    }
    render() {
        let center = <SearchBox onSearch={this.onSearch} 
            className="w-100 mx-1" 
            placeholder="搜索小号" 
            maxLength={100} />;
        let content;
        let haos = this.state.haos;
        if (haos !== undefined) {
            if (haos.length === 0) {
                content = <div className="p-3 small text-muted">没有找到小号</div>;
            }
            else {
                content = <List items={haos} item={{
                    render: this.renderUnit,
                    onClick: this.haoClicked
                }} />;
            }
        }
        let textMore;
        let more;
        if (this.state.loading)
            textMore = '正在搜索...';
        else if (this.state.hasMore)
            textMore = '更多内容...';
        if (textMore)
            more = <div style={{height:'50px', textAlign:'center'}}>{textMore}</div>;
        return (
        <Page header={center}
            onScrollBottom={this.onScrollBottom}
            >
            {content}
            {more}
        </Page>
        );
    }
}

interface HaoFollowProps {
    unit: number;
    hao: number;
    name: string;
    nick: string;
    discription: string;
    icon: string;
    isFollowed: number;
}
interface HaoFollowState {
    loaded: boolean;
    hao: Hao;
}
class HaoFollow extends React.Component<HaoFollowProps, HaoFollowState> {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            hao: {
                unit: this.props.unit,
                id: this.props.hao,
                name: props.name,
                nick: props.nick,
                discription: props.discription,
                icon: props.icon,
                isFollowed: props.isFollowed,
            }
        }
        this.follow = this.follow.bind(this);
    }
    async follow() {
        let {hao, name, nick, discription, icon} = this.props;
        await store.followUnit(hao); //, name, nick, discription, icon);
        nav.ceaseTop(2);
        await store.setUnit(hao);
        //nav.push(<>显示unitx MainPage</>); //<MainPage />);
        let crUnitxUq = new CUnitxUq(store.unit);
        await crUnitxUq.start();
    }
    render() {
        let unit = this.state.hao;
        let {nick, discription, name, icon, isFollowed} = unit;
        return <Page header="APP详情">
            <div className="px-3 d-flex flex-column">
                <div className="my-3">
                    <Media icon={icon || consts.appIcon} main={name} discription={discription} />
                </div>
                <div className="w-75 align-self-center">
                    {
                        isFollowed===1?
                            <button className="btn btn-outline-primary form-control" disabled={true}>已关注</button>:
                            <button className="btn btn-primary form-control" onClick={this.follow}>关注</button>
                    }
                </div>
            </div>
        </Page>;
    }
}

export default HaoSearch;
