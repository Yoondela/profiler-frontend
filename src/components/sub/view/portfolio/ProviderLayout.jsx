import React from 'react';
import PropTypes from 'prop-types';
import PortfolioHeader from './PortfolioHeader';

/**
 * ProviderPage
 *
 * Simple boilerplate React component for the provider view.
 * Add routing, state, effects and styling as needed.
 */
const PortfolioLayout = () => {
  return (
    <div className={`provider-page`}>
      <PortfolioHeader
        bannerUrl={null}
        avatarUrl={null}
        providerName={'Company X'}
        averageRating={4}
        reviewCount={9}
      />

      <main className="provider-page__content">
        <p>This is the ProviderPage.</p>
      </main>

      <footer className="provider-page__footer">
        <small>ProviderPage footer</small>
      </footer>
    </div>
  );
};

export default PortfolioLayout;
