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
const tabs = [
    {
        title: '待办',
        content: undefined,
        redDot: computed(() => {
            return 0; //store.unit.unitx.desk.items.length;
        })
    },
    {
        title: '新建',
        content: undefined,
    },
    {
        title: '查看',
        content: undefined,
    },
    {
        title: '应用',
        content: undefined,
    },
];
export class MainPage extends React.Component {
    constructor() {
        super(...arguments);
        /*
        private rcvHandler: number;
        async componentDidMount() {
            this.rcvHandler = nav.registerReceiveHandler(this.onWs);
        }
        private onWs = async (msg:any):Promise<void> => {
            console.log('ws received in unitx: ', msg);
            store.onWs(msg);
        }
        componentWillUnmount() {
            nav.unregisterReceiveHandler(this.rcvHandler);
        }
        */
        this.unleash = () => __awaiter(this, void 0, void 0, function* () {
            if (confirm("真的要取消关注吗？") === false)
                return;
            yield store.unfollowUnit();
            nav.pop();
        });
        this.rightMenu = [
            {
                caption: '取消关注',
                icon: 'trash',
                action: this.unleash,
            }
        ];
    }
    clickToAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            let adminApp = yield store.getAdminApp();
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