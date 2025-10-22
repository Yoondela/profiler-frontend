import React from 'react';
import { useServiceRequest } from '../contexts/ServiceRequestContext';

const RequestReview = ({ onBack, serviceDetails }) => {
  const { service, selectedSize, location } = serviceDetails;

  const { requestData } = useServiceRequest();
  console.log('rev @', requestData);

  const displayInfo = () => {
    alert(JSON.stringify(requestData, null, 2));
  };

  return (
    <div className="request-reviewer booking-review-container booker-child-container">
      <div className="booker-header request-review title">
        <h2>Review</h2>
      </div>
      <div className="review-fields">
        <div className="review-left">
          <div className="review-info">
            <table>
              <tbody>
                <tr>
                  <td>
                    <span>Service:</span>
                  </td>
                  <td className="field">
                    {Array.isArray(requestData?.todo?.services) &&
                    requestData.todo.services.length > 0
                      ? requestData.todo.services.join(', ')
                      : requestData?.service || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td>
                    <span>Size:</span>
                  </td>
                  <td className="field">{requestData?.selectedSize}</td>
                </tr>
                <tr>
                  <td>
                    <span>Location:</span>
                  </td>
                  <td className="field">
                    {requestData?.location?.address || 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="review-right">
          <h3>Tasks</h3>
          {requestData?.todo?.tasks && (
            <div className="task-preview" style={{ marginTop: '1rem' }}>
              {Object.keys(requestData.todo.tasks).length > 1 ? (
                Object.entries(requestData.todo.tasks).map(
                  ([service, tasks]) => (
                    <div key={service} style={{ marginBottom: '1rem' }}>
                      <strong>{service}:</strong>
                      <ul>
                        {tasks.map((task, index) => (
                          <li key={index}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  )
                )
              ) : (
                <ul>
                  {Object.values(requestData.todo.tasks)[0].map(
                    (task, index) => (
                      <li key={index}>{task}</li>
                    )
                  )}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="slider-btns">
        <div className="left-btn">
          <button className="request-button" onClick={displayInfo}>
            Confirm
          </button>
        </div>
        <div className="right-btn">
          <button className="back-btn small-btn" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestReview;
