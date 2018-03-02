import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Row, Col } from 'reactstrap';

import s from './Dashboard.scss';

class Dashboard extends React.Component {
    render() {
        return (
            <div className={s.root}>
                <h1 className="page-title">Dashboard
                    <small>
                        <small>The Lucky One</small>
                    </small>
                </h1>
                <Row>
                    <Col lg="6">

                        <section className={s.GlitchPsycho}>
                            <p data-text="PSYCHO">D3V</p>
                        </section>

                        {/* <Widget title={<h5>Example <span className="fw-semi-bold">Widget</span></h5>}> */}
                        {/* <div> */}
                        {/* <img className="pull-left mt-1 mr-2" src={logo} alt="React" width="80" /> */}
                        {/* <p className="lead"> */}
                        {/* You are looking at a completely new version of */}
                        {/* Light Blue built with <strong>React JS</strong> using */}
                        {/* Redux, React Router and Server Side Rendering! */}
                        {/* </p> */}
                        {/* <p className="fs-mini text-right m-0">Made by <a */}
                        {/* href="https://flatlogic.com" */}
                        {/* target="_blank" */}
                        {/* rel="noopener noreferrer" */}
                        {/* >Flatlogic */}
                        {/* </a>. */}
                        {/* </p> */}
                        {/* </div> */}
                        {/* </Widget> */}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default (withStyles(s)(Dashboard));
