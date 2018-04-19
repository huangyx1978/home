import * as React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { SearchBox } from 'tonva-react-form';
import { nav, Page, LabelRow } from 'tonva-tools';
import consts from '../consts';
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
    onSearch(key) {
        alert('search：' + key);
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
        if (hao.followed) {
            //navToHao(hao.id);
        }
        else
            nav.push(React.createElement(HaoFollow, { unit: hao.unit, hao: hao.id, name: hao.name, discription: hao.discription, icon: hao.icon }));
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
                content = React.createElement("ul", { className: 'search-apps' }, haos.map((v, i) => React.createElement(HaoRow, { key: i, index: i, haoClicked: this.haoClicked, hao: v })));
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
                discription: props.discription,
                icon: props.icon,
            }
        };
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
        return React.createElement(Page, { header: '\u8BE6\u7EC6\u8D44\u6599' },
            React.createElement(Container, null,
                React.createElement("div", { className: 'unit-detail-header' },
                    React.createElement("img", { src: unit.icon || consts.appIcon }),
                    React.createElement("div", null, unit.name)),
                React.createElement(LabelRow, { label: '\u7B80\u8FF0' }, unit.discription),
                React.createElement("div", { className: 'row-gap' }),
                React.createElement(Row, null,
                    React.createElement(Col, { xs: { offset: 2, size: 8 } },
                        React.createElement(Button, { color: 'primary form-control', onClick: this.follow }, "\u5173\u6CE8")))));
    }
}
export default HaoSearch;
//# sourceMappingURL=haoSearch.js.map