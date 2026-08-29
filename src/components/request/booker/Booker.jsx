import { motion, AnimatePresence } from 'framer-motion';
import BookerSlide from './BookerSlide';

const Booker = () => {
  return (
    <div className="booker-container">
      <div className="booker-header">
        <p className="homepage-eyebrow">Schedule ahead</p>
        <h2 className="header">Planning ahead?</h2>
        <p>Choose a date and time that works best for you.</p>
      </div>
      <div>
        <AnimatePresence mode="wait">
          <motion.div
            key="first"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BookerSlide />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Booker;
