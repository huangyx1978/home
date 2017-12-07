import * as React from 'react';
import * as classNames from 'classnames';
import {Button} from 'reactstrap';
import {nav, Page, ListView, ListItem} from 'tonva-tools';
import mainApi from '../mainApi';

export default class NewFollows extends React.Component<{}, null> {
    async test0() {
        await mainApi.postMessage(1, {type:'new-follow', count: 0});
    }
    async test1() {
        await mainApi.postMessage(1, {type:'new-follow', count: 1});
    }
    render() {
        return <Page header="新收录">
            新收录
            <Button onClick={this.test1}>WS1</Button>
            <Button onClick={this.test0}>WS0</Button>
        </Page>
    }
}
