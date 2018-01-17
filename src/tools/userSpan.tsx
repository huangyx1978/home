import * as React from 'react';
import {observer} from 'mobx-react';
import * as className from 'classnames';
import {store} from '../store';

export interface UserSpanProps {
    className?: string;
    id: number;
}

@observer
export class UserSpan extends React.Component<UserSpanProps> {
    constructor(props) {
        super(props);
        //this.onClick = this.onClick.bind(this);
    }
    componentWillMount() {
        let {id} = this.props;
        store.cacheUsers.get(id);
    }
    /*
    onClick(evt) {
        evt.preventDefault();
        nav.push(<ApiInfo id={this.props.id} />);
        return false;
    }*/
    render() {
        let {id, className:cn} = this.props;
        let user = store.cacheUsers.get(id);
        let content;
        if (user === null) {
            content = id;
        }
        else {
            let {name, nick} = user;
            let disc = nick && ('- ' + nick);
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
