import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
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
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [rangeError, setRangeError] = useState(null);
  const [mutationAction, setMutationAction] = useState(null);
  const [mutationError, setMutationError] = useState(null);
  const [eventsCompanyId, setEventsCompanyId] = useState(companyId);
  const requestIdRef = useRef(0);
  const lastRequestedRangeRef = useRef(null);
  const requestCompanyIdRef = useRef(companyId);
  const visibleEvents = eventsCompanyId === companyId ? events : [];
  const isMutating = mutationAction !== null;

  const loadEvents = useCallback(
    async (start, end) => {
      if (!companyId || !start || !end) return;

      const startIso = new Date(start).toISOString();
      const endIso = new Date(end).toISOString();
      const rangeKey = `${companyId}:${startIso}:${endIso}`;

      if (requestCompanyIdRef.current !== companyId) {
        requestCompanyIdRef.current = companyId;
        requestIdRef.current += 1;
        lastRequestedRangeRef.current = null;
      }

      if (lastRequestedRangeRef.current === rangeKey) return;

      lastRequestedRangeRef.current = rangeKey;
      const requestId = ++requestIdRef.current;

      try {
        setIsLoadingEvents(true);
        setRangeError(null);

        const data = await getEvents(startIso, endIso, companyId);

        if (requestId === requestIdRef.current) {
          setEvents(data || []);
          setEventsCompanyId(companyId);
        }
      } catch (err) {
        if (requestId === requestIdRef.current) {
          lastRequestedRangeRef.current = null;
          console.error('Failed to fetch calendar events:', err);
          setRangeError('Unable to load calendar events.');
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoadingEvents(false);
        }
      }
    },
    [companyId]
  );

  const handleCreateEvent = () => {
    console.log('Getting Events...');
    setMutationError(null);
    setSelectedDates({
      start: new Date(),
      end: new Date(),
    });

    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setMutationError(null);
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleSelectDates = (dates) => {
    setMutationError(null);
    setSelectedDates(dates);
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleSave = async (data) => {
    try {
      setMutationAction('save');
      setMutationError(null);

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
        const createdEvent = {
          id: newEvent.id || crypto.randomUUID(),
          source: 'flack',
          editable: true,
          ...eventPayload,
        };

        setEventsCompanyId(companyId);
        setEvents((prev) =>
          eventsCompanyId === companyId
            ? [...prev, createdEvent]
            : [createdEvent]
        );
      }

      setIsModalOpen(false);
      setEditingEvent(null);
      setSelectedDates(null);
    } catch (err) {
      console.error('Failed to save event:', err);
      setMutationError('Unable to save this event. Please try again.');
    } finally {
      setMutationAction(null);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      setMutationAction('delete');
      setMutationError(null);

      console.log('Deleting event with ID:', eventId);
      await deleteEvent(eventId);

      setEventsCompanyId(companyId);
      setEvents((prev) => prev.filter((event) => event.id !== eventId));

      setIsModalOpen(false);
      setEditingEvent(null);
      setSelectedDates(null);
    } catch (err) {
      console.error('Failed to delete event:', err);
      setMutationError('Unable to delete this event. Please try again.');
    } finally {
      setMutationAction(null);
    }
  };

  const closeModal = () => {
    if (isMutating) return;

    setIsModalOpen(false);
    setEditingEvent(null);
    setSelectedDates(null);
    setMutationError(null);
  };

  return (
    <CalendarContext.Provider
      value={{
        events: visibleEvents,
        setEvents,
        isLoadingEvents,
        rangeError,
        isMutating,
        mutationAction,
        mutationError,

        isModalOpen,
        editingEvent,
        selectedDates,
        selectedDate,

        setEditingEvent,
        setSelectedDates,
        setIsModalOpen,
        setSelectedDate,
        loadEvents,

        handleCreateEvent,
        handleSelectEvent,
        handleSelectDates,
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
