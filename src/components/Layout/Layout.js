import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router';

// an example of react-router code-splitting
/* eslint-disable */
import loadAnother from 'bundle-loader?lazy!../../pages/another/Another';
/* eslint-enable */

import s from './Layout.scss';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Bundle from '../../core/Bundle';

// Dashboard component is loaded directly as an example of server side rendering
import Dashboard from '../../pages/dashboard/Dashboard';

import Profile from '../../pages/profile/Profile';

import Articles from '../../pages/articles/Articles';
import ArticleItem from '../../pages/articles/Item/Item';

import Carousels from '../../pages/carousels/Carousels';
import CarouselItem from '../../pages/carousels/Item/Item';


// Basic Info
import BasicInfoDocuments from '../../pages/basicInfo/basicInfoDocuments/BasicInfoDocuments';
import BasicInfoDocumentsItem from '../../pages/basicInfo/basicInfoDocuments/Item/Item';
import BasicInfoMain from '../../pages/basicInfo/basicInfoMain/BasicInfoMain';
import BasicInfoMainItem from '../../pages/basicInfo/basicInfoMain/Item/Item';
import Council from '../../pages/basicInfo/council/Council';
import CouncilItem from '../../pages/basicInfo/council/Item/Item';
import GoverningBodies from '../../pages/basicInfo/governingBodies/GoverningBodies';
import GoverningBodiesItem from '../../pages/basicInfo/governingBodies/Item/Item';
import GoverningFiles from '../../pages/basicInfo/governingFiles/GoverningFiles';
import GoverningFilesItem from '../../pages/basicInfo/governingFiles/Item/Item';
// -- Basic Info End --

// Documents
import Documents from '../../pages/documents/documentsMain/Documents';
import DocumentItem from '../../pages/documents/documentsMain/Item/Item';
import DocumentsIncorp from '../../pages/documents/documentsIncorp/DocumentsIncorp';
import DocumentsIncorpItem from '../../pages/documents/documentsIncorp/Item/Item';
import DocumentsLocalReg from '../../pages/documents/documentsLocalReg/DocumentsLocalReg';
import DocumentsLocalRegItem from '../../pages/documents/documentsLocalReg/Item/Item';
import DocumentsFAEA from '../../pages/documents/documentsFAEA/DocumentsFAEA';
import DocumentsFAEAItem from '../../pages/documents/documentsFAEA/Item/Item';
// -- Documents End --

// Education
import EducationMain from '../../pages/education/educationMain/EducationMain';
import EducationMainItem from '../../pages/education/educationMain/Item/Item';
import EducationMedalists from '../../pages/education/educationMedalists/EducationMedalists';
import EducationMedalistItem from '../../pages/education/educationMedalists/Item/Item';
import EducationMethWork from '../../pages/education/educationMethWork/EducationMethWork';
import EducationMethWorkItem from '../../pages/education/educationMethWork/Item/Item';
import EducationReceptionIn from '../../pages/education/educationReceptionIn/EducationReceptionIn';
import EducationReceptionInItem from '../../pages/education/educationReceptionIn/Item/Item';
// -- Education End --

// Logistics
import LogisticMain from '../../pages/logistics/logisticsMain/LogisticMain';
import LogisticMainItem from '../../pages/logistics/logisticsMain/Item/Item';
import PaidEducationalServices from '../../pages/logistics/paidEducationalServices/PaidEducationalServices';
import PaidEducationalServicesItem from '../../pages/logistics/paidEducationalServices/Item/Item';
import FinancialSupport from '../../pages/logistics/financialSupport/FinancialSupport';
import FinancialSupportItem from '../../pages/logistics/financialSupport/Item/Item';
import FinAndEconActivity from '../../pages/logistics/finAndEconActivity/FinAndEconActivity';
import FinAndEconActivityItem from '../../pages/logistics/finAndEconActivity/Item/Item';

// -- Logistics End --

import HowToFind from '../../pages/howToFindInfo/HowToFind';
import HowToFindItem from '../../pages/howToFindInfo/Item/Item';


const AnotherBundle = Bundle.generateBundle(loadAnother);

class Layout extends React.Component {
    static propTypes = {
        sidebarState: PropTypes.string.isRequired,
        sidebarPosition: PropTypes.string.isRequired,
    };


