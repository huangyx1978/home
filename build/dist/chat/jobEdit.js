var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { TonvaForm } from 'tonva-react-form';
import { Page, nav } from 'tonva-tools';
import { store } from 'store';
import { TosControl } from './tosControl';
export class JobEdit extends React.Component {
    constructor(props) {
        super(props);
        this.rowTo = {
            label: '接收人',
            //field: {name:'to', type: 'string', required: true},
            //face: {type: 'string', placeholder: '一个或多个接收人'}
            createControl: (form, row) => {
                return this.tosControl = new TosControl(form);
            }
        };
        this.rowSubject = {
            label: '主题',
            field: { name: 'subject', type: 'string', maxLength: 60 },
            face: { type: 'string', placeholder: '简明扼要' }
        };
        this.rowContent = {
            label: '任务描述',
            field: { name: 'discription', maxLength: 200, required: true },
            face: { type: 'textarea', placeholder: '简要说明任务', rows: 6 }
        };
        this.onSubmit = this.onSubmit.bind(this);
        let { templet } = this.props;
        let { content } = templet;
        let { needTo } = content;
        this.rows = [];
        if (needTo === true)
            this.rows.push(this.rowTo);
        //this.rows.push(this.rowSubject);
        this.rows.push(this.rowContent);
    }
    onSubmit(values) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.tosControl !== undefined) {
                if ((yield this.tosControl.confirmInput()) === false)
                    return;
            }
            let { templet } = this.props;
            let chat = store.unit.unitx;
            let type = templet.name;
            let to;
            let subject = values.subject;
            let discription = values.discription;
            switch (type) {
                case '$self':
                    to = [{ toUser: 0 }];
                    break;
                case '$dispatch':
                    to = this.validTos();
                    if (to === undefined)
                        return;
                    break;
            }
            let msg = {
                type: type,
                subject: subject,
                discription: discription,
                to: to,
            };
            let id = yield chat.newMessage(msg);
            nav.pop();
            return;
        });
    }
    validTos() {
        let { toList } = this.tosControl;
        if (toList === undefined || toList.length === 0) {
            this.tosControl.setError('to', '请输入接收人');
            return;
        }
        return toList.map(v => { return { toUser: v.id }; });
    }
    render() {
        return React.createElement(Page, { header: this.props.templet.caption },
            React.createElement(TonvaForm, { className: "px-3 py-2", formRows: this.rows, onSubmit: this.onSubmit }));
    }
}
//# sourceMappingURL=jobEdit.js.map