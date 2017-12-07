import * as React from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import * as t from 'tonva-tools';
import AppView from './main';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import {NavView, nav, Page, Api} from 'tonva-tools';

/*
const logo = require('./logo.svg');
const apiHost = process.env.REACT_APP_APIHOST;

class TieApi extends Api {
  list(param: {start: number; pageSize: number}): Promise<any> {
    return this.get('/list', param);
  }
}
const tieApi = new TieApi('tv/tie');
*/
/*
class LoginView extends React.Component {
  render() {
    return (
    <Page header="login">
      Login
      <i className="fa fa-spinner fa-spin fa-3x fa-fw" />
      <span className="sr-only">Loading...</span>
    </Page>);
  }
}*/
/*
class A {
  @observable name: string = 'k';
}

let a = new A();

@observer
class AppView extends React.Component {
  logout() {
    nav.logout();
  }
  setUserName() {
    //a.name = 'bbbbbbb';
    nav.user = {id: 111, name:'kkk', token: 't'};
  }
  render() {
    return <Page>
      <p>App</p>
      <p>user: {nav.user.id} {nav.user.name}</p>
      <p>A-name: {a.name}</p>
      <button onClick={() => this.setUserName()}>change user</button>
      <button onClick={()=>this.logout()}>log out</button>
    </Page>;
  }
}
*/
// nav.setViews(<LoginView />, <AppView />);

class App extends React.Component {
  render() {
    return (<NavView view={<AppView />} />);
    /*
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>apiHost: {apiHost}</p>
      </div>
    );*/
  }
}

export default App;
