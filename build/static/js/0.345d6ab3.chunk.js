webpackJsonp([0],{

/***/ 218:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_reactstrap__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__register__ = __webpack_require__(220);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__forget__ = __webpack_require__(222);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__userApi__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__index__ = __webpack_require__(5);
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};







class Login extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
    constructor() {
        super(...arguments);
        this.schema = new __WEBPACK_IMPORTED_MODULE_2__ui__["a" /* FormSchema */]({
            fields: [
                {
                    type: 'string',
                    name: 'username',
                    placeholder: '用户名',
                    rules: ['required', 'maxlength:100']
                },
                {
                    type: 'password',
                    name: 'password',
                    placeholder: '密码',
                    rules: ['required', 'maxlength:100']
                },
            ],
            onSumit: this.onLoginSubmit.bind(this),
        });
    }
    onLoginSubmit(values) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield __WEBPACK_IMPORTED_MODULE_5__userApi__["a" /* default */].login({
                user: values['username'],
                pwd: values['password']
            });
            if (user === undefined) {
                //this.failed();
                this.schema.clear();
                this.schema.errors.push('用户名或密码错！');
            }
            else {
                yield __WEBPACK_IMPORTED_MODULE_2__ui__["g" /* nav */].logined(user);
            }
            return undefined;
        });
    }
    click() {
        __WEBPACK_IMPORTED_MODULE_2__ui__["g" /* nav */].replace(__WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3__register__["a" /* default */], { logo: this.props.logo }));
    }
    render() {
        let footer = __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: 'text-center' },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_reactstrap__["a" /* Button */], { color: "link", style: { margin: '0px auto' }, onClick: () => __WEBPACK_IMPORTED_MODULE_2__ui__["g" /* nav */].push(__WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3__register__["a" /* default */], { logo: this.props.logo })) }, "\u5982\u679C\u6CA1\u6709\u8D26\u53F7\uFF0C\u8BF7\u6CE8\u518C"));
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__ui__["e" /* Page */], { header: false, footer: footer },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { style: {
                    maxWidth: '400px',
                    margin: '20px auto',
                    padding: '0 30px',
                } },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: 'container', style: { display: 'flex', position: 'relative' } },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("img", { className: 'App-logo', src: this.props.logo, style: { height: '60px', position: 'absolute' } }),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { style: { flex: 1,
                            fontSize: 'x-large',
                            alignSelf: 'center',
                            textAlign: 'center',
                            margin: '10px',
                        } }, "\u540C\u82B1")),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { style: { height: '20px' } }),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6__index__["h" /* ValidForm */], { formSchema: this.schema })),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: 'constainer' },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_reactstrap__["a" /* Button */], { color: "link", block: true, onClick: () => __WEBPACK_IMPORTED_MODULE_2__ui__["g" /* nav */].push(__WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4__forget__["a" /* default */], null)) }, "\u5FD8\u8BB0\u5BC6\u7801")));
    }
}
/* harmony export (immutable) */ __webpack_exports__["default"] = Login;

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 219:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__net__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__user__ = __webpack_require__(67);


class UserApi extends __WEBPACK_IMPORTED_MODULE_0__net__["a" /* CenterApi */] {
    login(params) {
        return this.get('login', params)
            .then((token) => {
            if (token !== undefined)
                return Object(__WEBPACK_IMPORTED_MODULE_1__user__["a" /* decodeToken */])(token);
        });
    }
    register(params) {
        return this.post('register', params);
    }
}
/* unused harmony export UserApi */

const userApi = new UserApi('tv/user/');
/* harmony default export */ __webpack_exports__["a"] = (userApi);
//# sourceMappingURL=userApi.js.map

/***/ }),

/***/ 220:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ui__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__login__ = __webpack_require__(218);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__userApi__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__regSuccess__ = __webpack_require__(221);
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





