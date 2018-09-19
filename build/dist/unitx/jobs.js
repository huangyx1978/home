var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { VmView } from 'tonva-tools';
import { List, LMR, FA, Muted, IconText } from 'tonva-react-form';
import { sysTemplets } from 'store';
/*
export interface JobsPageState {
    templets: Templet[];
}
*/
export class JobsPage extends VmView {
    constructor() {
        //protected coordinator: CrUnitxUsq;
        super(...arguments);
        this.onClick = () => {
        };
        this.newJob = () => __awaiter(this, void 0, void 0, function* () {
            //let chat = store.unit.unitx;
            let msg = {
                type: 'a',
                content: 'bbbb',
                to: [{ user: 0 }]
            };
            let id = yield this.coordinator.newMessage(msg);
            //nav.pop();
            this.closePage();
        });
        this.rows = [
            '',
            {
                type: 'component',
                component: React.createElement(IconText, { iconClass: "text-info", icon: "envelope", text: "\u65B0\u4EFB\u52A1" }),
                onClick: this.newJob
            },
            '',
            {
                type: 'component',
                component: React.createElement(IconText, { iconClass: "text-info", icon: "envelope", text: "\u5F97\u60F3\u60F3\uFF0C\u600E\u4E48\u505A" }),
            },
            '',
        ];
        /*
        constructor(props) {
            super(props);
            this.state = {
                templets: undefined,
            }
        }
        */
        /*
        async componentWillMount() {
            let templets = await store.unit.unitx.getTemplets();
            if (templets.length > 0) {
                this.setState({
                    templets: templets
                });
            }
        }
        */
        this.renderRow = (templet, index) => {
            let { icon, name, caption, discription } = templet;
            let left = React.createElement(React.Fragment, null,
                React.createElement(FA, { className: "text-success mr-3", name: icon, size: "lg", fixWidth: true }));
            let right = React.createElement(Muted, null, discription);
            return React.createElement(LMR, { className: 'px-3 py-2 align-items-center', left: left, right: right }, caption);
        };
        this.templetClick = (templet) => {
            //nav.push(<JobEdit templet={templet} />);
            this.coordinator.jobEdit(templet);
        };
    }
    render() {
        //let {templets} = this.state;
        let { templets } = this.coordinator;
        return React.createElement("div", null,
            React.createElement(List, { className: "py-2", items: sysTemplets, item: { render: this.renderRow, onClick: this.templetClick } }),
            templets && React.createElement(List, { items: templets, item: { render: this.renderRow, onClick: this.templetClick } }));
    }
}
//# sourceMappingURL=jobs.js.map