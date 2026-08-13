import React from 'react';
import ServiceRequestForm from './ServiceRequestForm';

const RequesterSlide = () => {
  return (
    <div className="requester-shell">
      <div className="requester-container">
        <div className="requester-header">
          <h2>Get a service</h2>
        </div>
        <ServiceRequestForm />
      </div>
    </div>
  );
};

export default RequesterSlide;
