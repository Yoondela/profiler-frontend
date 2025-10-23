import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import TimeAndDate from './TimeAndDate';
import ServiceAndAddress from './ServiceAndAddress';
// import TaskPanel from '../request-service/task-panel';
import BookingReview from './Review';

import CancelIcon from '../../../assets/icons/booker-icons/cancel.svg?react';
import BellIcon from '../../../assets/icons/booker-icons/bell.svg?react';
import CalendarIcon from '../../../assets/icons/booker-icons/calendar.svg?react';

const BookerSlide = ({
  requestData,
  parentTime,
  parentDate,
  setParentTime,
  setParentDate,
  handleEdit,
  setDefaultService,
  setPanelClose,
  panelClose,
  defaultService,
  setDefaultLocation,
  defaultLocation,
}) => {
  const [showSecond, setShowSecond] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const [userTime, setUserTime] = useState(parentTime || null);
  const [userDate, setUserDate] = useState(parentDate || null);
  const [userService, setUserService] = useState(defaultService || null);
  const [userLocation, setUserLocation] = useState(defaultLocation || null);

  const [showFirst, setShowFirst] = useState(false);
  const [gotToReview, setGoToReview] = useState(false);

  const handleNext = () => setShowSecond(true);
  const handleBack = () => {
    setShowSecond(false);
    if (panelClose) {
      setPanelClose(false);
    }
  };

  const handleToReview = () => setShowReview(true);
  const handleFromReview = () => {
    setShowReview(false);
    setShowSecond(true);
  };

  useEffect(() => {
    setDefaultService(userService || '');
    setDefaultLocation(userLocation || '');
    setParentDate(userDate || '');
    setParentTime(userTime || '');
  }, [userService, userLocation, userDate, userTime]);


  const serviceDetails = [
    format(userDate, 'EEE MMM dd yyyy'),
    userTime,
    userService,
    userLocation,
  ];

  return (
    <div className="booker-child-container">
      <div className="booker">
        <div className="booker-left">
          <TransitionGroup component={null}>
            <CSSTransition
              key={showReview ? 'review' : showSecond ? 'second' : 'first'}
              classNames="slide"
              timeout={0}
            >
              {showReview ? (
                <BookingReview
                  serviceDetails={serviceDetails}
                  onBack={handleFromReview}
                  requestData={requestData}
                />
              ) : showSecond || panelClose ? (
                <ServiceAndAddress
                  onNext={handleToReview}
                  onBack={handleBack}
                  onEdit={handleEdit}
                  setUserService={setUserService}
                  userService={userService}
                  setUserLocation={setUserLocation}
                  userLocation={userLocation}
                />
              ) : (
                <TimeAndDate
                  onNext={handleNext}
                  setUserTime={setUserTime}
                  userTime={userTime}
                  setUserDate={setUserDate}
                  userDate={userDate}
                />
              )}
            </CSSTransition>
          </TransitionGroup>
        </div>
        <div className="booker-right">
          <div className="booker-terms">
            <h2>Note</h2>
            <ul>
              <CancelIcon />
              <li>Free cancelation within 8 hours</li>
              <CalendarIcon />
              <li>Book up to 3 months in advance</li>
              <BellIcon />
              <li>
                You will get notified in:
                <ol>
                  <li>78 hours before service</li>
                  <li>24 hours before service</li>
                  <li>When srevice is on the way</li>
                </ol>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookerSlide;
