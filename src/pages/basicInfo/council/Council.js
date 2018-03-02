import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import history from '../../../history';
import { getData } from '../../../actions/getDataFromMongo';
import BoilerPlateMainCateg from '../../../components/BoilerPlateMainCateg/BoilerPlateMainCateg';

import s from './Council.scss';

import Loading from '../../../components/Loading/Loading';

class Council extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        isFetching: PropTypes.bool,
        personnel: PropTypes.array,
        link: PropTypes.string,
    };

    static defaultProps = {
        isFetching: false,
        personnel: null,
        link: null,
    };

    componentDidMount() {
        const token = localStorage.getItem('id_token'),
            { link } = this.props;
        if (!link) return history.push('/');
        return this.props.dispatch(getData(token, 'getPersonnels', link));
    }

    render() {
        const { isFetching, personnel } = this.props;
        if (isFetching || !personnel)
            return (
                <Loading />
            );


        return (
            <section>
                <BoilerPlateMainCateg title="Academic Council" array={personnel} linkTo="basic-information/academic-council" />
            </section>
        );
    }
}

const mapStateToProps = store => ({
    personnel: store.dataMD.data,
    isFetching: store.dataMD.isFetching,
    link: store.sites.site,
});

export default withRouter(connect(mapStateToProps)(withStyles(s)(Council)));
