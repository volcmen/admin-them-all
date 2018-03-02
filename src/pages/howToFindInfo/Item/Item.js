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
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Card,
    CardTitle,
    CardImg,
    InputGroup,
    InputGroupAddon,
    Input,
    Button,
} from 'reactstrap';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
} from 'react-google-maps';

import history from '../../../history';
import config from '../../../config';
import ItemStatuses from '../../../components/ItemStatuses/ItemStatuses';

import uploadToS3 from '../../../helpers/uploadToS3';

import s from './Item.scss';

import Loading from '../../../components/Loading/Loading';
import Uploading from '../../../components/Uploading/Uploading';


class Item extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        link: PropTypes.string,
    };

    static defaultProps = {
        link: null,
    };

    static MapWithAMarker = withScriptjs(withGoogleMap(props =>
        (<GoogleMap
            defaultZoom={16}
            defaultCenter={{ lat: props.location.lat, lng: props.location.lng }}
            onClick={props.markerClicked}
        >
            <Marker
                position={{ lat: props.location.lat, lng: props.location.lng }}
            />
         </GoogleMap>)));

    constructor() {
        super();
        this.toggleModal = this.toggleModal.bind(this);
        this.imageChange = this.imageChange.bind(this);
        this.showAlert = this.showAlert.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.inputChangeContactInfo = this.inputChangeContactInfo.bind(this);
        this.sendSave = this.sendSave.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.mapClicked = this.mapClicked.bind(this);
        this.state = {
            item: null,
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
            return this.setState({ item: { _id: 'new' } });


        const fetchConf = {
            headers: {
                Authorization: localStorage.id_token,
                Link: this.props.link,
            },
        };

        return fetch(`${config.api.apiRest}/requests/getHowToFindInfo/${id}`, fetchConf)
            .then(response => response.json())
            .then(responseJson => this.setState({ item: responseJson }))
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
            item: {
                ...prevState.item,
                [name]: value,
            },
        }));
    }

    inputChangeContactInfo(e) {
        const { name, value } = e.target;
        this.setState(prevState => ({
            item: {
                ...prevState.item,
                contactInfo: {
                    ...prevState.item.contactInfo,
                    [name]: value,
                },
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
                        item: {
                            ...prevState.item,
                            backImage: res,
                        },
                    }));
                    return self.showAlert('success', 'Image uploaded');
                })
                .catch((err) => {
                    console.error('uplaod error', err);
                    return self.showAlert('danger', err);
                });


        return self.showAlert('info', 'Image has not selected');
    }

    sendSave() {
        this.setState({ isUpdating: true });
        const { item } = this.state;
        item.dateUpdated = new Date().toJSON();

        const fetchConf = {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: localStorage.id_token,
                Link: this.props.link,
            },
            body: JSON.stringify(item),
        };

        return fetch(`${config.api.apiRest}/requests/updateHowToFindInfo/${this.props.match.params.id}`, fetchConf)
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

    deleteItem() {
        const fetchConf = {
            method: 'delete',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: localStorage.id_token,
                Link: this.props.link,
            },
        };

        return fetch(`${config.api.apiRest}/requests/deleteHowToFindInfo/${this.props.match.params.id}`, fetchConf)
            .then((response) => {
                if (response.ok)
                    return history.push('/app/how-to-find');


                return this.showAlert('warning', response.statusText);
            })

            .catch((error) => {
                console.error(error);
                return this.showAlert('danger', error);
            });
    }

    mapClicked(value) {
        const { lat, lng } = value.latLng;
        const latNum = lat(),
            lngNum = lng();

        this.setState(prevState => ({
            item: {
                ...prevState.item,
                location: { lat: latNum, lng: lngNum },
            },
        }));
    }

    render() {
        const { item } = this.state;

        if (this.state.isUpdating)
            return (
                <Uploading />
            );


        if (!item)
            return (
                <Loading />
            );


        return (
            <div>
                <Alert isOpen={this.state.alertVisible} toggle={this.closeAlert} color={this.state.alertColor}>{this.state.alertMSG}</Alert>

                <Modal isOpen={this.state.modalIsOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Confirmation to delete</ModalHeader>

                    <ModalFooter>
                        <Button color="danger" onClick={this.deleteItem}>Yes, Delete this shit</Button>{' '}
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Card body outline color="primary" className="mt-2">
                    <ItemStatuses itemId={this.state.item._id} save={this.sendSave} closeLink="how-to-find" tgModal={this.toggleModal} />

                    <Row>
                        <p className="h4 m-3">Status</p>
                        <UncontrolledDropdown className={s.ItemElems}>
                            <DropdownToggle caret>
                                {item.status}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem name="status" className="DropDownStatusActive" value="Active" onClick={this.inputChange}>Active</DropdownItem>
                                <DropdownItem name="status" className="DropDownStatusEditing" value="Editing" onClick={this.inputChange}>Editing</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Row>

                    <InputGroup className={s.ItemElems}>
                        <InputGroupAddon>E-Mail</InputGroupAddon>
                        <Input name="mail" type="email" placeholder="Enter Email" value={item.contactInfo.mail} onChange={this.inputChangeContactInfo} />
                    </InputGroup>
                    <InputGroup className={s.ItemElems}>
                        <InputGroupAddon>Phone</InputGroupAddon>
                        <Input name="phone" placeholder="Enter phone" value={item.contactInfo.phone} onChange={this.inputChangeContactInfo} />
                    </InputGroup>
                    <InputGroup className={s.ItemElems}>
                        <InputGroupAddon>Address</InputGroupAddon>
                        <Input name="address" placeholder="Enter Address" value={item.contactInfo.address} onChange={this.inputChangeContactInfo} />
                    </InputGroup>

                    <Row>
                        <Col md="6">
                            <Card body outline color="primary">
                                <CardTitle>Back Image</CardTitle>
                                <CardImg width="100%" src={item.backImage} />
                                <Input name="backImage" type="file" accept="image/*" onChange={this.imageChange} />

                                <InputGroup className={s.ItemElems}>
                                    <InputGroupAddon>Image Link</InputGroupAddon>
                                    <Input name="backImage" placeholder="Enter Image link" value={item.backImage} onChange={this.inputChange} />
                                </InputGroup>
                            </Card>
                        </Col>

                        <Col md="6">
                            <Item.MapWithAMarker
                                location={item.location}
                                markerClicked={this.mapClicked}
                                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCPnT4izrUSzFICY3Wy3Vrq-kWBC2paE-A&language=ru&region=RU"
                                loadingElement={<div style={{ height: '100%' }} />}
                                containerElement={<div style={{ height: '500px' }} />}
                                mapElement={<div style={{ height: '100%' }} />}
                            />
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
