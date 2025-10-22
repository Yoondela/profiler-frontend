import React, { useState } from 'react';
import RequesterSlide from './RequesterSlide';
import RequestReview from './Review';

const Requester = () => {
  const [userService, setUserService] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [subjectSize, setSubjectSize] = useState(null);
  const [tasksToDoAtParent, setTasksToDoAtparent] = useState(null);
  const [showReview, setShowReview] = useState(false);

  const handlePopupOk = () => setShowReview(true);
  const handleBack = () => setShowReview(false);

  // Parse tasks only if provided
  let parsedTasks = {};
  if (
    typeof tasksToDoAtParent === 'string' &&
    tasksToDoAtParent.trim() !== ''
  ) {
    try {
      parsedTasks = JSON.parse(tasksToDoAtParent);
    } catch (error) {
      console.error('Invalid JSON format in tasksToDoAtParent:', error);
    }
  } else if (
    typeof tasksToDoAtParent === 'object' &&
    tasksToDoAtParent !== null
  ) {
    parsedTasks = tasksToDoAtParent;
  }

  console.log('@Parent', parsedTasks);

  const requestData = {
    service: userService,
    location: userLocation,
    selectedSize: subjectSize,
    todoTasks: parsedTasks,
  };

  if (showReview) {
    return (
      <RequestReview
        serviceDetails={{
          service: userService,
          selectedSize: subjectSize,
          location: userLocation,
        }}
        onBack={handleBack}
        requestData={requestData}
      />
    );
  }

  return (
    <RequesterSlide
      setAtParentLocation={setUserLocation}
      setAtParentService={setUserService}
      setAtParentSize={setSubjectSize}
      setGoToReview={setShowReview}
      setTasks={setTasksToDoAtparent}
    />
  );
};

export default Requester;
