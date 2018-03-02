import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Progress, Alert, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';

import s from './Sidebar.scss';
import LinksGroup from './LinksGroup/LinksGroup';
import { dismissAlert } from '../../actions/alerts';

class Sidebar extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        sidebarOpen: PropTypes.bool.isRequired,
    };

    dismissAlert(id) {
        this.props.dispatch(dismissAlert(id));
    }

    render() {
        return (
            /* eslint-disable */
            <nav className={[s.root, this.props.sidebarOpen ? s.sidebarOpen : '', 'sidebar'].join(' ')}
                 ref="element"
                 style={{height: this.props.sidebarOpen ? `${this.refs.element.scrollHeight}px` : 0}}>
                <ul className={s.nav}>
                    <LinksGroup header="Dashboard" headerLink="/app" iconName="fa-home"/>
                    <LinksGroup header="Another Page" headerLink="/app/another" iconName="fa-tree"/>
                    {this.props.siteSelected &&
                    <section>
                        <LinksGroup header="Articles" headerLink="/app/articles" iconName="fa-newspaper-o"/>
                        <LinksGroup header="Carousels" headerLink="/app/carousels" iconName="fa-columns"/>

                        <UncontrolledDropdown className="my-2 mx-4">
                            <DropdownToggle caret><i className="fa fa-file-text"/>Basic Info</DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem tag={Link} to='/app/basic-information/basicInfoDocs'>Basic Info Documents</DropdownItem>
                                <DropdownItem tag={Link} to='/app/basic-information/basicInfo'>Basic Info</DropdownItem>
                                <DropdownItem tag={Link} to='/app/basic-information/gov-bodies'>Gov Bodies</DropdownItem>
                                <DropdownItem tag={Link} to='/app/basic-information/gov-files'>Gov Files</DropdownItem>
                                <DropdownItem tag={Link} to='/app/basic-information/academic-council'><i className="fa fa-users"/>Academic Council</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>

                        <UncontrolledDropdown className="my-2 mx-4">
                            <DropdownToggle caret><i className="fa fa-file-text"/>Documents</DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem tag={Link} to='/app/documents/documents'>Documents</DropdownItem>
                                <DropdownItem tag={Link} to='/app/documents/inc-docs'>Incorp documents</DropdownItem>
                                <DropdownItem tag={Link} to='/app/documents/local-reg'>LocalReg documents</DropdownItem>
                                <DropdownItem tag={Link} to='/app/documents/faea-plan'>The plan of FAEA</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>

                        <UncontrolledDropdown className="my-2 mx-4">
                            <DropdownToggle caret><i className="fa fa-graduation-cap"/>Educations</DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem tag={Link} to='/app/education/educations'>Education</DropdownItem>
                                <DropdownItem tag={Link} to='/app/education/meth-work'>Education Meth Work</DropdownItem>
                                <DropdownItem tag={Link} to='/app/education/medalists'>Education Medalists</DropdownItem>
                                <DropdownItem tag={Link} to='/app/education/reception-in'>Education ReceptionIn</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>

                        <LinksGroup header="How To Find Info" headerLink="/app/how-to-find" iconName="fa-map-o"/>

                        <UncontrolledDropdown className="my-2 mx-4">
                            <DropdownToggle caret><i className="fa fa-industry"/>Logistics</DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem tag={Link} to='/app/logistics/logistics'>Logistic</DropdownItem>
                                <DropdownItem tag={Link} to='/app/logistics/paid-ed-services'>Paid Ed Services</DropdownItem>
                                <DropdownItem tag={Link} to='/app/logistics/fin-sup'>Types of fin sup</DropdownItem>
                                <DropdownItem tag={Link} to='/app/logistics/fin-eco-act'>Fin'N'Eco Activity</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>

                    </section>
                    }
                </ul>
                <h6 className={s.navTitle}>
                    Labels
                    <a className={s.actionLink}>
                        <i className={`${s.glyphiconSm} glyphicon glyphicon-plus float-right`}/>
                    </a>
                </h6>
                <ul className={s.sidebarLabels}>
                    <NavItem>
                        <NavLink href="#">
                            <i className="fa fa-circle text-warning"/>
                            <span className={s.labelName}>My Recent</span>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="#">
                            <i className="fa fa-circle text-gray"/>
                            <span className={s.labelName}>Starred</span>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="#">
                            <i className="fa fa-circle text-danger"/>
                            <span className={s.labelName}>Background</span>
                        </NavLink>
                    </NavItem>
                </ul>
                <h6 className={s.navTitle}>
                    Projects
                </h6>
                <div className={s.sidebarAlerts}>
                    {this.props.alertsList.map(alert => // eslint-disable-line
                        <Alert
                            key={alert.id}
                            className={s.sidebarAlert} color="transparent"
                            isOpen={true} // eslint-disable-line
                            toggle={() => {
                                this.dismissAlert(alert.id);
                            }}
                        >
                            <span className="text-white fw-semi-bold">{alert.title}</span><br/>
                            <Progress className={`${s.sidebarProgress} progress-xs mt-1`} color={alert.color}
                                      value={alert.value}/>
                            <small>{alert.footer}</small>
                        </Alert>,
                    )}
                </div>
            </nav>
        );
    }
}

const mapStateToProps = (store) => {
    return {
        alertsList: store.alerts.alertsList,
        sidebarOpen: store.navigation.sidebarOpen,
        activeItem: store.navigation.activeItem,
        siteSelected: store.sites.site,
    };
};

export default withRouter(connect(mapStateToProps)(withStyles(s)(Sidebar)));
