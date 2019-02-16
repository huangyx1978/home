import * as React from 'react';
import { VPage, Page, nav } from 'tonva-tools';
import { CHome } from './cHome';

export class VAbout extends VPage<CHome> {
    async showEntry() {
        this.openPage(this.page);
    }

    private page = () => {
        let right = <button className='btn btn-success btn-sm' onClick={this.showLogs}>log</button>;
        return <Page header="关于同花" right={right}>
            <div className='p-3 bg-white h-100'>
                <p>
                    <b><span className="text-primary">同</span><span className="text-danger">花</span>，
                    就要<span className="text-success">顺</span> ！
                    </b>
                </p>
                <p>数据如花，让协作更顺畅</p>
            </div>
        </Page>;
    }
    
    private showLogs = () => {
        this.openPage(this.logs);
    }

    private logs = () => {
        return <Page header="Logs">
            {nav.logs.map((v,i) => {
                return <div key={i} className="px-3 py-1">{v}</div>;
            })}
        </Page>
    }
}
