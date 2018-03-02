import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
    Navbar,
    Nav,
    NavItem,
    NavLink,
    NavbarBrand,
    Collapse,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Badge,
    ButtonGroup,
    Button,
} from 'reactstrap';
import { logoutUser } from '../../actions/user';
import { toggleSidebar, positionSidebar, toggleOpenSidebar } from '../../actions/navigation';
import { getSites, changeSite } from '../../actions/sites';
import config from '../../config';

import i1 from '../../images/1.png';
import i2 from '../../images/2.png';
import i3 from '../../images/3.png';

import s from './Header.scss';

class Header extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        sidebarState: PropTypes.string.isRequired,
        sidebarPosition: PropTypes.string.isRequired,
        sitesItems: PropTypes.array,
        userName: PropTypes.string.isRequired,
        userType: PropTypes.string.isRequired,
    };

    static defaultProps = {
        sitesItems: null,
    };

    constructor(props) {
        super(props);

        this.doLogout = this.doLogout.bind(this);
        this.toggleSitesDropdown = this.toggleSitesDropdown.bind(this);
        this.toggleMessagesDropdown = this.toggleMessagesDropdown.bind(this);
        this.toggleSupportDropdown = this.toggleSupportDropdown.bind(this);
        this.toggleSettingsDropdown = this.toggleSettingsDropdown.bind(this);
        this.toggleAccountDropdown = this.toggleAccountDropdown.bind(this);
        this.moveSidebar = this.moveSidebar.bind(this);
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.toggleOpenSidebar = this.toggleOpenSidebar.bind(this);
        this.selectSite = this.selectSite.bind(this);

        this.state = {
            dropdownSitesOpen: false,
            selectedSite: 'Select One',
            messagesOpen: false,
            supportOpen: false,
            settingsOpen: false,
            searchOpen: false,
        };
    }

    componentDidMount() {
        const token = localStorage.getItem('id_token');
        this.props.dispatch(getSites(token));
    }


    doLogout() {
        this.props
            .dispatch(logoutUser());
    }

    toggleSitesDropdown() {
        this.setState({
            dropdownSitesOpen: !this.state.dropdownSitesOpen,
        });
    }

    toggleMessagesDropdown() {
        this.setState({
            messagesOpen: !this.state.messagesOpen,
        });
    }

    toggleSupportDropdown() {
        this.setState({
            supportOpen: !this.state.supportOpen,
        });
    }

    toggleSettingsDropdown() {
        this.setState({
            settingsOpen: !this.state.settingsOpen,
        });
    }

    toggleAccountDropdown() {
        this.setState({
            accountOpen: !this.state.accountOpen,
        });
    }

    toggleSidebar(state) {
        this.props.dispatch(toggleSidebar(state));
    }

    moveSidebar(position) {
        this.props.dispatch(positionSidebar(position));
    }

    toggleOpenSidebar() {
        this.props.dispatch(toggleOpenSidebar());
    }

    selectSite(site) {
        console.log('clicked');
        console.log('site', site);
        const fetchConf = {
            method: 'put',
            headers: {
                Authorization: localStorage.id_token,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.props.userName,
                lastUsedSite: site.link,
            }),
        };

        this.setState({ selectedSite: site.title });
        this.props.dispatch(changeSite(site.link));
        return fetch(`${config.api.apiRest}/requests/updateUserSite`, fetchConf);
    }

    render() {
        return (
            <Navbar>
                <NavbarBrand className={s.logo} href="/">
                    ADMIN <strong>Them</strong> ALL
                </NavbarBrand>
                <Collapse
                    className={[s.searchCollapse, 'ml-auto ml-lg-0 mr-md-3'].join(' ')}
                    isOpen={this.state.searchOpen}
                />
                <Nav className="ml-auto ml-md-0">
                    {this.props.sitesItems &&
                    <Dropdown isOpen={this.state.dropdownSitesOpen} toggle={this.toggleSitesDropdown}>
                        <DropdownToggle nav caret className={s.navItem}>
                            {this.state.selectedSite}
                        </DropdownToggle>
                        <DropdownMenu className={s.dropdownMenu}>
                            {this.props.sitesItems.map(item => (
                                <DropdownItem onClick={() => this.selectSite(item)} key={item.title} className={s.dropItem}>
                                    {item.title}
                                </DropdownItem>))}
                        </DropdownMenu>
                    </Dropdown>
                    }
                    <Dropdown isOpen={this.state.messagesOpen} toggle={this.toggleMessagesDropdown}>
                        <DropdownToggle nav className={s.navItem}>
                            <i className="glyphicon glyphicon-comments" />
                        </DropdownToggle>
                        <DropdownMenu className={`${s.dropdownMenu} ${s.messages}`}>
                            <DropdownItem>
                                <img className={s.image} src={i1} alt="" />
                                <div className={s.details}>
                                    <div>Jane Hew</div>
                                    <div className={s.text}>
                                        Hey, John! How is it going? ...
                                    </div>
                                </div>
                            </DropdownItem>
                            <DropdownItem>
                                <img className={s.image} src={i2} alt="" />
                                <div className={s.details}>
                                    <div>Alies Rumiancaŭ</div>
                                    <div className={s.text}>
                                        I will definitely buy this template
                                    </div>
                                </div>
                            </DropdownItem>
                            <DropdownItem>
                                <img className={s.image} src={i3} alt="" />
                                <div className={s.details}>
                                    <div>Michał Rumiancaŭ</div>
                                    <div className={s.text}>
                                        Is it really Lore ipsum? Lore ...
                                    </div>
                                </div>
                            </DropdownItem>
                            <DropdownItem>
                                <a>
                                    See all messages <i className="fa fa-arrow-right" />
                                </a>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown isOpen={this.state.supportOpen} toggle={this.toggleSupportDropdown}>
                        <DropdownToggle nav className={s.navItem}>
                            <i className="glyphicon glyphicon-globe" />
                            <span className={s.count}>8</span>
                        </DropdownToggle>
                        <DropdownMenu right className={`${s.dropdownMenu} ${s.support}`}>
                            <DropdownItem>
                                <Badge color="danger"><i className="fa fa-bell-o" /></Badge>
                                <div className={s.details}>
                                    Check out this awesome ticket
                                </div>
                            </DropdownItem>
                            <DropdownItem>
                                <Badge color="warning"><i className="fa fa-question-circle" /></Badge>
                                <div className={s.details}>
                                    What is the best way to get ...
                                </div>
                            </DropdownItem>
                            <DropdownItem>
                                <Badge color="success"><i className="fa fa-info-circle" /></Badge>
                                <div className={s.details}>
                                    This is just a simple notification
                                </div>
                            </DropdownItem>
                            <DropdownItem>
                                <Badge color="info"><i className="fa fa-plus" /></Badge>
                                <div className={s.details}>
                                    12 new orders has arrived today
                                </div>
                            </DropdownItem>
                            <DropdownItem>
                                <Badge color="danger"><i className="fa fa-tag" /></Badge>
                                <div className={s.details}>
                                    One more thing that just happened
                                </div>
                            </DropdownItem>
                            <DropdownItem>
                                <a>
                                    See all tickets <i className="fa fa-arrow-right" />
                                </a>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <NavItem className={s.divider} />
                    <Dropdown
                        isOpen={this.state.settingsOpen}
                        toggle={this.toggleSettingsDropdown}
                        className="d-sm-none-down"
                    >
                        <DropdownToggle nav className={s.navItem}>
                            <i className="glyphicon glyphicon-cog" />
                        </DropdownToggle>
                        <DropdownMenu className={`${s.dropdownMenu} ${s.settings}`}>
                            <h6>Sidebar on the</h6>
                            <ButtonGroup size="sm">
                                <Button
                                    onClick={() => this.moveSidebar('left')}
                                    className={this.props.sidebarPosition === 'left' ? 'active' : ''}
                                >Left
                                </Button>
                                <Button
                                    onClick={() => this.moveSidebar('right')}
                                    className={this.props.sidebarPosition === 'right' ? 'active' : ''}
                                >Right
                                </Button>
                            </ButtonGroup>
                            <h6 className="mt-2">Sidebar</h6>
                            <ButtonGroup size="sm">
                                <Button
                                    onClick={() => this.toggleSidebar('show')}
                                    className={this.props.sidebarState === 'show' ? 'active' : ''}
                                >Show
                                </Button>
                                <Button
                                    onClick={() => this.toggleSidebar('hide')}
                                    className={this.props.sidebarState === 'hide' ? 'active' : ''}
                                >Hide
                                </Button>
                            </ButtonGroup>
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown
                        isOpen={this.state.accountOpen}
                        toggle={this.toggleAccountDropdown}
                        className="d-sm-none-down"
                    >
                        <DropdownToggle nav className={s.navItem}>
                            <i className="glyphicon glyphicon-user" />
                        </DropdownToggle>
                        <DropdownMenu right className={`${s.dropdownMenu} ${s.account}`}>
                            <section>
                                {this.props.userName}
                            </section>
                            <DropdownItem>
                                <NavLink href="/app/profile">
                                    <i className="fa fa-user fa-fw" />
                                    Profile
                                </NavLink>
                            </DropdownItem>
                            <DropdownItem>
                                <NavLink href="/calendar">
                                    <i className="fa fa-calendar fa-fw" />
                                    Calendar
                                </NavLink>
                            </DropdownItem>
                            <DropdownItem>
                                <NavLink href="/inbox">
                                    <i className="fa fa-inbox fa-fw" />
                                    Inbox
                                </NavLink>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <NavItem className="d-sm-none-down">
                        <NavLink onClick={this.doLogout} className={s.navItem} href="#">
                            <i className="glyphicon glyphicon-off" />
                        </NavLink>
                    </NavItem>
                    <NavItem className="d-md-none">
                        <NavLink onClick={this.toggleOpenSidebar} className={s.navItem} href="#">
                            <i className="fa fa-bars" />
                        </NavLink>
                    </NavItem>
                </Nav>
            </Navbar>
        );
    }
}

const mapStateToProps = (store) => {
    console.log('store', store);
    return {
        sidebarState: store.navigation.sidebarState,
        sidebarPosition: store.navigation.sidebarPosition,
        sitesItems: store.sites.items,
        userName: store.auth.user,
        userType: store.auth.accountType,
    };
};

export default withRouter(connect(mapStateToProps)(withStyles(s)(Header)));

