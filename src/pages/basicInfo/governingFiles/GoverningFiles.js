import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import history from '../../../history';
import { getData } from '../../../actions/getDataFromMongo';
import BoilerPlateMainCateg from '../../../components/BoilerPlateMainCateg/BoilerPlateMainCateg';

import s from './GoverningFiles.scss';

import Loading from '../../../components/Loading/Loading';

class GoverningFiles extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        isFetching: PropTypes.bool,
        govFiles: PropTypes.array,
        link: PropTypes.string,
    };

    static defaultProps = {
        isFetching: false,
        govFiles: null,
        link: null,
    };

    componentDidMount() {
        const token = localStorage.getItem('id_token'),
            { link } = this.props;
        if (!link) return history.push('/');
        return this.props.dispatch(getData(token, 'getGoverningFiles', link));
    }

    render() {
        const { isFetching, govFiles } = this.props;
        if (isFetching || !govFiles)
            return (
                <Loading />
            );


        return (
            <section>
                <BoilerPlateMainCateg title="Governing File" array={govFiles} linkTo="basic-information/gov-files" />
            </section>
        );
    }
}

const mapStateToProps = store => ({
    govFiles: store.dataMD.data,
    isFetching: store.dataMD.isFetching,
    link: store.sites.site,
});

export default withRouter(connect(mapStateToProps)(withStyles(s)(GoverningFiles)));
