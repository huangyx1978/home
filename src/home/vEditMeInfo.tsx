import * as React from 'react';
import { VPage, Page, Form, ItemSchema, UiSchema, StringSchema, UiTextItem, UiPasswordItem, ButtonSchema, Edit, ImageSchema, nav, UiImageItem } from 'tonva-tools';
import { CHome } from './cHome';
import mainApi from './mainApi';
import { observable } from 'mobx';

export class VEditMeInfo extends VPage<CHome> {
    private schema:ItemSchema[] = [
        {name:'nick', type:'string'} as StringSchema,
        {name:'icon', type:'image'} as ImageSchema
    ];
    private uiSchema:UiSchema = {
        items: {
            nick: {widget:'text', label:'别名', placeholder:'好的别名更方便记忆'} as UiTextItem,
            icon: {widget:'image', label:'头像'} as UiImageItem,
        }
    }
    @observable private data:any;

    async open() {
        let {nick, icon} = nav.user;
        this.data = {
            nick: nick,
            icon: icon,
        }
        this.openPage(this.page);
    }

    private onItemChanged = async (itemSchema:ItemSchema, newValue:any, preValue:any) => {
        let {name} = itemSchema;
        await mainApi.userSetProp(name, newValue);
        this.data[name] = newValue;
        nav.user[name] = newValue;
        nav.saveLocalUser();
    }

    private page = ():JSX.Element => {
        return <Page header="个人信息">
            <Edit schema={this.schema} uiSchema={this.uiSchema}
                data={this.data}
                onItemChanged={this.onItemChanged} />
        </Page>;
    }
}
