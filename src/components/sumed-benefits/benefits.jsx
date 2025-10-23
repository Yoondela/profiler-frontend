import React from 'react';

const SumedBenefits = () => {
  return (
    <div className="sumed-benefits-container">
      <div className="benefits-header">
        <h2>Changing how the cities hires</h2>
      </div>
      <div className="benefits-content container">
        <div className="benefits-list">
          <div className="benefit">
            <div className="number">
              <strong>1</strong>
            </div>
            <div className="content">
              <b>Convenient hiring</b>
              <p>
                A seamless way to find and book skilled service providers at
                your preferred time and location, saving you time and effort.
              </p>
            </div>
          </div>
          <div className="benefit-left">
            <div className="number">
              <strong>2</strong>
            </div>
            <div className="content">
              <b>Verified service</b>
              <p>
                A network of trusted, vetted professionals with proven
                expertise, ensuring quality and reliability for every job.
              </p>
            </div>
          </div>
          <div className="benefit">
            <div className="number">
              <strong>3</strong>
            </div>
            <div className="content">
              <b>Digital transformation</b>
              <p>
                A modern approach to traditional service industries, bringing
                efficiency and innovation to both providers and clients.
              </p>
            </div>
          </div>
        </div>
        <div className="benefits-right">
          <img
            src="img/homepage/lady-on-smartphone.jpg"
            alt="lady on smart phone"
          />
        </div>
      </div>
    </div>
  );
};

export default SumedBenefits;
