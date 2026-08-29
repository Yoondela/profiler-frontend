import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TimeAndDate from './TimeAndDate';
import ServiceAndAddress from './ServiceAndAddress';

import CancelIcon from '../../../assets/icons/booker-icons/cancel.svg?react';
import BellIcon from '../../../assets/icons/booker-icons/bell.svg?react';
import CalendarIcon from '../../../assets/icons/booker-icons/calendar.svg?react';

const BookerSlide = () => {
  const [showSecond, setShowSecond] = useState(false);

  const handleNext = () => setShowSecond(true);
  const handleBack = () => setShowSecond(false);

  return (
    <div className="booker-child-container">
      <div className="booker">
        <div className="booker-left">
          <AnimatePresence mode="wait">
            {showSecond ? (
              <motion.div
                key="second"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ServiceAndAddress onBack={handleBack} />
              </motion.div>
            ) : (
              <motion.div
                key="first"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TimeAndDate onNext={handleNext} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="booker-right">
          <div className="booker-terms">
            <p className="booker-terms__eyebrow">Book with confidence</p>
            <h2>Your booking, your schedule.</h2>
            <ul>
              <li>
                <CancelIcon /> Free cancellation within 8 hours
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
