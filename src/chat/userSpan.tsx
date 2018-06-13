import * as React from 'react';
import {observer} from 'mobx-react';
import {Page, nav, User} from 'tonva-tools';
import {store} from '../store';

export interface UserSpanProps {
    userIds: number[];
}

@observer
export class UserSpan extends React.Component<UserSpanProps> {
    render() {
        let {tuidUser} = store.unit.chat;
        return <>{
        this.props.userIds.map(id=> {
            let user:User = tuidUser.getId(id);
            return <small key={id}>
                {user === undefined? id : user.nick || user.name}
            </small>;
        })}
        </>;
    }
}
