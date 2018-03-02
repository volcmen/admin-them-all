import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import history from '../../history';
import { getData } from '../../actions/getDataFromMongo';
import BoilerPlateMainCateg from '../../components/BoilerPlateMainCateg/BoilerPlateMainCateg';

import s from './Carousels.scss';

import Loading from '../../components/Loading/Loading';

class Carousels extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        isFetching: PropTypes.bool,
        carousels: PropTypes.array,
        link: PropTypes.string,
    };

    static defaultProps = {
        isFetching: false,
        carousels: null,
        link: null,
    };

    componentDidMount() {
        const token = localStorage.getItem('id_token'),
            { link } = this.props;
        if (!link) return history.push('/');
        return this.props.dispatch(getData(token, 'getCarousels', link));
    }

    render() {
        const { isFetching, carousels } = this.props;
        if (isFetching || !carousels)
            return (
                <Loading />
            );


        return (
            <section>
                <BoilerPlateMainCateg title="Carousel" array={carousels} linkTo="carousels" />
            </section>
        );
    }
}

const mapStateToProps = store => ({
    carousels: store.dataMD.data,
    isFetching: store.dataMD.isFetching,
    link: store.sites.site,
});

export default withRouter(connect(mapStateToProps)(withStyles(s)(Carousels)));
