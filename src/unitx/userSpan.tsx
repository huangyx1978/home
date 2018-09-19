import * as React from 'react';
import {observer} from 'mobx-react';

export interface UserSpanProps {
    userIds: number[];
}

@observer
export class UserSpan extends React.Component<UserSpanProps> {
    render() {
        //let {tuid_user} = store.unit.unitx;
        return <>{
        this.props.userIds.map(id=> {
            //let user:User = tuid_user.valueFromId(id);
            return <small key={id}>
                {/*user === undefined? id : user.nick || user.name*/}
                {id}
            </small>;
        })}
        </>;
    }
}
