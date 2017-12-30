import * as React from 'react';
import * as _ from 'lodash';
import {Container, ButtonGroup,
    ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    Row, Col, Button, Form, FormGroup, Label, Input, 
    FormText, FormFeedback} from 'reactstrap';
import {SearchBox} from 'tonva-react-form';
import {nav, Page, LabelRow} from 'tonva-tools';
import consts from '../consts';
//import api from '../../api';

interface Hao {
    unit: number;
    id: number;
    name: string;
    discription: string;
    icon: string;
    followed?: boolean;
}
/*
interface Hao {
    id: number;
    name: string;
    discription: string;
    icon: string;
    owner?: number;
}*/

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
        api.search.hao_search({size: pageSize+1, key: this.text, minId: this.minId}).then(res => {
            this.isSearching = false;
            let ret:any[] = res;
            let retSize = ret.length;

            if (ret.length === pageSize+1) {
                this.hasMore = true;
                ret.splice(retSize-1, 1);
            }
            else {
                this.hasMore = false;
            }
            if (this.haos === undefined) this.haos = [];
            ret.forEach(v => {
                this.minId = v.unit - 1;
                this.haos.splice(this.haos.length, 0, v);
            });
            this.setState({
                hasMore: this.hasMore,
                loading: this.isSearching,
                haos: this.haos
            });
        });
        */
    }
    onSearch(key:string) {
        alert('search：' + key);
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
        if (hao.followed) {
            //navToHao(hao.id);
        }
        else
            nav.push(<HaoFollow 
                unit={hao.unit}
                hao={hao.id} 
                name={hao.name} 
                discription={hao.discription} 
                icon={hao.icon} />)
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
                content = <div>没有找到小号</div>;
            }
            else {
                content = <ul className='search-apps'>{
                    haos.map((v, i) => 
                        <HaoRow key={i} index={i} haoClicked={this.haoClicked} hao={v} />)}
                </ul>;
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
    discription: string;
    icon: string;
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
                discription: props.discription,
                icon: props.icon,
            }
        }
        this.follow = this.follow.bind(this);
    }
    follow() {
        let hao = this.props.hao;
        /*
        api.search.hao_follow({hao: hao}).then(res => {
            if (res.length === 0) {
                alert('无法关注');
                return;
            }
            let row = res[0];
            navToHao(hao);
        });
        */
    }
    componentDidMount() {
        /*
        api.search.hao({hao: this.props.hao}).then(res => {
            if (res.length === 0) return;
            let hao = res[0];
            this.setState({
                loaded: true,
                hao: hao
            });
        });
        */
    }
    render() {
        let unit = this.state.hao;
        return <Page header='详细资料'>
            <Container>
                <div className='unit-detail-header'>
                    <img src={unit.icon || consts.appIcon} />
                    <div>{unit.name}</div>
                </div>
                <LabelRow label='简述'>
                    {unit.discription}
                </LabelRow>
                <div className='row-gap' />
                <Row>
                    <Col xs={{offset:2, size: 8}}>
                        <Button color='primary form-control' onClick={this.follow}>关注</Button>
                    </Col>
                </Row>
            </Container>
        </Page>;
    }
}

export default HaoSearch;
