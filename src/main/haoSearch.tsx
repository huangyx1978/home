import * as React from 'react';
import _ from 'lodash';
import {SearchBox, List, LMR, Muted, Badge, Media} from 'tonva-react-form';
import {nav, Page, LabelRow} from 'tonva-tools';
import {store} from '../store';
import consts from '../consts';
import mainApi from '../mainApi';
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
    private text: string;
    private input: HTMLInputElement;
    private haos: Hao[];
    private minId: number;
    private isSearching: boolean;
    private hasMore: boolean;
    private isFirstPage: boolean;
    constructor(props) {
        super(props);
        this.isFirstPage = true;
        this.isSearching = false;
        this.hasMore = false;
        this.minId = 0;
        this.state = {
            hasMore: this.hasMore,
            loading: this.isSearching,
            haos: this.haos,
        };
        this.onTextChange = this.onTextChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onScrollBottom = this.onScrollBottom.bind(this);
    }
    onTextChange(e) {
        this.text = e.target.value;
    }
    onSubmit(e) {
        e.preventDefault();

        this.haos = undefined;
        this.isFirstPage = true;
        this.hasMore = false;
        this.isSearching = false;
        if (this.text === undefined) return;
        this.text = this.text.trim();
        if (this.text.length === 0) return;
        this.setState({
            hasMore: this.hasMore,
            loading: true,
            haos: this.haos
        });
        this.search();
    }

    search() {
        this.isSearching = true;
        this.input.blur();
        /*
        */
    }
    async onSearch(key:string) {
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
    onScroll(e) {
    }
    onScrollBottom() {
        if (this.hasMore === false) return;
        //setTimeout(() => {
        this.search();
        //}, 3000);
    }
    haoClicked(hao:Hao) {
        nav.push(<HaoFollow 
            unit={hao.unit}
            hao={hao.id} 
            name={hao.name} 
            nick={hao.nick}
            discription={hao.discription} 
            icon={hao.icon}
            isFollowed={hao.isFollowed} />);
    }
    renderUnit(item:any, index:number):JSX.Element {
        let {nick, discription, name, icon} = item;
        let left = <Badge><img src={icon || consts.appItemIcon} /></Badge>;
        return <LMR className="px-3 py-1" left={left}>
            <div className="px-3">
                <div>{name}</div>
                <Muted>{discription}</Muted>
            </div>
        </LMR>;
    }
    render() {
        /*
        let center = (<form onSubmit={this.onSubmit} style={{display:'flex', flex:1, padding:'1px'}}>
            <input ref={(input) => this.input = input}
                onChange={this.onTextChange}
                style={{display:'flex', flex:1}} 
                type="text" name="text" placeholder="搜索小号" />
            <button>S</button>
        </form>); */
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
            //mainClass='search-apps'
            //onScroll={this.onScroll}
            onScrollBottom={this.onScrollBottom}
            >
            {content}
            {more}
        </Page>
        );
    }
}

interface HaoRowProp {
    index: number;
    hao: Hao;
    haoClicked: (hao:Hao) => void;
}

class HaoRow extends React.Component<HaoRowProp, null> {
    render() {
        let {index, hao, haoClicked} = this.props;
        return (<li onClick={() => haoClicked(hao)}>
            <label>
                <img src={hao.icon || consts.appIcon} />
            </label>
            <div>
                <div>{index} : {hao.name}</div>
                <span>{hao.discription}</span>
            </div>
        </li>);
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
        nav.pop(2);
        await store.setUnit(hao);
        nav.push(<>显示unitx MainPage</>); //<MainPage />);
    }
    componentDidMount() {
    }
    render() {
        let unit = this.state.hao;
        let {nick, discription, name, icon, isFollowed} = unit;
        return <Page header='详细资料'>
            <div>
                <div className="row-gap" />
                <Media icon={icon || consts.appIcon} main={name} discription={discription} />
                <div className="row-gap" />
                <div className="row">
                    <div className="col-8 offset-2">
                        {
                            isFollowed===1?
                                <button className='btn form-control' disabled={true}>已关注</button>:
                                <button color='btn btn-primary form-control' onClick={this.follow}>关注</button>
                        }
                    </div>
                </div>
            </div>
        </Page>;
    }
}

export default HaoSearch;
