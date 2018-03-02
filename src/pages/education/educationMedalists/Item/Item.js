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
    InputGroup,
    InputGroupAddon,
    Input,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Card,
    Button,
} from 'reactstrap';

import history from '../../../../history';
import config from '../../../../config';
import ItemStatuses from '../../../../components/ItemStatuses/ItemStatuses';

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
        this.inputChange = this.inputChange.bind(this);
        this.sendSave = this.sendSave.bind(this);
        this.deleteDocument = this.deleteDocument.bind(this);
        this.state = {
            document: null,
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
            return this.setState({ document: { _id: 'new' } });


        const fetchConf = {
            headers: {
                Authorization: localStorage.id_token,
                Link: this.props.link,
            },
        };

        return fetch(`${config.api.apiRest}/requests/getEdMedalist/${id}`, fetchConf)
            .then(response => response.json())
            .then(responseJson => this.setState({ document: responseJson }))
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
            document: {
                ...prevState.document,
                [name]: value,
            },
        }));
    }

    sendSave() {
        this.setState({ isUpdating: true });
        const { document } = this.state;
        document.dateUpdated = new Date().toJSON();

        const fetchConf = {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: localStorage.id_token,
                Link: this.props.link,
            },
            body: JSON.stringify(document),
        };

        return fetch(`${config.api.apiRest}/requests/updateEdMedalist/${this.props.match.params.id}`, fetchConf)
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

    deleteDocument() {
        const fetchConf = {
            method: 'delete',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: localStorage.id_token,
                Link: this.props.link,
            },
        };

        return fetch(`${config.api.apiRest}/requests/deleteEdMedalist/${this.props.match.params.id}`, fetchConf)
            .then((response) => {
                if (response.ok)
                    return history.push('/app/education/medalists');


                return this.showAlert('warning', response.statusText);
            })

            .catch((error) => {
                console.error(error);
                return this.showAlert('danger', error);
            });
    }

    render() {
        const { document } = this.state;

        if (this.state.isUpdating)
            return (
                <Uploading />
            );


        if (!document)
            return (
                <Loading />
            );


        return (
            <div>
                <Alert isOpen={this.state.alertVisible} toggle={this.closeAlert} color={this.state.alertColor}>{this.state.alertMSG}</Alert>

                <Modal isOpen={this.state.modalIsOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Confirmation to delete</ModalHeader>

                    <ModalFooter>
                        <Button color="danger" onClick={this.deleteDocument}>Yes, Delete this shit</Button>{' '}
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Card body outline color="primary" className="mt-2">
                    <ItemStatuses itemId={this.state.document._id} save={this.sendSave} closeLink="education/medalists" tgModal={this.toggleModal} />

                    <InputGroup className={s.ItemElems}>
                        <InputGroupAddon>First name</InputGroupAddon>
                        <Input name="firstName" placeholder="Enter firstName" value={document.firstName} onChange={this.inputChange} />
                    </InputGroup>
                    <InputGroup className={s.ItemElems}>
                        <InputGroupAddon>Last name</InputGroupAddon>
                        <Input name="lastName" placeholder="Enter lastName" value={document.lastName} onChange={this.inputChange} />
                    </InputGroup>
                    <InputGroup className={s.ItemElems}>
                        <InputGroupAddon>Year</InputGroupAddon>
                        <Input name="year" type="number" placeholder="1990" value={document.year} onChange={this.inputChange} />
                    </InputGroup>

                    <Row>
                        <p className="h4 m-3">Medal type</p>
                        <UncontrolledDropdown className={s.ItemElems}>
                            <DropdownToggle caret>
                                {document.medalType}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem name="medalType" className={s.DropDownMedalGold} value="Active" onClick={this.inputChange}>Gold</DropdownItem>
                                <DropdownItem name="medalType" className={s.DropDownMedalSilver} value="Editing" onClick={this.inputChange}>Silver</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Row>

                    <Row>
                        <p className="h4 m-3">Status</p>
                        <UncontrolledDropdown className={s.ItemElems}>
                            <DropdownToggle caret>
                                {document.status}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem name="status" className="DropDownStatusActive" value="Active" onClick={this.inputChange}>Active</DropdownItem>
                                <DropdownItem name="status" className="DropDownStatusEditing" value="Editing" onClick={this.inputChange}>Editing</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
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
