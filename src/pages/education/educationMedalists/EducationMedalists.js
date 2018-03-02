import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import history from '../../../history';
import { getData } from '../../../actions/getDataFromMongo';
import BoilerPlateMainCateg from '../../../components/BoilerPlateMainCateg/BoilerPlateMainCateg';

import s from './EducationMedalists.scss';

import Loading from '../../../components/Loading/Loading';


class EducationMedalists extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        isFetching: PropTypes.bool,
        items: PropTypes.array,
        link: PropTypes.string,
    };

    static defaultProps = {
        isFetching: false,
        items: null,
        link: null,
    };

    componentDidMount() {
        const token = localStorage.getItem('id_token'),
            { link } = this.props;
        if (!link) return history.push('/');
        return this.props.dispatch(getData(token, 'getEdMedalists', link));
    }

    render() {
        const { isFetching, items } = this.props;
        if (isFetching || !items)
            return (
                <Loading />
            );


        return (
            <section>
                <BoilerPlateMainCateg title="Education Medalist" array={items} linkTo="education/medalists" />
            </section>
        );
    }
}

const mapStateToProps = store => ({
    items: store.dataMD.data,
    isFetching: store.dataMD.isFetching,
    link: store.sites.site,
});

export default withRouter(connect(mapStateToProps)(withStyles(s)(EducationMedalists)));
