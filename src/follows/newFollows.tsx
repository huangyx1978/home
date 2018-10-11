import * as React from 'react';
import {observer} from 'mobx-react';
import {nav, Page, } from 'tonva-tools';
import {ListView, ListItem} from 'tonva-react-form';
import mainApi from 'mainApi';
import {store} from 'store';
import {Message} from 'model';
import consts from 'consts';

@observer
export default class NewFollows extends React.Component<{}, null> {
    constructor(props) {
        super(props);
        this.converter = this.converter.bind(this);
        this.accept = this.accept.bind(this);
        this.refuse = this.refuse.bind(this);
    }
    async test0() {
        await mainApi.postMessage(1, {type:'new-follow', count: 0});
    }
    async test1() {
        await mainApi.postMessage(1, {type:'new-follow', count: 1});
    }
    async componentDidMount() {
        let fellow = store.follow;
        await fellow.loadInvites();
        fellow.newInvitesCount = undefined;
    }
    async componentWillUnmount() {
        store.follow.newInvitesCount = 0;
    }
    private async accept(um:Message) {
        await store.acceptFellowInvite(um);
        nav.replace(<Page header='接受邀请' back="close">
            <div className="card">
                <div className="card-body">
                    <div className="card-title">小号成员</div>
                    <div className="card-text">你已成为{/*um.from.name*/}-{/*um.from.nick*/}的成员。</div>
                    <button className="btn btn-primary" onClick={()=>nav.back()}>完成</button>
                </div>
            </div>
        </Page>);
}
    private async refuse(um:Message) {
        await store.follow.refuseInvite(um);
    }
    converter(um:Message):ListItem {
        let {name, nick, icon} = {name:'name', nick:'nick', icon:'icon'};
        let main:string = name;
        if (nick !== undefined) main += ' - ' + nick;
        let accept = async ()=>await this.accept(um);
        let refuse = async ()=>await this.refuse(um)
        return {
            key: um.id,
            main: main,
            icon: icon || consts.appIcon,
            middle: "邀请成为小号管理员",
            midSize: 3,
            right: <div>
                <button className='mr-2 btn btn-success btn-sm' onClick={accept}>接受</button>
                <button className='btn btn-sm btn-outline-danger' onClick={refuse}>拒绝</button>
            </div>,
        };
    }
    render() {
        let fai = store.follow.invites;
        return <Page header="邀请">
            新收录
            <button className="btn btn-primary" onClick={this.test1}>WS1</button>
            <button className="btn btn-primary" onClick={this.test0}>WS0</button>
            <ListView items={fai} converter={this.converter} />
        </Page>
    }
}
