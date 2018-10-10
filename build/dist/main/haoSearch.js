var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { SearchBox, List, LMR, Muted, Badge, Media } from 'tonva-react-form';
import { nav, Page } from 'tonva-tools';
import { store } from '../store';
import consts from '../consts';
import mainApi from '../mainApi';
import { CUnitxUsq } from 'unitx/cUnitxUsq';
const pageSize = 30;
class HaoSearch extends React.Component {
    constructor(props) {
        super(props);
        this.onSearch = (key) => __awaiter(this, void 0, void 0, function* () {
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
        this.onScrollBottom = () => {
            if (this.hasMore === false)
                return;
            //setTimeout(() => {
            this.search();
            //}, 3000);
        };
        this.haoClicked = (hao) => {
            nav.push(React.createElement(HaoFollow, { unit: hao.unit, hao: hao.id, name: hao.name, nick: hao.nick, discription: hao.discription, icon: hao.icon, isFollowed: hao.isFollowed }));
        };
        this.renderUnit = (item, index) => {
            let { nick, discription, name, icon } = item;
            let left = React.createElement(Badge, null,
                React.createElement("img", { src: icon || consts.appItemIcon }));
            return React.createElement(LMR, { className: "px-3 py-2", left: left },
                React.createElement("div", { className: "px-3" },
                    React.createElement("div", null, name),
                    React.createElement(Muted, null, discription)));
        };
        this.isSearching = false;
        this.hasMore = false;
        this.state = {
            hasMore: this.hasMore,
            loading: this.isSearching,
            haos: this.haos,
        };
    }
    search() {
        this.isSearching = true;
    }
    render() {
        let center = React.createElement(SearchBox, { onSearch: this.onSearch, className: "w-100 mx-1", placeholder: "\u641C\u7D22\u5C0F\u53F7", maxLength: 100 });
        let content;
        let haos = this.state.haos;
        if (haos !== undefined) {
            if (haos.length === 0) {
                content = React.createElement("div", { className: "p-3 small text-muted" }, "\u6CA1\u6709\u627E\u5230\u5C0F\u53F7");
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
        return (React.createElement(Page, { header: center, onScrollBottom: this.onScrollBottom },
            content,
            more));
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
            nav.ceaseTop(2);
            yield store.setUnit(hao);
            //nav.push(<>显示unitx MainPage</>); //<MainPage />);
            let crUnitxUsq = new CUnitxUsq(store.unit);
            yield crUnitxUsq.start();
        });
    }
    render() {
        let unit = this.state.hao;
        let { nick, discription, name, icon, isFollowed } = unit;
        return React.createElement(Page, { header: "APP\u8BE6\u60C5" },
            React.createElement("div", { className: "px-3 d-flex flex-column" },
                React.createElement("div", { className: "my-3" },
                    React.createElement(Media, { icon: icon || consts.appIcon, main: name, discription: discription })),
                React.createElement("div", { className: "w-75 align-self-center" }, isFollowed === 1 ?
                    React.createElement("button", { className: "btn btn-outline-primary form-control", disabled: true }, "\u5DF2\u5173\u6CE8") :
                    React.createElement("button", { className: "btn btn-primary form-control", onClick: this.follow }, "\u5173\u6CE8"))));
    }
}
export default HaoSearch;
//# sourceMappingURL=haoSearch.js.map