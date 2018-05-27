var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { SearchBox, List, LMR, Muted, Badge, Media } from 'tonva-react-form';
import { nav, Page } from 'tonva-tools';
import { store } from '../store';
import consts from '../consts';
import mainApi from '../mainApi';
import { TieApps } from './tieApps';
const pageSize = 30;
class HaoSearch extends React.Component {
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
        if (this.text === undefined)
            return;
        this.text = this.text.trim();
        if (this.text.length === 0)
            return;
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
    onSearch(key) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setState({
                loading: true,
            });
            let res = yield mainApi.searchUnits(key, 0, 30);
            this.setState({
                hasMore: false,
                loading: false,
                haos: res
            });
        });
    }
    onScroll(e) {
    }
    onScrollBottom() {
        if (this.hasMore === false)
            return;
        //setTimeout(() => {
        this.search();
        //}, 3000);
    }
    haoClicked(hao) {
        nav.push(React.createElement(HaoFollow, { unit: hao.unit, hao: hao.id, name: hao.name, nick: hao.nick, discription: hao.discription, icon: hao.icon, isFollowed: hao.isFollowed }));
    }
    renderUnit(item, index) {
        let { nick, discription, name, icon } = item;
        let left = React.createElement(Badge, null,
            React.createElement("img", { src: icon || consts.appItemIcon }));
        return React.createElement(LMR, { className: "p-2", left: left },
            React.createElement("div", null, name),
            React.createElement(Muted, null, discription));
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
        let center = React.createElement(SearchBox, { onSearch: this.onSearch, className: "w-100 mx-1", placeholder: "\u641C\u7D22\u5C0F\u53F7", maxLength: 100 });
        let content;
        let haos = this.state.haos;
        if (haos !== undefined) {
            if (haos.length === 0) {
                content = React.createElement("div", null, "\u6CA1\u6709\u627E\u5230\u5C0F\u53F7");
            }
            else {
                content = React.createElement(List, { items: haos, item: {
                        render: this.renderUnit,
                        onClick: this.haoClicked
                    } });
            }
        }
        let textMore;
        let more;
        if (this.state.loading)
            textMore = '正在搜索...';
        else if (this.state.hasMore)
            textMore = '更多内容...';
        if (textMore)
            more = React.createElement("div", { style: { height: '50px', textAlign: 'center' } }, textMore);
        return (React.createElement(Page, { header: center, 
            //mainClass='search-apps'
            //onScroll={this.onScroll}
            onScrollBottom: this.onScrollBottom },
            content,
            more));
    }
}
class HaoRow extends React.Component {
    render() {
        let { index, hao, haoClicked } = this.props;
        return (React.createElement("li", { onClick: () => haoClicked(hao) },
            React.createElement("label", null,
                React.createElement("img", { src: hao.icon || consts.appIcon })),
            React.createElement("div", null,
                React.createElement("div", null,
                    index,
                    " : ",
                    hao.name),
                React.createElement("span", null, hao.discription))));
    }
}
class HaoFollow extends React.Component {
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
        };
        this.follow = this.follow.bind(this);
    }
    follow() {
        return __awaiter(this, void 0, void 0, function* () {
            let { hao, name, nick, discription, icon } = this.props;
            yield store.followUnit(hao); //, name, nick, discription, icon);
            nav.pop(2);
            yield store.setUnit(hao);
            nav.push(React.createElement(TieApps, null));
        });
    }
    componentDidMount() {
    }
    render() {
        let unit = this.state.hao;
        let { nick, discription, name, icon, isFollowed } = unit;
        return React.createElement(Page, { header: '\u8BE6\u7EC6\u8D44\u6599' },
            React.createElement(Container, null,
                React.createElement("div", { className: 'row-gap' }),
                React.createElement(Media, { icon: icon || consts.appIcon, main: name, discription: discription }),
                React.createElement("div", { className: 'row-gap' }),
                React.createElement(Row, null,
                    React.createElement(Col, { xs: { offset: 2, size: 8 } }, isFollowed === 1 ?
                        React.createElement(Button, { color: 'form-control', disabled: true }, "\u5DF2\u5173\u6CE8") :
                        React.createElement(Button, { color: 'primary form-control', onClick: this.follow }, "\u5173\u6CE8")))));
    }
}
export default HaoSearch;
//# sourceMappingURL=haoSearch.js.map