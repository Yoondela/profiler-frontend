import React from 'react';

const SumedBenefits = () => {
  return (
    <section className="sumed-benefits-container homepage-section">
      <div className="homepage-section__inner benefits-content">
        <div className="benefits-list">
          <div className="benefits-header">
            <p className="homepage-eyebrow">Why choose Exalt</p>
            <h2>Practical help, made simple.</h2>
            <p>
              Find the right local professional for the task at hand, whether
              you need help today or want to plan ahead.
            </p>
          </div>
          <div className="benefit">
            <div className="benefit-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M12 3 5.5 6v5c0 4.2 2.8 8.1 6.5 10 3.7-1.9 6.5-5.8 6.5-10V6L12 3Z" />
                <path d="m9.3 12 1.8 1.8 3.8-4" />
              </svg>
            </div>
            <div className="content">
              <h3>Verified professionals</h3>
              <p>
                Connect with trusted service professionals for the work you need
                done.
              </p>
            </div>
          </div>
          <div className="benefit">
            <div className="benefit-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7.5V12l3 2" />
              </svg>
            </div>
            <div className="content">
              <h3>Flexible scheduling</h3>
              <p>
                Request help when it is urgent, or schedule a service for a time
                that suits you.
              </p>
            </div>
          </div>
          <div className="benefit">
            <div className="benefit-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M20 10.5c0 5.2-8 10-8 10s-8-4.8-8-10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10.5" r="2.5" />
              </svg>
            </div>
            <div className="content">
              <h3>Discover local services</h3>
              <p>
                Explore a growing range of services from professionals in your
                area.
              </p>
            </div>
          </div>
        </div>
        <aside className="provider-callout">
          <div className="provider-callout__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M12 3v18M3 12h18" />
            </svg>
          </div>
          <p className="homepage-eyebrow">For professionals</p>
          <h2>Offer your services on Exalt.</h2>
          <p>
            Join a local marketplace built to help people discover the services
            you provide.
          </p>
        </aside>
      </div>
    </section>
  );
};

export default SumedBenefits;
