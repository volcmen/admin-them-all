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

import s from './Item.scss';

import ItemStatuses from '../../../components/ItemStatuses/ItemStatuses';

import Loading from '../../../components/Loading/Loading';
import Uploading from '../../../components/Uploading/Uploading';

class ArticleItem extends Component {
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
        this.selectCategory = this.selectCategory.bind(this);
        this.sendSave = this.sendSave.bind(this);
        this.deleteArticle = this.deleteArticle.bind(this);
        this.deleteImagesImage = this.deleteImagesImage.bind(this);
        this.textChange = this.textChange.bind(this);
        if (typeof document !== 'undefined')
            this.quill = require('react-quill');


        this.state = {
            article: null,
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
            return this.setState({ article: { _id: 'new' } });


        const fetchConf = {
            headers: {
                Authorization: localStorage.id_token,
                Link: this.props.link,
            },
        };

        return fetch(`${config.api.apiRest}/requests/getArticle/${id}`, fetchConf)
            .then(response => response.json())
            .then(responseJson => this.setState({ article: responseJson }))
            .catch((error) => {
                console.error(error);
                return this.showAlert('danger', error);
            });
    }

    CardImgsGen = ({ item }) => (
        <Col md="6">
            <Card body outline color="info">
                <i className={`${s.IconDelete} fa fa-times-circle fa-2x`} onClick={() => this.deleteImagesImage(item)} />
                <img src={item} alt="image" className={s.CardIMGS} />
            </Card>
        </Col>
    );

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
            article: {
                ...prevState.article,
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
                        article: {
                            ...prevState.article,
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
                        article: {
                            ...prevState.article,
                            images: [...prevState.article.images, res],
                        },
                    }));
                })
                .catch((err) => {
                    console.error('uplaod error', err);
                    self.showAlert('danger', err);
                }));


        return self.showAlert('info', 'Image has not selected');
    }

    selectCategory(e) {
        const value = e.target.innerText.toLowerCase();
        this.setState(prevState => ({
            article: {
                ...prevState.article,
                category: value,
            },
        }));
    }

    sendSave() {
        this.setState({ isUpdating: true });
        const { article } = this.state;
        article.dateUpdated = new Date().toJSON();

        const fetchConf = {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: localStorage.id_token,
                Link: this.props.link,
            },
            body: JSON.stringify(article),
        };

        return fetch(`${config.api.apiRest}/requests/updateArticle/${this.props.match.params.id}`, fetchConf)
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

    deleteArticle() {
        const fetchConf = {
            method: 'delete',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: localStorage.id_token,
                Link: this.props.link,
            },
        };

        return fetch(`${config.api.apiRest}/requests/deleteArticle/${this.props.match.params.id}`, fetchConf)
            .then((response) => {
                if (response.ok)
                    return history.push('/app/articles');


                return this.showAlert('warning', response.statusText);
            })

            .catch((error) => {
                console.error(error);
                return this.showAlert('danger', error);
            });
    }

    deleteImagesImage(imgSrc) {
        const imgArr = this.state.article.images;
        imgArr.forEach((elm, idx) => {
            if (elm === imgSrc) {
                imgArr.splice(idx, 1);
                return this.setState(prevState => ({
                    article: {
                        ...prevState.article,
                        images: imgArr,
                    },
                }));
            }
        });
    }

    textChange(value) {
        this.setState(prevState => ({
            article: {
                ...prevState.article,
                text: value,
            },
        }));
    }

    render() {
        const { article } = this.state;
        const ReactQuill = this.quill;

        if (this.state.isUpdating)
            return (
                <Uploading />
            );


        if (!article || !ReactQuill)
            return (
                <Loading />
            );


        return (
            <div>
                <Alert isOpen={this.state.alertVisible} toggle={this.closeAlert} color={this.state.alertColor}>{this.state.alertMSG}</Alert>

                <Modal isOpen={this.state.modalIsOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Confirmation to delete</ModalHeader>

                    <ModalFooter>
                        <Button color="danger" onClick={this.deleteArticle}>Yes, Delete this shit</Button>{' '}
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Card body outline color="primary" className="mt-2">

                    <ItemStatuses itemId={this.state.article._id} save={this.sendSave} closeLink="articles" tgModal={this.toggleModal} />

                    <InputGroup className={s.ItemElems}>
                        <InputGroupAddon>Title</InputGroupAddon>
                        <Input name="title" placeholder="Enter title" value={article.title} onChange={this.inputChange} />
                    </InputGroup>
                    <Row>
                        <p className="h4 m-3">Status</p>
                        <UncontrolledDropdown className={s.ItemElems}>
                            <DropdownToggle caret>
                                {article.status}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem name="status" className="DropDownStatusActive" value="Active" onClick={this.inputChange}>Active</DropdownItem>
                                <DropdownItem name="status" className="DropDownStatusEditing" value="Editing" onClick={this.inputChange}>Editing</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Row>
                    <Row>
                        <p className="h4 m-3">Category</p>
                        <UncontrolledDropdown className={s.ItemElems}>
                            <DropdownToggle caret>
                                {article.category}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={this.selectCategory}>News</DropdownItem>
                                <DropdownItem onClick={this.selectCategory}>Events</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Row>
                    <InputGroup className={s.ItemElems}>
                        <InputGroupAddon>Link</InputGroupAddon>
                        <Input name="link" placeholder="Enter link" value={article.link} onChange={this.inputChange} />
                    </InputGroup>

                    <ReactQuill value={article.text} className="TextEditor" onChange={this.textChange} />

                    <textarea
                        value={article.text}
                        className={s.ItemElems}
                        name="text"
                        onChange={this.inputChange}
                    />

                    <Row className={s.ItemElems}>
                        <Col md="6">
                            <Card body outline color="primary">
                                <CardTitle>Main Image</CardTitle>
                                <CardImg width="100%" src={article.image} />
                                <Input name="images" type="file" accept="image/*" onChange={this.imageChange} />

                                <InputGroup className={s.ItemElems}>
                                    <InputGroupAddon>Image Link</InputGroupAddon>
                                    <Input name="image" placeholder="Enter Image link" value={article.image} onChange={this.inputChange} />
                                </InputGroup>
                            </Card>
                        </Col>

                        <Col md="6">
                            <Card body outline color="primary">
                                <CardTitle>Images</CardTitle>
                                <Row>
                                    {article.images && article.images.map(img => <this.CardImgsGen item={img} key={img} />)}
                                </Row>
                                <Input name="images" multiple type="file" accept="image/*" onChange={this.imageChange} />
                            </Card>
                        </Col>
                    </Row>

                    <Row className={s.ItemElems}>
                        <Card body outline color="primary">
                            <CardTitle>Video</CardTitle>
                            {article.video &&
                            <iframe
                                className="embed-responsive-item"
                                src={article.video}
                            />
                            }

                            <Input name="video" placeholder="Enter video link" value={article.video} onChange={this.inputChange} />
                        </Card>
                    </Row>

                </Card>

            </div>
        );
    }
}

const mapStateToProps = store => ({
    articles: store.dataMD.data,
    isFetching: store.dataMD.isFetching,
    link: store.sites.site,
});

export default withRouter(connect(mapStateToProps)(withStyles(s)(ArticleItem)));
