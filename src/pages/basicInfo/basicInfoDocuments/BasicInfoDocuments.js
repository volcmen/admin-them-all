import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import history from '../../../history';
import { getData } from '../../../actions/getDataFromMongo';
import BoilerPlateMainCateg from '../../../components/BoilerPlateMainCateg/BoilerPlateMainCateg';

import s from './BasicInfoDocuments.scss';

import Loading from '../../../components/Loading/Loading';

class BasicInfoDocuments extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        isFetching: PropTypes.bool,
        docs: PropTypes.array,
        link: PropTypes.string,
    };

    static defaultProps = {
        isFetching: false,
        docs: null,
        link: null,
    };

    componentDidMount() {
        const token = localStorage.getItem('id_token'),
            { link } = this.props;
        if (!link) return history.push('/');
        return this.props.dispatch(getData(token, 'getBasicInfoDocuments', link));
    }

    render() {
        const { isFetching, docs } = this.props;
        if (isFetching || !docs)
            return (
                <Loading />
            );


        return (
            <section>
                <BoilerPlateMainCateg title="Local Regulation" array={docs} linkTo="basic-information/basicInfoDocs" />
            </section>
        );
    }
}

const mapStateToProps = store => ({
    docs: store.dataMD.data,
    isFetching: store.dataMD.isFetching,
    link: store.sites.site,
});

export default withRouter(connect(mapStateToProps)(withStyles(s)(BasicInfoDocuments)));