    render() {
        console.log('userTheme', this.props.userTheme);

        return (
            <div className={s.root}>
                <Header toggleSidebar={this.toggleSidebar} />
                <div
                    className={[s.wrap, this.props.sidebarState === 'hide' ? 'sidebar-hidden' : '', this.props.sidebarPosition === 'right' ? 'sidebar-right' : ''].join(' ')}
                >
                    <Sidebar />
                    <main className={[s.content].join(' ')}>
                        <Switch>
                            <Route path="/app" exact component={Dashboard} />
                            <Route path="/app/another" exact component={AnotherBundle} />
                            <Route path="/app/profile" exact component={Profile} />
                            <Route path="/app/articles" exact component={Articles} />
                            <Route path="/app/articles/:id" exact component={ArticleItem} />
                            <Route path="/app/carousels" exact component={Carousels} />
                            <Route path="/app/carousels/:id" exact component={CarouselItem} />

                            <Route path="/app/basic-information/academic-council" exact component={Council} />
                            <Route path="/app/basic-information/academic-council/:id" exact component={CouncilItem} />
                            <Route path="/app/basic-information/basicInfo" exact component={BasicInfoMain} />
                            <Route path="/app/basic-information/basicInfo/:id" exact component={BasicInfoMainItem} />
                            <Route path="/app/basic-information/basicInfoDocs" exact component={BasicInfoDocuments} />
                            <Route path="/app/basic-information/basicInfoDocs/:id" exact component={BasicInfoDocumentsItem} />
                            <Route path="/app/basic-information/gov-bodies" exact component={GoverningBodies} />
                            <Route path="/app/basic-information/gov-bodies/:id" exact component={GoverningBodiesItem} />
                            <Route path="/app/basic-information/gov-files" exact component={GoverningFiles} />
                            <Route path="/app/basic-information/gov-files/:id" exact component={GoverningFilesItem} />

                            <Route path="/app/documents/documents" exact component={Documents} />
                            <Route path="/app/documents/documents/:id" exact component={DocumentItem} />
                            <Route path="/app/documents/inc-docs" exact component={DocumentsIncorp} />
                            <Route path="/app/documents/inc-docs/:id" exact component={DocumentsIncorpItem} />
                            <Route path="/app/documents/local-reg" exact component={DocumentsLocalReg} />
                            <Route path="/app/documents/local-reg/:id" exact component={DocumentsLocalRegItem} />
                            <Route path="/app/documents/faea-plan" exact component={DocumentsFAEA} />
                            <Route path="/app/documents/faea-plan/:id" exact component={DocumentsFAEAItem} />

                            <Route path="/app/education/educations/" exact component={EducationMain} />
                            <Route path="/app/education/educations/:id" exact component={EducationMainItem} />
                            <Route path="/app/education/medalists/" exact component={EducationMedalists} />
                            <Route path="/app/education/medalists/:id" exact component={EducationMedalistItem} />
                            <Route path="/app/education/meth-work/" exact component={EducationMethWork} />
                            <Route path="/app/education/meth-work/:id" exact component={EducationMethWorkItem} />
                            <Route path="/app/education/reception-in/" exact component={EducationReceptionIn} />
                            <Route path="/app/education/reception-in/:id" exact component={EducationReceptionInItem} />

                            <Route path="/app/logistics/logistics" exact component={LogisticMain} />
                            <Route path="/app/logistics/logistics/:id" exact component={LogisticMainItem} />
                            <Route path="/app/logistics/paid-ed-services" exact component={PaidEducationalServices} />
                            <Route path="/app/logistics/paid-ed-services/:id" exact component={PaidEducationalServicesItem} />
                            <Route path="/app/logistics/fin-sup" exact component={FinancialSupport} />
                            <Route path="/app/logistics/fin-sup/:id" exact component={FinancialSupportItem} />
                            <Route path="/app/logistics/fin-eco-act" exact component={FinAndEconActivity} />
                            <Route path="/app/logistics/fin-eco-act/:id" exact component={FinAndEconActivityItem} />


                            <Route path="/app/how-to-find" exact component={HowToFind} />
                            <Route path="/app/how-to-find/:id" exact component={HowToFindItem} />


                        </Switch>
                    </main>
                </div>
            </div>
        );
    }
}

const mapStateToProps = store => ({
    sidebarState: store.navigation.sidebarState,
    sidebarPosition: store.navigation.sidebarPosition,
    userTheme: store.auth.theme,
});

export default withRouter(connect(mapStateToProps)(withStyles(s)(Layout)));

