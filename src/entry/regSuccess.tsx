import * as React from 'react';
import { Container, Button, Form } from 'reactstrap';
import { nav, Page } from 'tonva-tools';
import userApi from './userApi';
import './style.css';

interface Props {
    user: string;
    pwd: string;
}

export default class RegSuccess extends React.Component<Props, null> {
    failed() {
        return;
    }
    login() {
        const {user, pwd} = this.props;
        userApi
            .login({user: user, pwd: pwd})
            .then(retUser => {
                if (retUser === undefined) {
                    this.failed();
                    return;
                }
                nav.logined(retUser);
            });
    }

    render() {
        const {user, pwd} = this.props;
        return (
        <Page header={false}>
            <Container className="entry-form">
                <Form>
                    <span className="info">
                        用户 <strong>{user} </strong> 注册成功！
                    </span>
                    <Button
                        color="success"
                        block={true}
                        onClick={() => this.login()}
                    >
                        直接登录
                    </Button>
                </Form>
            </Container>
        </Page>
        );
    }
}
