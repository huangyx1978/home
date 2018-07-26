import * as React from 'react';
import {observer} from 'mobx-react';
import * as className from 'classnames';
import {store} from 'store';

export interface UnitSpanProps {
    className?: string;
    id: number;
}

@observer
export class UnitSpan extends React.Component<UnitSpanProps> {
    constructor(props) {
        super(props);
        //this.onClick = this.onClick.bind(this);
    }
    componentWillMount() {
        let {id} = this.props;
        store.cacheUnits.get(id);
    }
    /*
    onClick(evt) {
        evt.preventDefault();
        nav.push(<ApiInfo id={this.props.id} />);
        return false;
    }*/
    render() {
        let {id, className:cn} = this.props;
        let unit = store.cacheUnits.get(id);
        let content;
        if (unit === null) {
            content = id;
        }
        else {
            let {name, discription} = unit;
            let disc = discription && ('- ' + discription);
            if (name !== undefined) {
                content = <React.Fragment>{name} <small className="text-muted">{disc}</small></React.Fragment>;
            }
            else {
                content = id;
            }
        }
        return <span className={className(cn)}>
            {content}
        </span>;
    }
}
