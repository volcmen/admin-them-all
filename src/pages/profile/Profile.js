import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';

import config from '../../config';


import s from './Profile.scss';

class Profile extends Component {
    static propTypes = {
        userMail: PropTypes.string.isRequired,
    };

    static defaultProps = {};

    constructor() {
        super();
        this.showAlert = this.showAlert.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.toggleModalRegistration = this.toggleModalRegistration.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.sendRegistrateNewUser = this.sendRegistrateNewUser.bind(this);
        this.state = {
            modalRegistrationIsOpen: false,
            alertVisible: false,
            alertColor: '',
            alertMSG: '',
            user: '',
            registrNewUser: '',
        };
    }

    componentDidMount() {
        const fetchConf = {
            headers: {
                Authorization: localStorage.id_token,
            },
        };

        return fetch(`${config.api.apiRest}/entry/profile/${this.props.userMail}`, fetchConf)
            .then(response => response.json())
            .then(responseJson => this.setState({ user: responseJson }))
            .catch((error) => {
                console.error(error);
            });
    }

    showAlert(color, message) {
        return this.setState({
            alertVisible: true,
            alertMSG: message,
            alertColor: color,
        });
    }

    closeAlert() {
        this.setState({ alertVisible: false });
    }

    toggleModalRegistration() {
        return this.setState({
            modalRegistrationIsOpen: !this.state.modalRegistrationIsOpen,
        });
    }

    inputChange(e) {
        const { name, value } = e.target;
        this.setState(prevState => ({
            registrNewUser: {
                ...prevState.registrNewUser,
                [name]: value,
            },
        }));
    }

    sendRegistrateNewUser() {
        const fetchConf = {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: localStorage.id_token,
            },
            body: JSON.stringify(this.state.registrNewUser),
        };

        return fetch(`${config.api.apiRest}/entry/register`, fetchConf)
            .then(response => response.json())
            .then((responseJson) => {
                this.toggleModalRegistration();
                return this.showAlert('success', `Created! ID: ${responseJson._id}`);
            })
            .catch((error) => {
                console.error(error);
                return this.showAlert('danger', error);
            });
    }

    render() {
        const { user, registrNewUser } = this.state;
        return (
            <div>
                <Modal isOpen={this.state.modalRegistrationIsOpen} toggle={this.toggleModalRegistration} className={s.Modal}>
                    <ModalHeader toggle={this.toggleModalRegistration} className={s.ModalHeader}>Registrate new user</ModalHeader>
                    <ModalBody className={s.ModalBody}>
                        <InputGroup className={s.RegistrModalInput}>
                            <InputGroupAddon>Email</InputGroupAddon>
                            <Input name="email" type="email" placeholder="Enter email" value={registrNewUser.email} onChange={this.inputChange} required />
                        </InputGroup>
                        <InputGroup className={s.RegistrModalInput}>
                            <InputGroupAddon>Password</InputGroupAddon>
                            <Input name="password" type="password" placeholder="Enter password" value={registrNewUser.password} onChange={this.inputChange} required />
                        </InputGroup>
                        <InputGroup className={s.RegistrModalInput}>
                            <InputGroupAddon>Account type</InputGroupAddon>
                            <Input name="accountType" placeholder="User" value={registrNewUser.accountType} onChange={this.inputChange} required />
                        </InputGroup>
                    </ModalBody>
                    <ModalFooter className={s.ModalFooter}>
                        <Button
                            disabled={!this.state.registrNewUser.email || !this.state.registrNewUser.password || !this.state.registrNewUser.accountType}
                            color="primary"
                            onClick={this.sendRegistrateNewUser}
                        >Save Me Gently
                        </Button>{' '}
                        <Button color="secondary" onClick={this.toggleModalRegistration}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Alert isOpen={this.state.alertVisible} toggle={this.closeAlert} color={this.state.alertColor}>{this.state.alertMSG}</Alert>


                <h1>Test</h1>
                <h3>Hi {user.email}</h3>

                {user.accountType === 'Admin' &&
                <section>
                    <Button onClick={this.toggleModalRegistration}>Create new user</Button>
                </section>
                }
            </div>
        );
    }
}

const mapStateToProps = store => ({
    userMail: store.auth.user,
    userType: store.auth.accountType,
});

export default withRouter(connect(mapStateToProps)(withStyles(s)(Profile)));
