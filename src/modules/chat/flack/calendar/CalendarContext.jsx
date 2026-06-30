import { createContext, useContext, useState } from 'react';

const CalendarContext = createContext();

export function CalendarProvider({ children }) {
  const [events, setEvents] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingEvent, setEditingEvent] = useState(null);

  const [selectedDates, setSelectedDates] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleCreateEvent = () => {
    setSelectedDates({
      start: new Date(),
      end: new Date(),
    });

    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleSave = (data) => {
    if (editingEvent) {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === editingEvent.id
            ? {
                ...event,
                ...data,
              }
            : event
        )
      );
    } else {
      setEvents((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          source: 'flack',
          editable: true,
          ...data,
        },
      ]);
    }

    setIsModalOpen(false);
    setEditingEvent(null);
    setSelectedDates(null);
  };

  const handleDelete = (eventId) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));

    setIsModalOpen(false);
    setEditingEvent(null);
    setSelectedDates(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setSelectedDates(null);
  };

  return (
    <CalendarContext.Provider
      value={{
        events,
        setEvents,

        isModalOpen,
        editingEvent,
        selectedDates,
        selectedDate,

        setEditingEvent,
        setSelectedDates,
        setIsModalOpen,
        setSelectedDate,

        handleCreateEvent,
        handleSelectEvent,
        handleSave,
        handleDelete,
        closeModal,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  return useContext(CalendarContext);
}
