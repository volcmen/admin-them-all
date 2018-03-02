import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router';
import { Alert, InputGroup, InputGroupAddon, Input, Label, Form, FormGroup } from 'reactstrap';

import s from './Login.scss'; // eslint-disable-line
import { loginUser } from '../../actions/user';
import Widget from '../../components/Widget/Widget';

class Login extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        location: PropTypes.object,
        isAuthenticated: PropTypes.bool.isRequired,
        errorMessage: PropTypes.string,
    };

    static defaultProps = {
        location: '',
        errorMessage: '',
    };

    constructor(props) {
        super(props);

        this.state = {
            login: '',
            password: '',
        };

        this.doLogin = this.doLogin.bind(this);
        this.changeLogin = this.changeLogin.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    changeLogin(event) {
        this.setState({ login: event.target.value });
    }

    changePassword(event) {
        this.setState({ password: event.target.value });
    }

    doLogin(e) {
        this.props
            .dispatch(loginUser({ login: this.state.login, password: this.state.password }));
        e.preventDefault();
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: '/app' } };

        if (this.props.isAuthenticated) // cant access login page while logged in

            return (
                <Redirect to={from} />
            );


        return (
            <div className={s.root}>
                <Widget className={`${s.widget}`}>
                    <header className="text-center">
                        <h5 className="fw-semi-bold">Login to your account</h5>
                    </header>
                    <Form className="mt" onSubmit={this.doLogin}>
                        {
                            this.props.errorMessage && ( // eslint-disable-line
                                <Alert className="alert-sm" bsStyle="danger">
                                    {this.props.errorMessage}
                                </Alert>
                            )
                        }
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <InputGroup className="input-group-lg">
                                <InputGroupAddon><i className="fa fa-user" /></InputGroupAddon>
                                <Input
                                    id="email"
                                    className="input-transparent"
                                    value={this.state.login}
                                    onChange={this.changeLogin}
                                    type="text"
                                    required
                                    placeholder="Your Email"
                                />
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <InputGroup className="input-group-lg">
                                <InputGroupAddon><i className="fa fa-lock" /></InputGroupAddon>
                                <Input
                                    type="password"
                                    className="input-lg input-transparent"
                                    id="password"
                                    value={this.state.password}
                                    onChange={this.changePassword}
                                    placeholder="Your Password"
                                />
                            </InputGroup>
                        </FormGroup>
                        <div className={s.formActions}>
                            <button type="submit" className="btn btn-block btn-danger btn-lg">
                  <span className={[s.smallCircle, 'mr-2'].join(' ')}><i
                      className="fa fa-caret-right"
                  />
                  </span>
                                Sign In
                            </button>
                            <a className={s.forgot} href="#">Forgot Username or Password?</a>
                        </div>
                    </Form>
                </Widget>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isFetching: state.auth.isFetching,
    isAuthenticated: state.auth.isAuthenticated,
    errorMessage: state.auth.errorMessage,
});

export default withRouter(connect(mapStateToProps)(withStyles(s)(Login)));
