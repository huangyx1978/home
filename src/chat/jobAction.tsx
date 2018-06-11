import * as React from 'react';
import * as className from 'classnames';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {List, EasyDate, LMR, FA, Muted, PropGrid, Prop, Media, IconText} from 'tonva-react-form';
import {Page, nav, User} from 'tonva-tools';
import {Message} from '../model';
import {store} from '../store';

export interface JobActionPageProps {
    msg: Message
}

export class JobActionPage extends React.Component<JobActionPageProps> {
    constructor(props) {
        super(props);
        this.finish = this.finish.bind(this);
        this.decline = this.decline.bind(this);
        this.edit = this.edit.bind(this);
    }

    private async finish() {
        let {msg} = this.props;
        await store.unit.chat.actMessage(msg, 'done', '#', [{user:0}]);
        nav.pop();
    }
    private async decline() {
        let {msg} = this.props;
        await store.unit.chat.actMessage(msg, 'decline', '#-', [{user:0}]);
        alert('显示做不了的理由, 然后选择。暂未完成设计！');
        nav.pop();
    }
    private async edit() {
        let {msg} = this.props;
        msg.subject += '.1';
    }
    render() {
        let {msg} = this.props;
        let {fromUser} = msg;
        let {tuidMessage, tuidUser} = store.unit.chat;
        let user = tuidUser.getId(fromUser);
        let rows:Prop[] = [
            {
                label: '来自',
                type: 'component', 
                component: <div className="w-100">
                    {typeof user === 'object'?
                        <small>{user.nick || user.name}</small> : 
                        <small>{user}</small>}
                </div>
            },
            {
                label: '任务描述',
                type: 'string', 
                name: 'discription',
                //onClick: this.applyUnit
            },
            '',
            {
                label: '',
                type: 'component',
                bk: 'tansparent',
                component: <div className="w-100">
                    <LMR
                        left={<Button color="success" onClick={this.finish}>完成</Button>} 
                        right={<Button color="info" onClick={this.decline}>做不了</Button>} />
                </div>
                //<Button color="secondary" onClick={this.edit}>编辑</Button>
            }
        ];
        return <Page header="处理任务">
            <PropGrid className="px-3 py-2" rows={rows} values={msg} />
        </Page>;
    }
}
/*
<div>
<Button color="success" onClick={this.finish}>完成</Button> &nbsp; &nbsp;
<Button color="secondary" onClick={this.decline}>做不了</Button>
<Button color="secondary" onClick={this.edit}>编辑</Button>
</div>
*/