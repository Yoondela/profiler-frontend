import PropTypes from 'prop-types';
import React from 'react';
// import { useParams } from 'react-router-dom';
// import ScrollToTop from '../components/scroll-to-top';
// import SEO from '../components/seo';
import PortfolioDetailsContainer from './portfolio-details';
import PortfolioData from '../data/portfolio.json';
// import Footer from '../layouts/footer';
import PortfolioHeader from './PortfolioHeader';
import Layout from '../../../../layouts/layout';

const PortfolioDetails = () => {
  // const { id } = useParams();
  // const projectId = parseInt(id, 10);
  // const data = PortfolioData.filter((project) => project.id === projectId);

  return (
    <React.Fragment>
      <Layout>
        <div className="wrapper home-default-wrapper">
          <PortfolioHeader classOption="hb-border" />
          <div className="main-content">
            {/* <PortfolioDetailsContainer data={data[0]} /> */}
          </div>
          {/* <Footer /> */}
          {/* <ScrollToTop /> */}
        </div>
      </Layout>
    </React.Fragment>
  );
};

PortfolioDetails.propTypes = {
  // No longer expecting the match prop since we're using useParams
};

export default PortfolioDetails;
