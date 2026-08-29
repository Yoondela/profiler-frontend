import React from 'react';
import ServiceRequestForm from './ServiceRequestForm';

const RequesterSlide = () => {
  return (
    <div className="requester-shell">
      <div className="requester-container">
        <div className="requester-header">
          <p className="homepage-eyebrow">Request now</p>
          <h2>Need help today?</h2>
          <p>
            Tell us what you need and where you are. We’ll help you start your
            service request in a few simple steps.
          </p>
        </div>
        <ServiceRequestForm />
      </div>
    </div>
  );
};

export default RequesterSlide;
