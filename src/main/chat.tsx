import * as React from 'react';
import {Page} from 'tonva-tools';
import {store} from '../store';

export class Chat extends React.Component {
    render() {
        return <Page header={store.unit.name}>
            Chat
        </Page>;
    }
}
