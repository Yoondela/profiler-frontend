import React from 'react';
import ScrollToTop from '../components/sub/scroll-to-top/index.jsx';
import SEO from '../components/sub/seo/seo.jsx';
import Layout from '../layouts/layout.jsx';
// import Header from './header/index.jsx';
import IntroContainer from '../containers/home/intro/intro-container.jsx';
import RequesterSlide from '../components/request/requester/RequesterSlide.jsx';
import { ServiceRequestProvider } from '../components/request/contexts/ServiceRequestContext.jsx';
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
            <RequesterSlide />
          </ServiceRequestProvider>
          {/* <Requester />
                    <UseEx />
                    <Booker />
                    <SumedBenefits />
                    <SimpleBookingProcess />
                    <FAQs />
                    <Footer /> */}
          <ScrollToTop />
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default HomePage;
