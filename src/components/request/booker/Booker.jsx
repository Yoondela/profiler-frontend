import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BookerSlide from './BookerSlide';
import TaskPanel from '../task-panel';
import { useServiceBooking } from '../contexts/ServiceBookingContext';

const Booker = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [closingPanel, setClosingPanel] = useState(false);

  const [tasksToDo, setTasksToDo] = useState('');

  const handleEdit = () => setShowEdit(true);
  const handleClosePanel = () => {
    setShowEdit(false);
    setClosingPanel(true);
  };

  return (
    <div className="booker-container">
      <div className="booker-header">
        <h2 className="header">Book for a future date</h2>
      </div>
      <div>
        <AnimatePresence mode="wait">
          {showEdit ? (
            <motion.div
              key="second"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TaskPanel
                onClosePanel={handleClosePanel}
                defaultService={defaultService}
                setTasksAtParent={setTasksToDo}
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
              <BookerSlide
                handleEdit={handleEdit}
                setPanelClose={setClosingPanel}
                panelClose={closingPanel}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Booker;
