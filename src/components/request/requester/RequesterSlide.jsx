import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ServiceRequestForm from './ServiceRequestForm';
import TaskPanel from './task-panel';
import { useServiceRequest } from '../contexts/ServiceRequestContext';

const RequesterSlide = ({
  setAtParentService,
  setAtParentLocation,
  setAtParentSize,
  setGoToReview,
  setTasks,
}) => {
  const [showTasksPanel, setShowTasksPanel] = useState(false);
  const [userService, setUserService] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const handleToTasksPanel = () => setShowTasksPanel(true);
  const handleCloseTasksPanel = () => setShowTasksPanel(false);

  return (
    <div classname="container">
      <div className="containe requester-container">
        <div className="requester-header">
          <h2>Get a service</h2>
        </div>
        <TransitionGroup component={null}>
          <CSSTransition
            key={showTasksPanel ? 'tasksPanel' : 'first'}
            classNames="slide"
          >
            {showTasksPanel ? (
              <TaskPanel
                onClosePanel={handleCloseTasksPanel}
                setTasks={setTasks}
              />
            ) : (
              <ServiceRequestForm
                onEdit={handleToTasksPanel}
                setSbjSize={setAtParentSize}
                setGoToReview={setGoToReview}
              />
            )}
          </CSSTransition>
        </TransitionGroup>
      </div>
    </div>
  );
};

export default RequesterSlide;
