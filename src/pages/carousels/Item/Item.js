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
    CardTitle,
    CardImg,
    InputGroup,
    InputGroupAddon,
    Input,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Button,
} from 'reactstrap';

import history from '../../../history';

import config from '../../../config';

import uploadToS3 from '../../../helpers/uploadToS3';
import ItemStatuses from '../../../components/ItemStatuses/ItemStatuses';

import s from './Item.scss';

import Loading from '../../../components/Loading/Loading';
import Uploading from '../../../components/Uploading/Uploading';

class CarouselItem extends Component {
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
        this.deleteCarousel = this.deleteCarousel.bind(this);
        this.state = {
            carousel: null,
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
            return this.setState({ carousel: { _id: 'new' } });


        const fetchConf = {
            headers: {
                Authorization: localStorage.id_token,
                Link: this.props.link,
            },
        };

        return fetch(`${config.api.apiRest}/requests/getCarousel/${id}`, fetchConf)
            .then(response => response.json())
            .then(responseJson => this.setState({ carousel: responseJson }))
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
            carousel: {
                ...prevState.carousel,
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
                        carousel: {
                            ...prevState.carousel,
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
                        carousel: {
                            ...prevState.article,
                            images: [...prevState.carousel.images, res],
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
        const { carousel } = this.state;
        carousel.dateUpdated = new Date().toJSON();

        const fetchConf = {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: localStorage.id_token,
                Link: this.props.link,
            },
            body: JSON.stringify(carousel),
        };

        return fetch(`${config.api.apiRest}/requests/updateCarousel/${this.props.match.params.id}`, fetchConf)
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

    deleteCarousel() {
        const fetchConf = {
            method: 'delete',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: localStorage.id_token,
                Link: this.props.link,
            },
        };

        return fetch(`${config.api.apiRest}/requests/deleteCarousel/${this.props.match.params.id}`, fetchConf)
            .then((response) => {
                if (response.ok)
                    return history.push('/app/carousels');


                return this.showAlert('warning', response.statusText);
            })

            .catch((error) => {
                console.error(error);
                return this.showAlert('danger', error);
            });
    }

    render() {
        const { carousel } = this.state;

        if (this.state.isUpdating)
            return (
                <Uploading />
            );


        if (!carousel)
            return (
                <Loading />
            );


        return (
            <div>
                <Alert isOpen={this.state.alertVisible} toggle={this.closeAlert} color={this.state.alertColor}>{this.state.alertMSG}</Alert>

                <Modal isOpen={this.state.modalIsOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Confirmation to delete</ModalHeader>

                    <ModalFooter>
                        <Button color="danger" onClick={this.deleteCarousel}>Yes, Delete this shit</Button>{' '}
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Card body outline color="primary" className="mt-2">
                    <ItemStatuses itemId={this.state.carousel._id} save={this.sendSave} closeLink="carousels" tgModal={this.toggleModal} />

                    <InputGroup className={s.ItemElems}>
                        <InputGroupAddon>Description</InputGroupAddon>
                        <Input name="description" placeholder="Enter description" value={carousel.description} onChange={this.inputChange} />
                    </InputGroup>
                    <InputGroup className={s.ItemElems}>
                        <InputGroupAddon>Link</InputGroupAddon>
                        <Input name="link" placeholder="Enter link" value={carousel.link} onChange={this.inputChange} />
                    </InputGroup>
                    <Row>
                        <p className="h4 m-3">Status</p>
                        <UncontrolledDropdown className={s.ItemElems}>
                            <DropdownToggle caret>
                                {carousel.status}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem name="status" className="DropDownStatusActive" value="Active" onClick={this.inputChange}>Active</DropdownItem>
                                <DropdownItem name="status" className="DropDownStatusEditing" value="Editing" onClick={this.inputChange}>Editing</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Row>

                    <Row className={s.ItemElems}>
                        <Col md="12">
                            <Card body outline color="primary">
                                <CardTitle>Image</CardTitle>
                                <CardImg width="100%" src={carousel.image} />
                                <Input name="images" type="file" accept="image/*" onChange={this.imageChange} />

                                <InputGroup className={s.ItemElems}>
                                    <InputGroupAddon>Image Link</InputGroupAddon>
                                    <Input name="image" placeholder="Enter Image link" value={carousel.image} onChange={this.inputChange} />
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

export default withRouter(connect(mapStateToProps)(withStyles(s)(CarouselItem)));
