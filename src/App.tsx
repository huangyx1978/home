import * as React from 'react';
import {NavView, nav} from 'tonva-tools';
import AppView from './main';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

class App extends React.Component {
    async onLogined() {
        nav.clear();
        nav.push(<AppView />);
    }
    render() {
        return (<NavView onLogined={this.onLogined} />);
    }
}

export default App;
