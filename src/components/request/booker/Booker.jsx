import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
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
  const [showTimeDate, setShowTimeDate] = useState(false);

  const [tasksToDo, setTasksToDo] = useState('');
  let parsedTasks = {};

  if (typeof tasksToDo === 'string' && tasksToDo.trim() !== '') {
    try {
      parsedTasks = JSON.parse(tasksToDo);
    } catch (error) {
      console.error('Invalid JSON format in tasksToDo:', error);
      parsedTasks = {}; // Fallback to an empty object if parsing fails
    }
  } else if (typeof tasksToDo === 'object' && tasksToDo !== null) {
    parsedTasks = tasksToDo;
  }

  const handleNext = () => setShowSecond(true);
  const handleBack = () => setShowSecond(false);
  const handleEdit = () => setShowEdit(true);
  const handleClosePanel = () => {
    setShowEdit(false);
    setClosingPanel(true);
    setShowTimeDate(true);
  };

  const requestData = {
    date: defaultDate,
    time: defaultTime,
    service: defaultService,
    location: defaultLocation,
    todoTasks: parsedTasks, // Placing parsed tasks inside 'todoTasks'
  };

  return (
    <div className="booker-container">
      <div className="booker-header">
        <h2 className="header">Book for a future date</h2>
      </div>
      <TransitionGroup component={null}>
        <CSSTransition key={showEdit ? 'second' : 'first'} classNames="slide">
          {showEdit ? (
            <TaskPanel
              onClosePanel={handleClosePanel}
              defaultService={defaultService}
              setTasksAtParent={setTasksToDo}
            />
          ) : (
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
          )}
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default Booker;
