var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { observer } from 'mobx-react';
import { Button } from 'reactstrap';
import { List, EasyDate, LMR, FA, Muted } from 'tonva-react-form';
import { nav } from 'tonva-tools';
import { store, templetDict } from 'store';
import { ApplyDev, ApplyUnit, ApprovedDev, ApprovedUnit, UnitFollowInvite } from 'messages';
import { navToAppId } from './navToApp';
import { VmView } from 'tonva-react-usql';
import { UserSpan } from './userSpan';
const typeMessageMap = {
    "apply-unit": ApplyUnit,
    "apply-dev": ApplyDev,
    "approve-unit": ApprovedUnit,
    "approve-dev": ApprovedDev,
    "unit-follow-invite": UnitFollowInvite,
};
export class DeskPage extends VmView {
    constructor() {
        super(...arguments);
        /*
        componentDidMount() {
            let bd = store.unit.unitx.desk.bottomDiv;
            let el = document.getElementById(bd);
            if (el) el.scrollIntoView();
        }
        */
        this.clickMessage = (deskItem) => __awaiter(this, void 0, void 0, function* () {
            let { message, read } = deskItem;
            let idBox = message;
            if (read !== 1)
                yield this.coordinator.readMessage(idBox.id);
            let { unit } = store;
            //let tuid = this.coordinator.tuid_message;
            //let msg = tuid.valueFromId(id);
            let msg = idBox.obj;
            if (typeof message === 'number')
                return;
            let { type } = message;
            switch (type) {
                default:
                    //nav.push(<JobPage msg={msg} />);
                    this.coordinator.jobPage(message);
                    break;
                case 'sheetMsg':
                    //alert(JSON.stringify(msg));
                    let obj = JSON.parse(message.content);
                    let { app: appId, id: sheetId, usq: usqId, sheet: sheetType } = obj;
                    yield navToAppId(appId, usqId, unit.id, sheetType, sheetId);
                    break;
            }
        });
        this.renderMessage = (deskItem, index) => {
            return React.createElement(this.msgRow, Object.assign({}, deskItem));
        };
        this.clickPlus = () => __awaiter(this, void 0, void 0, function* () {
            //let templets = await store.unit.chat.getTemplets();
            //nav.push(<JobsPage templets={templets} />);
        });
        this.clickApps = () => {
            //this.openPage(AppsPage);
            //nav.push(<AppsPage />);
            this.coordinator.showAppsPage();
        };
        this.view = () => {
            let { desk } = this.coordinator;
            let { items, bottomDiv } = desk;
            let right = React.createElement(Button, { onClick: this.clickApps, color: "success", size: "sm" }, "\u529F\u80FD\u5E94\u7528");
            let footer = React.createElement("div", { className: "p-1" },
                React.createElement(Button, { color: "primary", size: "sm", onClick: this.clickPlus },
                    React.createElement(FA, { name: "plus" })),
                "\u00A0 ",
                React.createElement("div", { onClick: this.clickPlus }, "\u53D1\u4EFB\u52A1"));
            return React.createElement(React.Fragment, null,
                this.coordinator.myFolders(),
                React.createElement(List, { className: "my-1", before: React.createElement(Muted, null, "\u8BFB\u53D6\u4E2D..."), none: React.createElement("div", { className: "p-2" },
                        React.createElement("small", { style: { color: 'lightgray' } }, "\u6682\u65E0\u5F85\u529E\u4E8B\u9879")), items: items, item: {
                        key: (item) => item.id.id,
                        className: 'bg-transparent',
                        render: this.renderMessage,
                        onClick: this.clickMessage
                    } }),
                React.createElement("div", { id: bottomDiv }));
            //</Page>;
        };
        this.msgRow = observer((deskItem) => {
            let userId = nav.user.id;
            let { tuid_message, tuid_user } = this.coordinator;
            let { message, read } = deskItem;
            //let msg:Message = tuid_message.valueFromId();
            //let msg:Message = {id: ((id as any) as IdBox).id} as any;
            let rowCn = 'px-3 bg-white my-1';
            if (typeof message === 'number') {
                return React.createElement(LMR, { className: rowCn + ' py-2' },
                    React.createElement("small", { style: { color: 'lightgray' } },
                        "... ",
                        message,
                        " ..."));
            }
            let messageTemplet = (msg) => {
                let { date, type, fromUser, subject, discription, content } = msg;
                let td = templetDict[type];
                let cn, cnText;
                if (read === 1) {
                    cn = 'mt-1 text-info';
                    cnText = 'text-secondary';
                }
                else {
                    cn = 'mt-1 text-danger';
                    cnText = 'text-dark';
                }
                let from, size;
                if (fromUser != userId) {
                    from = React.createElement(UserSpan, { userIds: [fromUser] });
                    size = '1x';
                }
                let caption;
                if (subject !== undefined) {
                    caption = React.createElement(React.Fragment, null,
                        React.createElement("span", { className: "font-weight-bold" }, subject),
                        " - ");
                }
                return React.createElement("div", { className: 'row bg-white' },
                    React.createElement("div", { className: "col-sm-1 col" },
                        React.createElement("div", { className: "py-2 px-2" },
                            React.createElement(FA, { className: cn, size: size, name: (td && td.icon) || 'envelope' }))),
                    React.createElement("div", { className: "col-sm-9 order-sm-2 col-12 order-3" },
                        React.createElement("div", { className: 'py-2 px-2' },
                            caption,
                            React.createElement("small", null, discription))),
                    React.createElement("div", { className: "col-sm-2 order-sm-3 col order-2", style: light },
                        React.createElement("div", { className: 'py-2 px-2 text-right' },
                            React.createElement(EasyDate, { date: date }))));
            };
            return message.content(messageTemplet);
            /*
            let {date, type, fromUser, subject, discription, content} = msg;
            let td = templetDict[type];
            let cn, cnText;
            if (read === 1) {
                cn = 'mt-1 text-info';
                cnText = 'text-secondary';
            }
            else {
                cn = 'mt-1 text-danger';
                cnText = 'text-dark';
            }
            let from, size;
            if (fromUser != userId) {
                from = <UserSpan userIds={[fromUser]} />;
                size = '1x';
            }
            let caption;
            if (subject !== undefined) {
                caption = <><span className="font-weight-bold">{subject}</span> - </>;
            }
            return <div className='row bg-white'>
                <div className="col-sm-1 col">
                    <div className="py-2 px-2">
                        <FA className={cn} size={size} name={(td && td.icon) || 'envelope'} />
                    </div>
                </div>
                <div className="col-sm-9 order-sm-2 col-12 order-3">
                    <div className='py-2 px-2'>
                        {caption}
                        <small>{discription}</small>
                    </div>
                </div>
    
                <div className="col-sm-2 order-sm-3 col order-2" style={light}>
                    <div className='py-2 px-2 text-right'>
                        <EasyDate date={date} />
                    </div>
                </div>
            </div>;
        */
        });
    }
    render() {
        return React.createElement(this.view, null);
    }
}
const light = { fontSize: 'x-small', color: 'lightgray' };
const MsgRow = (deskItem) => {
    let userId = nav.user.id;
    //let {tuid_message, tuid_user} = store.unit.unitx;
    //let {deskItem} = this.props;
    let { message, read } = deskItem;
    let idBox = message;
    return React.createElement(React.Fragment, null, "desk message row");
    //return <>{idBox.content()} read{read}</>;
};
/*
@observer
class MsgRow extends React.Component<MsgRowProps> {
    render() {
        let userId = nav.user.id;
        let {tuid_message, tuid_user} = store.unit.unitx;
        let {deskItem} = this.props;
        let {id, read} = deskItem;
        let msg:Message = tuid_message.valueFromId(id);
        let rowCn = 'px-3 bg-white my-1';
        if (typeof msg === 'number') {
            return <LMR className={rowCn + ' py-2'}><small style={{color:'lightgray'}}>... {id} ...</small></LMR>;
        }
        let {date, type, fromUser, subject, discription, content} = msg;
        let td = templetDict[type];
        let cn, cnText;
        if (read === 1) {
            cn = 'mt-1 text-info';
            cnText = 'text-secondary';
        }
        else {
            cn = 'mt-1 text-danger';
            cnText = 'text-dark';
        }
        let from, size;
        if (fromUser != userId) {
            from = <UserSpan userIds={[fromUser]} />;
            size = '1x';
        }
        let caption;
        if (subject !== undefined) {
            caption = <><span className="font-weight-bold">{subject}</span> - </>;
        }
        return <div className='row bg-white'>
            <div className="col-sm-1 col">
                <div className="py-2 px-2">
                    <FA className={cn} size={size} name={(td && td.icon) || 'envelope'} />
                </div>
            </div>
            <div className="col-sm-9 order-sm-2 col-12 order-3">
                <div className='py-2 px-2'>
                    {caption}
                    <small>{discription}</small>
                </div>
            </div>

            <div className="col-sm-2 order-sm-3 col order-2" style={light}>
                <div className='py-2 px-2 text-right'>
                    <EasyDate date={date} />
                </div>
            </div>
        </div>
    }
}
*/ 
//# sourceMappingURL=desk.js.map