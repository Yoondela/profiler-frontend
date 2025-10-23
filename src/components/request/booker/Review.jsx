import React from 'react';

const BookingReview = ({ requestData, onBack, serviceDetails }) => {
  const [date, time, service, location] = serviceDetails;

  const displayInfo = () => {
    console.log('requestData: ' + JSON.stringify(requestData, null, 2));
    alert(JSON.stringify(requestData, null, 2));
  };

  return (
    <div className="booking-review-container booker-child-container">
      <div className="booker-header">
        <h2>Review</h2>
        <hr />
      </div>
      <div className="review-fields">
        <table>
          <tr>
            <td>
              <span>Service:</span>
            </td>
            <td>{service}</td>
          </tr>
          <tr>
            <td>
              <span>Date:</span>
            </td>
            <td>{date}</td>
          </tr>
          <tr>
            <td>
              <span>Time:</span>
            </td>
            <td>{time}</td>
          </tr>
          <tr>
            <td>
              <span>Location:</span>
            </td>
            <td>{location}</td>
          </tr>
        </table>
      </div>
      <div className="slider-btns">
        <div className="left-btn">
          <button className="request-button" onClick={displayInfo}>
            Confirm
          </button>
        </div>
        <div className="right-btn">
          <button
            className="detailed-btn small-btn"
            // onClick={onEdit}
            // disabled={!service}
          >
            Detailed Review
          </button>
          <button className="back-btn small-btn" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingReview;
