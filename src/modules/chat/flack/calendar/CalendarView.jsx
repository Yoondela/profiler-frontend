import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import './cal.css';

import EventModal from './EventModal';
import { useCalendar } from './CalendarContext';
import { updateEvent } from '@/api/sync/calendarApi';
import { useRef, useEffect } from 'react';

function CalendarView() {
  const calendarRef = useRef(null);

  const {
    events,
    setEvents,
    setSelectedDates,
    setEditingEvent,
    setIsModalOpen,
    selectedDate,
  } = useCalendar();

  useEffect(() => {
    if (!calendarRef.current) {
      return;
    }

    const api = calendarRef.current.getApi();

    api.gotoDate(selectedDate);
  }, [selectedDate]);

  const handleEventDrop = async (info) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === info.event.id
          ? {
              ...event,
              start: info.event.start,
              end: info.event.end,
            }
          : event
      )
    );

    await updateEvent(info.event.id, {
      start: info.event.start,
      end: info.event.end,
    }).catch((err) => {
      console.error('Failed to update event on drop:', err);
      info.revert();
    });
  };

  const handleEventResize = async (info) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === info.event.id
          ? {
              ...event,
              start: info.event.start,
              end: info.event.end,
            }
          : event
      )
    );

    await updateEvent(info.event.id, {
      start: info.event.start,
      end: info.event.end,
    }).catch((err) => {
      console.error('Failed to update event on resize:', err);
      info.revert();
    });
  };

  return (
    <>
      <div className="h-full w-[76%] p-3 sm:p-4 lg:p-6 bg-[#292929]">
        <div className="h-full w-full overflow-hidden">
          <FullCalendar
            ref={calendarRef}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            initialView="dayGridMonth"
            height="100%"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
            }}
            events={events}
            selectable
            editable
            select={(info) => {
              setSelectedDates({
                start: info.start,
                end: info.end,
              });

              setEditingEvent(null);
              setIsModalOpen(true);
            }}
            eventClick={(info) => {
              setEditingEvent({
                id: info.event.id,
                title: info.event.title,
                start: info.event.start,
                end: info.event.end,
                source: info.event.extendedProps.source,
                type: info.event.extendedProps.type,
                location: info.event.extendedProps.location,
                description: info.event.extendedProps.description,
              });

              setIsModalOpen(true);
            }}
            eventClassNames={(arg) => {
              const type = arg.event.extendedProps.type;

              switch (type) {
                case 'meeting':
                  return ['meeting-event'];

                case 'task':
                  return ['task-event'];

                case 'reminder':
                  return ['reminder-event'];

                default:
                  return [];
              }
            }}
            eventContent={(info) => {
              return (
                <div className="overflow-hidden">
                  <div className="truncate font-medium">{info.event.title}</div>

                  <div className="text-xs opacity-80">{info.timeText}</div>
                </div>
              );
            }}
            eventDrop={(info) => {
              handleEventDrop(info);
            }}
            eventResize={(info) => {
              handleEventResize(info);
            }}
          />
        </div>
      </div>

      <EventModal />
    </>
  );
}

export default CalendarView;
