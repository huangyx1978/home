import * as React from 'react';
import {observable, computed} from 'mobx';
import {observer} from 'mobx-react';
import * as classNames from 'classnames';
import {nav, ListView, ListItem} from 'tonva-tools';
import {mainData} from '../mainData';
import {Sticky} from '../model';
import TieRow from './tieRow';
import {NewFollows} from '../follows';

const bkStyle={backgroundColor: '#cfcfff', margin:'0', padding:'6px'};
const iconStyle={color:'green'};
const icon=(name) => <div style={bkStyle}><i style={iconStyle} className={'fa fa-lg fa-' + name} /></div>;

@observer
class Follow extends React.Component {
    private actions:ListItem[] = [
        {
            key: 1,
            main: '新收录',
            //right: '增删管理员',
            icon: icon('user-plus'),
            onClick: () => nav.push(<NewFollows />),
            unread: computed(()=>mainData.newFollow),
        },
    ];
    constructor(props) {
        super(props);
        this.rowMapper = this.rowMapper.bind(this);
    }
    private rowMapper(tie:Sticky, index:number) {
        return <TieRow key={tie.id} {...tie} isHome={false} />;
    }
    render() {
        //let nf = mainData.newFollow;
        //this.actions[0].unread = nf;
        return <div>
            <ListView items={this.actions} />
            <div style={{height:'20px'}} />
            <ListView items={[]} renderRow={this.rowMapper} />
        </div>;
    }
}

export default Follow;