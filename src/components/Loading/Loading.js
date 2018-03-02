import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './Loading.scss';


const Loading = () => (
    <div className={s.Loading}>
        <div id="text">
            <h1>Lo<span id="offset">ad</span>ing</h1>
        </div>
    </div>
);


export default withStyles(s)(Loading);