class Register extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
    constructor() {
        super(...arguments);
        this.schema = new __WEBPACK_IMPORTED_MODULE_1__ui__["a" /* FormSchema */]({
            fields: [
                {
                    type: 'string',
                    name: 'user',
                    placeholder: '用户名',
                    rules: ['required', 'maxlength:100']
                },
                {
                    type: 'password',
                    name: 'pwd',
                    placeholder: '密码',
                    rules: ['required', 'maxlength:100']
                },
                {
                    type: 'password',
                    name: 'rePwd',
                    placeholder: '重复密码',
                    rules: ['required', 'maxlength:100']
                },
            ],
            submitText: '注册新用户',
            onSumit: this.onLoginSubmit.bind(this),
        });
        /*
        private values: Values;
        private timeOut: NodeJS.Timer;
        constructor(props: Props) {
            super(props);
            this.values = {
                user: '',
                pwd: '',
                rePwd: '',
            };
            this.state = {
                values: this.values,
                disabled: true,
                pwdError: false,
                regError: undefined,
            };
        }
        click() {
            nav.replace(<LoginView />);
        }
    
        submit() {
            const {user, pwd, rePwd, country, mobile, email} = this.state.values;
            if (pwd !== rePwd) {
                this.setState({
                    pwdError: true,
                });
                this.timeOutError();
                return false;
            }
            userApi.register({
                nick: undefined,
                user: user,
                pwd: pwd,
                country: undefined,
                mobile: undefined,
                email: undefined,
            }).then(ret => {
                let msg;
                switch (ret) {
                    default: throw 'unknown return';
                    case 0:
                        nav.clear();
                        nav.show(<RegSuccess user={user} pwd={pwd} />);
                        return;
                    case 1:
                        msg = '用户名 ' + user + ' ';
                        break;
                    case 2:
                        msg = '手机号 +' + country + ' ' + mobile + ' ';
                        break;
                    case 3:
                        msg = '电子邮件 ' + email + ' ';
                        break;
                }
                this.setState({
                    regError: msg + '已经被注册过了',
                });
                this.timeOutError();
            });
            return false;
        }
        timeOutError() {
            this.timeOut = global.setTimeout(
                () => {
                    this.setState({
                        pwdError: false,
                        regError: undefined,
                    });
                    global.clearTimeout(this.timeOut);
                    this.timeOut = undefined;
                },
                3000);
        }
        inputChange(event: any) {
            const target = event.target;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            this.values[name] = value;
            if (name === 'pwd') {
                this.values.rePwd = '';
            }
            let {user, pwd, rePwd} = this.values;
            this.setState({
                values: this.values,
                disabled: user.trim().length === 0 || pwd.length === 0 || rePwd.length === 0,
            });
        }
        inputFocus(e: any) {
            this.setState({
                pwdError: false,
                regError: undefined,
            });
        }
        render() {
            let {values, disabled, pwdError, regError} = this.state;
            let {user, pwd, rePwd} = values;
            return (
            <Page header="注册">
            <Container className="entry-form">
                <Form>
                    <Input
                        type="text"
                        placeholder="用户名..."
                        name="user"
                        value={user}
                        onChange={e => this.inputChange(e)}
                        onFocus={e => this.inputFocus(e)}
                    />
                    <Input
                        type="password"
                        placeholder="密码..."
                        name="pwd"
                        value={pwd}
                        onChange={e => this.inputChange(e)}
                        onFocus={e => this.inputFocus(e)}
                    />
                    <Input
                        type="password"
                        placeholder="重复密码..."
                        name="rePwd"
                        value={rePwd}
                        onChange={e => this.inputChange(e)}
                        onFocus={e => this.inputFocus(e)}
                    />
                    <span className={this.errorClass(pwdError)}>
                        密码错误！
                    </span>
                    <span className={this.errorClass(regError !== undefined)}>
                        {regError}
                    </span>
                    <Button
                        onClick={() => this.submit()}
                        disabled={disabled}
                        block={true}
                        color="success"
                    >
                        注册新用户
                    </Button>
                </Form>
            </Container>
            </Page>
            );
        }
        private errorClass(error: boolean) {
            if (error === false) { return 'hidden-xs-up'; }
        }
        */
    }
    onLoginSubmit(values) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            let user = await userApi.login({
                user: values['username'],
                pwd: values['password']
            });
            if (user === undefined) {
                //this.failed();
                this.schema.clear();
                this.schema.errors.push('用户名或密码错！');
            } else {
                nav.logined(user);
            }
            return undefined;*/
            //const {user, pwd, rePwd, country, mobile, email} = this.state.values;
            let { user, pwd, rePwd, country, mobile, email } = values;
            if (pwd !== rePwd) {
                this.schema.errors.push('密码不对，请重新输入密码！');
                this.schema.inputs['pwd'].clear();
                this.schema.inputs['rePwd'].clear();
                return undefined;
            }
            let ret = yield __WEBPACK_IMPORTED_MODULE_3__userApi__["a" /* default */].register({
                nick: undefined,
                user: user,
                pwd: pwd,
                country: undefined,
                mobile: undefined,
                email: undefined,
            });
            let msg;
            switch (ret) {
                default: throw 'unknown return';
                case 0:
                    __WEBPACK_IMPORTED_MODULE_1__ui__["g" /* nav */].clear();
                    __WEBPACK_IMPORTED_MODULE_1__ui__["g" /* nav */].show(__WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4__regSuccess__["a" /* default */], { user: user, pwd: pwd }));
                    return;
                case 1:
                    msg = '用户名 ' + user;
                    break;
                case 2:
                    msg = '手机号 +' + country + ' ' + mobile;
                    break;
                case 3:
                    msg = '电子邮件 ' + email;
                    break;
            }
            this.schema.errors.push(msg + ' 已经被注册过了');
            return undefined;
        });
    }
    click() {
        __WEBPACK_IMPORTED_MODULE_1__ui__["g" /* nav */].replace(__WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__login__["default"], { logo: this.props.logo }));
        //nav.replace(<RegisterView />);
    }
    render() {
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__ui__["e" /* Page */], { header: '注册' },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { style: {
                    maxWidth: '400px',
                    margin: '20px auto',
                    padding: '0 30px',
                } },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: 'container', style: { display: 'flex', position: 'relative' } },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("img", { className: 'App-logo', src: this.props.logo, style: { height: '60px', position: 'absolute' } }),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { style: { flex: 1,
                            fontSize: 'x-large',
                            alignSelf: 'center',
                            textAlign: 'center',
                            margin: '10px',
                        } }, "\u540C\u82B1")),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { style: { height: '20px' } }),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__ui__["f" /* ValidForm */], { formSchema: this.schema })));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Register;

