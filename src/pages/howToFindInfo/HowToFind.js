import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import history from '../../history';
import { getData } from '../../actions/getDataFromMongo';
import BoilerPlateMainCateg from '../../components/BoilerPlateMainCateg/BoilerPlateMainCateg';

import s from './HowToFind.scss';

import Loading from '../../components/Loading/Loading';

class HowToFind extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        isFetching: PropTypes.bool,
        findInfo: PropTypes.array,
        link: PropTypes.string,
    };

    static defaultProps = {
        isFetching: false,
        findInfo: null,
        link: null,
    };

    componentDidMount() {
        const token = localStorage.getItem('id_token'),
            { link } = this.props;
        if (!link) return history.push('/');
        return this.props.dispatch(getData(token, 'getHowToFindInfos', link));
    }

    render() {
        const { isFetching, findInfo } = this.props;
        if (isFetching || !findInfo)
            return (
                <Loading />
            );


        return (
            <section>
                <BoilerPlateMainCateg title="How To Find" array={findInfo} linkTo="how-to-find" />
            </section>
        );
    }
}

const mapStateToProps = store => ({
    findInfo: store.dataMD.data,
    isFetching: store.dataMD.isFetching,
    link: store.sites.site,
});

export default withRouter(connect(mapStateToProps)(withStyles(s)(HowToFind)));
