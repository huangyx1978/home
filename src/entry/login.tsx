import * as React from 'react';
import {Form, Input, Container, Button, Row, Col} from 'reactstrap';
import * as classNames from 'classnames';
import {nav, Page} from 'tonva-tools';
import RegisterView from './register';
import RegisterSuccess from './regSuccess';
import Forget from './forget';
import userApi from './userApi';
import './style.css';

interface Values {
    username: string;
    password: string;
}

interface State {
    values: Values;
    hasError: boolean;
    disabled: boolean;
}
export default class Login extends React.Component<{}, State> {
    private values: Values = {
        username: '',
        password: '',
    };
    private inputUser: HTMLInputElement;
    private inputPassword: HTMLInputElement;
    private timeOut?: NodeJS.Timer;

    constructor(props) {
        super(props);
        this.state = {
            values: this.values,
            hasError: false,
            disabled: true,
        };
        this.onSubmit = this.onSubmit.bind(this);
    }
    click() {
        nav.replace(<RegisterView />);
    }
    inputChange(event: any) {
        const target = event.target;
        const inputValue = target.type === 'checkbox' ? target.checked : target.value;
        const inputName = target.name;
        this.values[inputName] = inputValue;
        let {username, password} =  this.values;
        let disabled = username.trim().length===0 || password.length===0;
        this.setState({
            values: this.values,
            disabled: disabled,
        });        
    }
    inputFocus(event: any) {
        this.setState({hasError: false});
        if (this.timeOut !== undefined) {
            clearTimeout(this.timeOut);
            this.timeOut = undefined;
        }
    }
    /*
    submit() {
        let {username, password} = this.values;
        userApi.login({
            user: username, 
            pwd: password
        }).then(user => {
            if (user === undefined) {
                this.failed();
            } else {
                app.logined(user);
                // this.succeed(user);
            }
        });
        return false;
    }*/
    async onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        let {username, password} = this.values;
        let user = await userApi.login({
            user: username, 
            pwd: password
        });
        if (user === undefined) {
            this.failed();
        } else {
            nav.logined(user);
            // this.succeed(user);
        }
    }
    private failed() {
        this.values.username = '';
        this.values.password = '';
        this.setState({
            values: this.values,
            hasError: true,
            disabled: true,
        });
        this.timeOut = global.setTimeout(
            () => {
                this.setState({hasError: false});
                global.clearTimeout(this.timeOut);
                this.timeOut = undefined;
            }, 
            3000);
    }
    render() {
        let {hasError, values, disabled} = this.state;
        let {username, password} = values;
        let footer = <div className='text-center'>
            <Button color="link" style={{margin:'0px auto'}}
                onClick={() => nav.push(<RegisterView />)}>
                如果没有账号，请注册
            </Button>
        </div>;

        return (<Page header={false} footer={footer}>
        <Container className='entry-form'>
            <Form onSubmit={this.onSubmit}>
                <header>
                    <img src='/img/logo.png' />
                    <span>同花</span>
                </header>
                <Input type='text' placeholder="用户名..."
                    name='username'
                    value={username}
                    onChange={e => this.inputChange(e)}
                    onFocus={e => this.inputFocus(e)} />
                <Input type='password' placeholder="密码..."
                    name='password'
                    value={password}
                    onChange={e => this.inputChange(e)}
                    onFocus={e => this.inputFocus(e)} />
                <span className={classNames(hasError===false? 'hidden-xs-up':undefined)}>用户名或密码错！</span>
                <Button
                    type='submit'
                    disabled={disabled}
                    block={true}
                    color='success'>登录</Button>
                <div style={{display:'flex', alignItems:'center'}}>
                    <Button color="link" block={true}
                        onClick={() => nav.push(<Forget />)}>
                        忘记密码
                    </Button>
                </div>
            </Form>
        </Container>
        </Page>
        );
    }
}

/*
<Container>
<div className="row">
    <div className="col-sm-12 col-sm-offset-3 form-box">
        <div className="form-bottom">
            <form role="form" action="" method="post" className="login-form">
                <div className="form-group">
                    <label className="sr-only" htmlFor="form-username" 
                        style={{color: 'black'}}>Username</label>
                    <input ref={input => this.inputUser = input}
                        type="text" name="username" 
                        placeholder="用户名..." 
                        className="form-username form-control" id="form-username"
                        onChange={e => this.inputChange(e)}
                        onFocus={e => this.inputFocus(e)}
                        value={this.state.username} />
                </div>
                <div className="form-group">
                    <label className="sr-only" htmlFor="form-password">密码</label>
                    <input ref={input => this.inputPassword = input}
                        type="password" name="password" 
                        placeholder="密码..." 
                        className="form-password form-control" id="form-password"
                        onChange={e => this.inputChange(e)}
                        onFocus={e => this.inputFocus(e)}
                        value={this.state.password} />
                </div>
                <button type="button" className="btn btn-success" 
                    onClick={() => this.submit()}>登录</button>
                {
                    this.state.errorUserOrPassword ?
                    (
                        <div style={{color: 'red', marginTop: '8px'}}>
                            用户名或密码错！
                        </div>
                    ) : undefined
                }
            </form>
        </div>
    </div>
</div>

<div className="row">
    <div className="col-sm-6 col-sm-offset-3">
        <button type="button" className="btn btn-link center-block"
            onClick={() => {nav.replace(<RegisterView />); }}>注册新账户</button>
    </div>
</div>

<div className="row">
    <div className="col-sm-6 col-sm-offset-3 social-login">
        <div style={{color: 'black'}}>或者用下面方式登录:</div>
        <div className="social-login-buttons">
            <a className="btn btn-link-1 btn-link-1-facebook" href="#">
                <i className="fa fa-facebook" />
            </a>
            <a className="btn btn-link-1 btn-link-1-twitter" href="#">
                <i className="fa fa-twitter" />
            </a>
            <a className="btn btn-link-1 btn-link-1-google-plus" href="#">
                <i className="fa fa-google-plus" />
            </a>
        </div>
    </div>
</div>
</Container>
</div>
*/