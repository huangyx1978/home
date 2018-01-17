import * as React from 'react';
import {observable, computed} from 'mobx';
import {observer} from 'mobx-react';
import * as classNames from 'classnames';
import {nav, ListView, ListItem} from 'tonva-tools';
import {store} from '../store';
import {Sticky} from '../model';
import {NewFollows} from '../follows';
import consts from '../consts';

const bkStyle={backgroundColor: '#cfcfff', margin:'0', padding:'6px'};
const iconStyle={color:'green'};
const icon=(name) => <div style={bkStyle}><i style={iconStyle} className={'fa fa-lg fa-' + name} /></div>;

@observer
class Follow extends React.Component {
    private actions:ListItem[] = [
        {
            key: 1,
            main: '邀请你成为管理员',
            //right: '增删管理员',
            icon: icon('user-plus'),
            onClick: () => nav.push(<NewFollows />),
            unread: computed(()=>store.fellow.newInvitesCount),
        },
    ];
    constructor(props) {
        super(props);
        //this.rowMapper = this.rowMapper.bind(this);
    }
    private tieConverter(tie:Sticky):ListItem {
        return {
            key: tie.id,
            date: undefined,
            main: undefined, // tie.main,
            //vice: tie..discription,
            icon : consts.appItemIcon,
            //unread: 0,
        }
    }
    render() {
        //let nf = mainData.newFollow;
        //this.actions[0].unread = nf;
        return <div>
            <ListView className='mb-2' items={this.actions} />
            <ListView items={[]} converter={this.tieConverter} />
        </div>;
    }
}

export default Follow;