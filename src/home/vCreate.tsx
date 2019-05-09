import * as React from 'react';
import _ from 'lodash';
import { VPage, Page, Form, ItemSchema, StringSchema, UiSchema, UiTextItem, UiButton, Context, UiCheckItem, BoolSchema } from "tonva-tools";
import { CHome } from "./cHome";
import { FA } from 'tonva-react-form';

const lables = {
    dev: '开发号',
    unit: '小号'
}

export class VCreate extends VPage<CHome> {
    private param: {icon:string, type:string, caption:string}
    async open(param: {icon:string, type:string, caption:string}) {
        this.param = param;
        this.openPage(this.page);
    }

    private page = () => {
        let {type, caption} = this.param;
        let label = lables[type];
        let schema:ItemSchema[] = [
            {name: 'name', type: 'string', maxLength: 50, required: true} as StringSchema,
        ];
        if (type === 'unit') {
            schema.push({name: 'isPublic', type: 'boolean', } as BoolSchema);
        }
        schema.push({name: 'submit', type: 'button'});
        let uiSchema:UiSchema = {
            items: {
                name: {widget: 'text', label: label, placeholder: '区别于其它的唯一名称'} as UiTextItem,
                isPublic: {widget: 'checkbox', label: '公开'} as UiCheckItem,
                submit: {widget: 'button', label: '提交', className:'btn btn-primary'} as UiButton
            }
        };
        return <Page header={caption} back="close">
            <Form onButtonClick={this.onSubmit}
                className="m-3" schema={schema} uiSchema={uiSchema} formData={{isPublic:true}}
                fieldLabelSize={2} />
        </Page>;
    }

    private onSubmit = async (name:string, context: Context): Promise<any> => {
        let data = _.clone(context.data);
        let isPublic = data.isPublic;
        if (isPublic !== undefined) {
            data.isPulic = isPublic === true? 1: 0;
        }
        data.type = this.param.type;
        let ret = await this.controller.unitCreate(data);
        let unitId = ret.unit;
        let error:string;
        switch (unitId) {
            default:
                await this.controller.reloadStickies();
                this.closePage();
                this.openPageElement(<Page>
                    <div className="p-3 text-success">
                        <FA name="check" /> 创建完成
                        <br/>
                        <br/>
                        随后可以进入管理，开启应用，管理用户。
                    </div>
                </Page>);
                return;
            case 0:
                error = '名字已经被使用了';
                break;
            case -1:
                this.closePage();
                this.openPageElement(<Page>
                    <div className="p-3 text-success">
                        <FA name="check" /> 无法创建
                        <br/>
                        <br/>
                        已到创建上限
                    </div>
                </Page>);
                break;
            case -2:
                error = '错误编号: ' + unitId;
                break;
        }
        context.setError('name', error);
    }
}
