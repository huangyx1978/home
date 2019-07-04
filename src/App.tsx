import * as React from 'react';
import {NavView, nav} from 'tonva';
import { CHome } from 'home';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

class App extends React.Component {
    async onLogined() {
        nav.clear();
        let cHome = new CHome(undefined);
        await cHome.start();
    }
    render() {
        return (<NavView onLogined={this.onLogined} />);
    }
}

export default App;
