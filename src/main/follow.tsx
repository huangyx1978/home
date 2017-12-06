import * as React from 'react';
import * as classNames from 'classnames';
import {nav, ListView, ListItem} from 'tonva-tools';
import {Sticky} from '../model';
import TieRow from './tieRow';
import {NewFollows} from '../follows';

interface Props {
    //ties: Tie[];
}

const bkStyle={backgroundColor: '#cfcfff', margin:'0', padding:'6px'};
const iconStyle={color:'green'};
const icon=(name) => <div style={bkStyle}><i style={iconStyle} className={'fa fa-lg fa-' + name} /></div>;

class Follow extends React.Component<Props, null> {
    private actions:ListItem[] = [
        {
            main: '新请求',
            //right: '增删管理员',
            icon: icon('user-plus'),
            onClick: () => nav.push(<NewFollows />)
        },
    ];
    constructor(props) {
        super(props);
        this.rowMapper = this.rowMapper.bind(this);
    }
    componentDidMount() {
        //this.props.dispatch(loadFollows(undefined, 1000, ''));
    }
    private rowMapper(tie:Sticky, index:number) {
        return <TieRow key={tie.id} {...tie} isHome={false} />;
    }
    render() {
        return <div>
            <ListView items={this.actions} />
            <div style={{height:'20px'}} />
            <ListView items={[]} renderRow={this.rowMapper} />
        </div>;
    }
}

export default Follow;