import { motion, AnimatePresence } from 'framer-motion';
import BookerSlide from './BookerSlide';

const Booker = () => {
  return (
    <div className="booker-container">
      <div className="booker-header">
        <h2 className="header">Book for a future date</h2>
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
