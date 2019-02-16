import * as React from 'react';
import {NavView, nav} from 'tonva-tools';
import AppView from 'main';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { CHome } from 'home';

class App extends React.Component {
    async onLogined() {
        nav.clear();
        let cHome = new CHome(undefined);
        await cHome.start();
        //nav.push(<AppView />);
    }
    render() {
        return (<NavView onLogined={this.onLogined} />);
    }
}

export default App;
