import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import TimeAndDate from './TimeAndDate';
import ServiceAndAddress from './ServiceAndAddress';
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

  const [userTime, setUserTime] = useState(parentTime || '');
  const [userDate, setUserDate] = useState(parentDate || null);
  const [userService, setUserService] = useState(defaultService || '');
  const [userLocation, setUserLocation] = useState(defaultLocation || '');

  const handleNext = () => setShowSecond(true);
  const handleBack = () => {
    setShowSecond(false);
    if (panelClose) setPanelClose(false);
  };

  const handleToReview = () => setShowReview(true);
  const handleFromReview = () => setShowReview(false);

  useEffect(() => {
    setDefaultService(userService);
    setDefaultLocation(userLocation);
    setParentDate(userDate);
    setParentTime(userTime);
  }, [userService, userLocation, userDate, userTime]);

  const serviceDetails = [
    userDate ? format(userDate, 'EEE MMM dd yyyy') : 'No date selected',
    userTime,
    userService,
    userLocation,
  ];

  return (
    <div className="booker-child-container">
      <div className="booker">
        <div className="booker-left">
          <AnimatePresence mode="wait">
            {showReview ? (
              <motion.div
                key="review"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <BookingReview
                  serviceDetails={serviceDetails}
                  onBack={handleFromReview}
                  requestData={requestData}
                />
              </motion.div>
            ) : showSecond || panelClose ? (
              <motion.div
                key="second"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ServiceAndAddress
                  onNext={handleToReview}
                  onBack={handleBack}
                  onEdit={handleEdit}
                  setUserService={setUserService}
                  userService={userService}
                  setUserLocation={setUserLocation}
                  userLocation={userLocation}
                />
              </motion.div>
            ) : (
              <motion.div
                key="first"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TimeAndDate
                  onNext={handleNext}
                  setUserTime={setUserTime}
                  userTime={userTime}
                  setUserDate={setUserDate}
                  userDate={userDate}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="booker-right">
          <div className="booker-terms">
            <h2>Note</h2>
            <ul>
              <li>
                <CancelIcon /> Free cancelation within 8 hours
              </li>
              <li>
                <CalendarIcon /> Book up to 3 months in advance
              </li>
              <li>
                <BellIcon /> You will get notified in:
                <ol>
                  <li>78 hours before service</li>
                  <li>24 hours before service</li>
                  <li>When service is on the way</li>
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
