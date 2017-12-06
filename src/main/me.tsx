import * as React from 'react';
import {nav, ActionRow, User} from 'tonva-tools';
//import {LoginView, ApplyView} from '../../Views';
import homeApi from './homeApi';
import {mainData} from '../mainData';
import consts from '../consts';

class Me extends React.Component {
    exit() {
        if (confirm('退出当前账号不会删除任何历史数据，下次登录依然可以使用本账号')) {
            nav.logout();
            mainData.logout();
            //nav.show(views.login);
            //nav.show(<LoginView />);
        }
    }
    post() {
        alert('try post message');
    }
    render() {
        const {user} = nav;
        return (
            <div>
                <div className='me-header group-start'>
                    <label>
                        <img src={consts.appIcon} />
                    </label>
                    <div>
                        <div>{user.name}</div>
                        <span>ID: {user.id}</span>
                    </div>
                </div>
                <ActionRow action={() => this.post()}>
                    PostMessage
                </ActionRow>
                <ActionRow className='group-start' action={() => this.exit()}>
                    退出
                </ActionRow>
            </div>
        );
    }
}

export default Me;
