import React from 'react';
import ScrollToTop from '../components/sub/scroll-to-top/index.jsx';
import SEO from '../components/sub/seo/seo.jsx';
import Layout from '../layouts/layout.jsx';
// import Header from './header/index.jsx';
import IntroContainer from '../containers/home/intro/intro-container.jsx';
import { ServiceRequestProvider } from '../components/request/contexts/ServiceRequestContext.jsx';
import SumedBenefits from '../components/sumed-benefits/benefits.jsx';
// import Booker from '../components/request/booker/Booker.jsx';
import Requester from '../components/request/requester/Requester.jsx';
import Booker from '../components/request/booker/Booker.jsx';
const HomePage = () => {
  return (
    <React.Fragment>
      <Layout>
        <SEO title="Exalt - Home Care Services" />
        <div className="wrapper home-default-wrapper">
          <div className="header-intro-wrapper">
            {/* <Header /> */}
            <div className="relative">
              <IntroContainer />
            </div>
          </div>
          <ServiceRequestProvider>
            <Requester />
            <SumedBenefits />
            <Booker />
          </ServiceRequestProvider>
          <ScrollToTop />
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default HomePage;
