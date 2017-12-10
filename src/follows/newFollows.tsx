import * as React from 'react';
import * as classNames from 'classnames';
import {observer} from 'mobx-react';
import {Card, CardHeader, CardBody, CardText, CardTitle, Button,
    Container, Row, Col} from 'reactstrap';
import {nav, Page, ListView, ListItem} from 'tonva-tools';
import mainApi from '../mainApi';
import {mainData} from '../mainData';
import {UserMessage} from '../model';
import consts from '../consts';

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
        await mainData.loadFellowInvites();
    }
    private async accept(um:UserMessage) {
        await mainData.acceptFellowInvite(um);
        nav.replace(<Page header='接受邀请' close={true}>
            <Card>
                <CardBody>
                    <CardTitle>小号成员</CardTitle>
                    <CardText>你已成为{um.from.name}-{um.from.nick}的成员。</CardText>
                    <Button color='primary' onClick={()=>nav.back()}>完成</Button>
                </CardBody>
            </Card>
        </Page>);
}
    private async refuse(um:UserMessage) {
        await mainData.refuseFellowInvite(um);
    }
    converter(um:UserMessage):ListItem {
        let {name, nick, icon} = um.from;
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
                <Button className='mr-2' color='success' size='sm' onClick={accept}>接受</Button>
                <Button color='danger' outline={true} size='sm' onClick={refuse}>拒绝</Button>
            </div>,
        };
    }
    render() {
        let fai = mainData.fellowArchivedInvites;
        return <Page header="邀请">
            新收录
            <Button onClick={this.test1}>WS1</Button>
            <Button onClick={this.test0}>WS0</Button>
            <ListView items={fai} converter={this.converter} />
        </Page>
    }
}