/*
            
            <div className="row">
                <div className="col-sm-6 col-sm-offset-3 form-box">
                    <div className="form-bottom">
                        <form role="form" action="" method="post" className="login-form">
                            <div className="form-group">
                                <label className="sr-only" htmlFor="form-username"
                                    style={{color: "black"}}>Username</label>
                                <input type="text" name="user"
                                    ref={input => this.userInput=input}
                                    placeholder="用户名..."
                                    className="form-username form-control"
                                    id="form-username"
                                    onChange={e => this.inputChange(e)}
                                    value={this.state.user} />
                            </div>
                            <div className="form-group">
                                <label className="sr-only" htmlFor="form-password">密码</label>
                                <input type="password" name="pwd"
                                    placeholder="密码..."
                                    className="form-password form-control" id="form-password"
                                    onChange={e => this.inputChange(e)}
                                    value={this.state.pwd} />
                            </div>
                            <div className="form-group">
                                <label className="sr-only" htmlFor="form-password">密码</label>
                                <input type="password" name="rePwd"
                                    placeholder="重复密码..."
                                    className="form-password form-control" id="form-password"
                                    onChange={e => this.inputChange(e)}
                                    value={this.state.rePwd} />
                            </div>
                            <button type="button"
                                className="btn btn-success"
                                onClick={() => this.submit()}>注册新账户</button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6 col-sm-offset-3">
                    <button type="button" className="btn btn-link center-block"
                        onClick={() => {nav.replace(<LoginView />); }}>已有账户，直接登录</button>
                </div>
            </div>
*/ 
//# sourceMappingURL=register.js.map

/***/ }),

/***/ 221:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_reactstrap__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__userApi__ = __webpack_require__(219);
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




class RegSuccess extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
    failed() {
        return;
    }
    login() {
        const { user, pwd } = this.props;
        __WEBPACK_IMPORTED_MODULE_3__userApi__["a" /* default */]
            .login({ user: user, pwd: pwd })
            .then((retUser) => __awaiter(this, void 0, void 0, function* () {
            if (retUser === undefined) {
                this.failed();
                return;
            }
            yield __WEBPACK_IMPORTED_MODULE_2__ui__["g" /* nav */].logined(retUser);
        }));
    }
    render() {
        const { user, pwd } = this.props;
        return (__WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__ui__["e" /* Page */], { header: false },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_reactstrap__["d" /* Container */], { className: "entry-form" },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_reactstrap__["h" /* Form */], null,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { className: "info" },
                        "\u7528\u6237 ",
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("strong", null,
                            user,
                            " "),
                        " \u6CE8\u518C\u6210\u529F\uFF01"),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_reactstrap__["a" /* Button */], { color: "success", block: true, onClick: () => this.login() }, "\u76F4\u63A5\u767B\u5F55")))));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RegSuccess;

//# sourceMappingURL=regSuccess.js.map

/***/ }),

/***/ 222:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ui__ = __webpack_require__(40);


class Forget extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
    render() {
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__ui__["e" /* Page */], { header: '忘记密码' }, "\u6B63\u5728\u8BBE\u8BA1\u4E2D...");
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Forget;

//# sourceMappingURL=forget.js.map

/***/ })

});
//# sourceMappingURL=0.345d6ab3.chunk.js.map