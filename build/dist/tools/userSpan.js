var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import { observer } from 'mobx-react';
import * as className from 'classnames';
import { store } from 'store';
let UserSpan = class UserSpan extends React.Component {
    constructor(props) {
        super(props);
        //this.onClick = this.onClick.bind(this);
    }
    componentWillMount() {
        let { id } = this.props;
        store.cacheUsers.get(id);
    }
    /*
    onClick(evt) {
        evt.preventDefault();
        nav.push(<ApiInfo id={this.props.id} />);
        return false;
    }*/
    render() {
        let { id, className: cn } = this.props;
        let user = store.cacheUsers.get(id);
        let content;
        if (user === null) {
            content = id;
        }
        else {
            let { name, nick } = user;
            let disc = nick && ('- ' + nick);
            if (name !== undefined) {
                content = React.createElement(React.Fragment, null,
                    name,
                    " ",
                    React.createElement("small", { className: "text-muted" }, disc));
            }
            else {
                content = id;
            }
        }
        return React.createElement("span", { className: className(cn) }, content);
    }
};
UserSpan = __decorate([
    observer
], UserSpan);
export { UserSpan };
//# sourceMappingURL=userSpan.js.map