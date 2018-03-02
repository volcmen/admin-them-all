import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import history from '../../history';
import { getData } from '../../actions/getDataFromMongo';

import BoilerPlateMainCateg from '../../components/BoilerPlateMainCateg/BoilerPlateMainCateg';

import s from './Articles.scss';

import Loading from '../../components/Loading/Loading';

class Articles extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        isFetching: PropTypes.bool,
        articles: PropTypes.array,
        link: PropTypes.string,
    };

    static defaultProps = {
        isFetching: false,
        articles: null,
        link: null,
    };


    componentDidMount() {
        const token = localStorage.getItem('id_token'),
            { link } = this.props;
        if (!link) return history.push('/');
        return this.props.dispatch(getData(token, 'getArticles', link));
    }

    render() {
        const { isFetching, articles } = this.props;
        if (isFetching || !articles)
            return (
                <Loading />
            );


        return (
            <section>
                <BoilerPlateMainCateg title="Article" array={articles} linkTo="articles" />
            </section>
        );
    }
}

const mapStateToProps = store => ({
    articles: store.dataMD.data,
    isFetching: store.dataMD.isFetching,
    link: store.sites.site,
});

export default withRouter(connect(mapStateToProps)(withStyles(s)(Articles)));
