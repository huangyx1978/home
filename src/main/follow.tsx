import * as React from 'react';
import * as classNames from 'classnames';
import {nav, ListView} from 'tonva-tools';
import {Sticky} from './model';
import TieRow from './tieRow';

interface Props {
    //ties: Tie[];
}

class Follow extends React.Component<Props, null> {
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
        return (
            <ListView items={[]} renderRow={this.rowMapper} />
        );
    }
}

export default Follow;