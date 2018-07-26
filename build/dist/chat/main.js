var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { computed } from 'mobx';
import { Page, nav, isBridged } from 'tonva-tools';
import { DropdownActions } from 'tonva-react-form';
import { store } from 'store';
import { DeskPage } from './desk';
import { AppsPage } from './apps';
import { JobsPage } from './jobs';
import { Queries } from './queries';
const tabs = [
    {
        title: '待办',
        content: React.createElement(DeskPage, null),
        redDot: computed(() => {
            return store.unit.unitx.desk.items.length;
        })
    },
    {
        title: '新建',
        content: React.createElement(JobsPage, null),
    },
    {
        title: '查看',
        content: React.createElement(Queries, null),
    },
    {
        title: '应用',
        content: React.createElement(AppsPage, null),
    },
];
export class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.rightMenu = [
            {
                caption: '取消关注',
                icon: 'trash',
                action: this.unleash,
            }
        ];
        this.unleash = this.unleash.bind(this);
    }
    unleash() {
        return __awaiter(this, void 0, void 0, function* () {
            if (confirm("真的要取消关注吗？") === false)
                return;
            yield store.unfollowUnit();
            nav.pop();
        });
    }
    clickToAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            let adminApp = yield store.getAdminApp();
            //nav.push(<UnitMan {...this.props} />);
            let unitId = store.unit.id;
            isBridged();
            nav.navToApp(adminApp.url, unitId);
        });
    }
    render() {
        let { id, name, discription, apps, icon, ownerName, ownerNick, isOwner, isAdmin } = store.unit;
        if (ownerNick !== undefined)
            ownerNick = '- ' + ownerNick;
        let right;
        if (id > 0) {
            right = React.createElement(DropdownActions, { actions: this.rightMenu });
        }
        return React.createElement(Page, { tabs: tabs, header: store.unit.name, keepHeader: true, right: right });
    }
}
//# sourceMappingURL=main.js.map