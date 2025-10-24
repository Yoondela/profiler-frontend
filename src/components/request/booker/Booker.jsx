import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BookerSlide from './BookerSlide';
import TaskPanel from '../task-panel';

const Booker = () => {
  const [showSecond, setShowSecond] = useState(false);
  const [defaultDate, setDefaultDate] = useState(null);
  const [defaultTime, setDefaultTime] = useState(null);
  const [defaultService, setDefaultService] = useState(null);
  const [defaultLocation, setDefaultLocation] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [closingPanel, setClosingPanel] = useState(false);

  const [tasksToDo, setTasksToDo] = useState('');

  const parsedTasks =
    typeof tasksToDo === 'string' && tasksToDo.trim() !== ''
      ? (() => {
          try {
            return JSON.parse(tasksToDo);
          } catch (error) {
            console.error('Invalid JSON format in tasksToDo:', error);
            return {};
          }
        })()
      : typeof tasksToDo === 'object' && tasksToDo !== null
        ? tasksToDo
        : {};

  const handleEdit = () => setShowEdit(true);
  const handleClosePanel = () => {
    setShowEdit(false);
    setClosingPanel(true);
  };

  const requestData = {
    date: defaultDate,
    time: defaultTime,
    service: defaultService,
    location: defaultLocation,
    todoTasks: parsedTasks,
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
                requestData={requestData}
                handleEdit={handleEdit}
                setDefaultService={setDefaultService}
                setPanelClose={setClosingPanel}
                panelClose={closingPanel}
                defaultService={defaultService}
                setDefaultLocation={setDefaultLocation}
                defaultLocation={defaultLocation}
                setParentDate={setDefaultDate}
                setParentTime={setDefaultTime}
                parentDate={defaultDate}
                parentTime={defaultTime}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Booker;
