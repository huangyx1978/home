import * as React from 'react';
import { VPage, Page, Image } from 'tonva';
import { LMR, Muted } from 'tonva';
import { CHome } from "./cHome";
import ReactMarkdown from 'react-markdown';
import { unitDefaultMarkDown } from './unitDefaultMarkDown';

export class VUnitAbout extends VPage<CHome> {
/*
# Live demo
    这是一段markdown描述的内容。放在unit的discription字段中。
    Changes are automatically rendered as you type.
    * Implements [GitHub Flavored Markdown](https://github.github.com/gfm/)
    * Renders actual, "native" React DOM elements
    * Allows you to escape or skip HTML (try toggling the checkboxes above)
    * If you escape or skip the HTML, no \`dangerouslySetInnerHTML\` is used! Yay!
    ## HTML block below
    <blockquote>
      This blockquote will change based on the HTML settings above.
    </blockquote>
    ## How about some code?
    \`\`\`js
    var React = require('react');
    var Markdown = require('react-markdown');
    React.render(
      <Markdown source="# Your markdown here" />,
      document.getElementById('content')
    );
    \`\`\`
    Pretty neat, eh?
    ## Tables?
    | Feature   | Support |
    | --------- | ------- |
    | tables    | ✔ |
    | alignment | ✔ |
    | wewt      | ✔ |
    ## More info?
    Read usage information and more on [GitHub](//github.com/rexxars/react-markdown)
    ---------------
    A component by [Espen Hovlandsdal](https://espen.codes/)
`;
*/
    async open() {
        this.openPage(this.page);
    }

    clickToAdmin = async () => {
        await this.controller.navToAdmin();
    }

    private page = ():JSX.Element => {
        let {unit} = this.controller;
        let {id, name, nick, discription, apps, icon, ownerName, ownerNick, isOwner, isAdmin} = unit;
        if (ownerNick) ownerNick = '- ' + ownerNick;
        let enterAdmins:any;
        if (isOwner === 1 || isAdmin === 1) {
            enterAdmins = <button 
                className="btn btn-success btn-sm align-self-start" onClick={()=>this.clickToAdmin()}>
                进入管理
            </button>
        }
        let divImg = <div className="mr-3 w-4c h-4c"><Image src={icon} /></div>;

        return <Page header={'关于 ' + (nick || name) }>
            <LMR className="my-3 container-fluid" left={divImg} right={enterAdmins}>
                <div className="mb-3">
                    {nick? <>
                        <div><b>{nick}</b></div>
                        <div className="small text-muted">{name}</div>
                    </>
                    : name}
                </div>
                <div className="row">
                    <label className="small text-dark col-3">发布者：</label>
                    <div className="col-9">{ownerName} {ownerNick}</div>
                </div>
            </LMR>
            <div className="bg-white p-3">
                <ReactMarkdown source={discription || unitDefaultMarkDown} />
            </div>
        </Page>;
    }
}