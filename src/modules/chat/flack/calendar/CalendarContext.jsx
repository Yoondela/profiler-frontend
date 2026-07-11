import { createContext, useContext, useState, useEffect } from 'react';
import { usePortfolioContext } from '@/api/context/portfolioContext';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '@/api/sync/calendarApi';

const CalendarContext = createContext();

export function CalendarProvider({ children }) {
  const { companyId } = usePortfolioContext();

  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedDates, setSelectedDates] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch events from API when component mounts or companyId changes
  useEffect(() => {
    if (!companyId) return;

    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const startOfMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        );
        const endOfMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        );

        const data = await getEvents(
          startOfMonth.toISOString(),
          endOfMonth.toISOString(),
          companyId
        );

        setEvents(data || []);
      } catch (err) {
        console.error('Failed to fetch calendar events:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [companyId]);

  const handleCreateEvent = () => {
    console.log('Getting Events...');
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

  const handleSave = async (data) => {
    try {
      setIsLoading(true);
      setError(null);

      const eventPayload = {
        ...data,
        companyId,
      };

      if (editingEvent) {
        // Update existing event
        console.log('Updating existing event:', editingEvent.id, eventPayload);
        await updateEvent(editingEvent.id, eventPayload);

        setEvents((prev) =>
          prev.map((event) =>
            event.id === editingEvent.id
              ? {
                  ...event,
                  ...eventPayload,
                }
              : event
          )
        );
      } else {
        // Create new event
        console.log('Creating new event:', eventPayload);
        const newEvent = await createEvent(eventPayload);

        setEvents((prev) => [
          ...prev,
          {
            id: newEvent.id || crypto.randomUUID(),
            source: 'flack',
            editable: true,
            ...eventPayload,
          },
        ]);
      }

      setIsModalOpen(false);
      setEditingEvent(null);
      setSelectedDates(null);
    } catch (err) {
      console.error('Failed to save event:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Deleting event with ID:', eventId);
      await deleteEvent(eventId);

      setEvents((prev) => prev.filter((event) => event.id !== eventId));

      setIsModalOpen(false);
      setEditingEvent(null);
      setSelectedDates(null);
    } catch (err) {
      console.error('Failed to delete event:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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
        isLoading,
        error,

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
