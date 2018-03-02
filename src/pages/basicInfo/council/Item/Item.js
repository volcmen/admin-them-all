import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
    Alert,
    Modal,
    ModalHeader,
    ModalFooter,
    Row,
    Col,
    Card,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    CardTitle,
    CardImg,
    InputGroup,
    InputGroupAddon,
    Input,
    Button,
} from 'reactstrap';

import history from '../../../../history';

import config from '../../../../config';

import uploadToS3 from '../../../../helpers/uploadToS3';

import s from './Item.scss';

import Loading from '../../../../components/Loading/Loading';
import Uploading from '../../../../components/Uploading/Uploading';

class Item extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        link: PropTypes.string,
    };

    static defaultProps = {
        link: null,
    };

    constructor() {
        super();
        this.toggleModal = this.toggleModal.bind(this);
        this.showAlert = this.showAlert.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.imageChange = this.imageChange.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.sendSave = this.sendSave.bind(this);
        this.deletePerson = this.deletePerson.bind(this);
        this.state = {
            person: null,
            alertVisible: false,
            alertMSG: null,
            alertColor: null,
            isUpdating: false,
            modalIsOpen: false,
        };
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        if (id === 'new')
            return this.setState({ person: { _id: 'new' } });


        const fetchConf = {
            headers: {
                Authorization: localStorage.id_token,
                Link: this.props.link,
            },
        };

        return fetch(`${config.api.apiRest}/requests/getPersonnel/${id}`, fetchConf)
            .then(response => response.json())
            .then(responseJson => this.setState({ person: responseJson }))
            .catch((error) => {
                console.error(error);
                return this.showAlert('danger', error);
            });
    }

    toggleModal() {
        this.setState({
            modalIsOpen: !this.state.modalIsOpen,
        });
    }

    showAlert(color, message) {
        return this.setState({
            alertVisible: true,
            alertMSG: message,
            alertColor: color,
            isUpdating: false,
        });
    }

    closeAlert() {
        this.setState({ alertVisible: false });
    }

    inputChange(e) {
        const { name, value } = e.target;
        this.setState(prevState => ({
            person: {
                ...prevState.person,
                [name]: value,
            },
        }));
    }

    imageChange(e) {
        const { name, files } = e.target;
        const self = this;

        if (files.length === 1)
            uploadToS3(name, files[0])
                .then((res) => {
                    this.setState(prevState => ({
                        person: {
                            ...prevState.person,
                            image: res,
                        },
                    }));
                    return self.showAlert('success', 'Image uploaded');
                })
                .catch((err) => {
                    console.error('uplaod error', err);
                    return self.showAlert('danger', err);
                });
         else if (files.length > 1)
            files.map(file => uploadToS3(name, file)
                .then((res) => {
                    self.setState(prevState => ({
                        person: {
                            ...prevState.article,
                            images: [...prevState.person.images, res],
                        },
                    }));
                })
                .catch((err) => {
                    console.error('uplaod error', err);
                    self.showAlert('danger', err);
                }));


        return self.showAlert('info', 'Image has not selected');
    }

    sendSave() {
        this.setState({ isUpdating: true });
        const { person } = this.state;
        person.dateUpdated = new Date().toJSON();

        const fetchConf = {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: localStorage.id_token,
                Link: this.props.link,
            },
            body: JSON.stringify(person),
        };

        return fetch(`${config.api.apiRest}/requests/updatePersonnel/${this.props.match.params.id}`, fetchConf)
            .then((response) => {
                if (response.ok)
                    return this.showAlert('success', 'Updated');


                return this.showAlert('warning', response.statusText);
            })

            .catch((error) => {
                console.error(error);
                return this.showAlert('danger', error);
            });
    }

    deletePerson() {
        const fetchConf = {
            method: 'delete',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: localStorage.id_token,
                Link: this.props.link,
            },
        };

        return fetch(`${config.api.apiRest}/requests/deletePersonnel/${this.props.match.params.id}`, fetchConf)
            .then((response) => {
                if (response.ok)
                    return history.push('/');


                return this.showAlert('warning', response.statusText);
            })

            .catch((error) => {
                console.error(error);
                return this.showAlert('danger', error);
            });
    }

    render() {
        const { person } = this.state;

        if (this.state.isUpdating)
            return (
                <Uploading />
            );


        if (!person)
            return (
                <Loading />
            );


        return (
            <div>
                <Alert isOpen={this.state.alertVisible} toggle={this.closeAlert} color={this.state.alertColor}>{this.state.alertMSG}</Alert>

                <Modal isOpen={this.state.modalIsOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Confirmation to delete</ModalHeader>

                    <ModalFooter>
                        <Button color="danger" onClick={this.deletePerson}>Yes, Delete this shit</Button>{' '}
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Card body outline color="primary" className="mt-2">
                    <Row className={s.ItemElems}>
                        <Col md="4">
                            <Button color="success" className={s.ContrlButtons} onClick={this.sendSave}>Save</Button>
                        </Col>
                        <Col md="4">
                            <Link to="/app/basic-information/academic-council">
                                <Button color="secondary" className={s.ContrlButtons}>Close</Button>
                            </Link>
                        </Col>
                        {this.state.person._id !== 'new' &&
                        <Col md="4">
                            <Button color="danger" className={s.ContrlButtons} onClick={this.toggleModal}>Delete</Button>
                        </Col>
                        }
                    </Row>

                    <Row>
                        <p className="h4 m-3">Status</p>
                        <UncontrolledDropdown className={s.ItemElems}>
                            <DropdownToggle caret>
                                {person.status}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem name="status" className="DropDownStatusActive" value="Active" onClick={this.inputChange}>Active</DropdownItem>
                                <DropdownItem name="status" className="DropDownStatusEditing" value="Editing" onClick={this.inputChange}>Editing</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Row>

                    <InputGroup className={s.ItemElems}>
                        <InputGroupAddon>First Name</InputGroupAddon>
                        <Input name="firstName" placeholder="Enter First Name" value={person.firstName} onChange={this.inputChange} />
                    </InputGroup>
                    <InputGroup className={s.ItemElems}>
                        <InputGroupAddon>Last Name</InputGroupAddon>
                        <Input name="lastName" placeholder="Enter Last Name" value={person.lastName} onChange={this.inputChange} />
                    </InputGroup>
                    <InputGroup className={s.ItemElems}>
                        <InputGroupAddon>Phone</InputGroupAddon>
                        <Input name="phone" placeholder="+0 (000) 000-00-00" value={person.phone} onChange={this.inputChange} />
                    </InputGroup>
                    <InputGroup className={s.ItemElems}>
                        <InputGroupAddon>Role</InputGroupAddon>
                        <Input name="role" placeholder="Enter role" value={person.role} onChange={this.inputChange} />
                    </InputGroup>

                    <Row className={s.ItemElems}>
                        <Col md="6">
                            <Card body outline color="primary">
                                <CardTitle>Image</CardTitle>
                                <CardImg width="100%" src={person.image} />
                                <Input name="images" type="file" accept="image/*" onChange={this.imageChange} />

                                <InputGroup className={s.ItemElems}>
                                    <InputGroupAddon>Image Link</InputGroupAddon>
                                    <Input name="image" placeholder="Enter Image link" value={person.image} onChange={this.inputChange} />
                                </InputGroup>
                            </Card>
                        </Col>
                    </Row>
                </Card>

            </div>
        );
    }
}

const mapStateToProps = store => ({
    isFetching: store.dataMD.isFetching,
    link: store.sites.site,
});

export default withRouter(connect(mapStateToProps)(withStyles(s)(Item)));
