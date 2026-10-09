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
import { useIsMobile } from '@/hooks/use-mobile';

function CalendarView() {
  const calendarRef = useRef(null);
  const visibleRangeRef = useRef(null);
  const isMobile = useIsMobile();
  const currentTime = new Date(Date.now() - 90 * 60 * 1000)
    .toTimeString()
    .slice(0, 8);

  const {
    events,
    setEvents,
    isLoadingEvents,
    rangeError,
    selectedDate,
    handleCreateEvent,
    handleSelectEvent,
    handleSelectDates,
    loadEvents,
  } = useCalendar();

  useEffect(() => {
    if (!calendarRef.current) {
      return;
    }

    const api = calendarRef.current.getApi();

    api.gotoDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (!calendarRef.current) return;

    calendarRef.current
      .getApi()
      .changeView(isMobile ? 'listWeek' : 'dayGridMonth');
  }, [isMobile]);

  useEffect(() => {
    const range = visibleRangeRef.current;
    if (range) {
      loadEvents(range.start, range.end);
    }
  }, [loadEvents]);

  const handleDatesSet = (dateInfo) => {
    const range = {
      start: dateInfo.start,
      end: dateInfo.end,
    };

    visibleRangeRef.current = range;
    loadEvents(range.start, range.end);
  };

  const retryVisibleRange = () => {
    const range = visibleRangeRef.current;
    if (range) {
      loadEvents(range.start, range.end);
    }
  };

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
      <div className="google-calendar flex h-full min-h-0 w-full flex-col bg-[#292929] p-2 sm:p-4 md:w-[76%] lg:p-6">
        {isMobile && (
          <div className="mb-2 flex shrink-0 items-center justify-between gap-3">
            <h1 className="text-base font-semibold text-white">Calendar</h1>
            <button
              type="button"
              onClick={handleCreateEvent}
              className="min-h-11 rounded-lg bg-[#8ab4f8] px-4 text-sm font-medium text-[#202124]"
            >
              + New event
            </button>
          </div>
        )}
        {(isLoadingEvents || rangeError) && (
          <div
            className={`mb-2 flex min-h-10 shrink-0 items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm ${
              rangeError
                ? 'border-red-400/40 bg-red-500/10 text-red-100'
                : 'border-zinc-700 bg-zinc-800/70 text-zinc-300'
            }`}
            role={rangeError ? 'alert' : 'status'}
            aria-live="polite"
          >
            <span>{rangeError || 'Loading events…'}</span>
            {rangeError && (
              <button
                type="button"
                onClick={retryVisibleRange}
                className="min-h-9 shrink-0 rounded-md border border-red-300/50 px-3 font-medium text-red-50 transition hover:bg-red-400/10"
              >
                Retry
              </button>
            )}
          </div>
        )}
        <div className="min-h-0 w-full flex-1 overflow-hidden">
          <FullCalendar
            ref={calendarRef}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            initialView={isMobile ? 'listWeek' : 'dayGridMonth'}
            views={{
              timeGridWeek: { allDaySlot: false, scrollTime: currentTime },
              timeGridDay: { allDaySlot: false, scrollTime: currentTime },
            }}
            height="100%"
            expandRows
            nowIndicator
            dayMaxEvents
            fixedWeekCount={false}
            headerToolbar={
              isMobile
                ? {
                    left: 'prev,next',
                    center: 'title',
                    right: 'today',
                  }
                : {
                    left: 'today prev,next title',
                    center: '',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
                  }
            }
            footerToolbar={
              isMobile
                ? {
                    left: '',
                    center: 'listWeek,timeGridDay,dayGridMonth',
                    right: '',
                  }
                : false
            }
            buttonText={{
              today: 'Today',
              month: 'Month',
              week: 'Week',
              day: 'Day',
              list: 'Schedule',
            }}
            dayHeaderFormat={{ weekday: 'short' }}
            eventTimeFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short',
            }}
            events={events}
            datesSet={handleDatesSet}
            selectable
            editable
            select={(info) => {
              handleSelectDates({
                start: info.start,
                end: info.end,
              });
            }}
            eventClick={(info) => {
              handleSelectEvent({
                id: info.event.id,
                title: info.event.title,
                start: info.event.start,
                end: info.event.end,
                source: info.event.extendedProps.source,
                type: info.event.extendedProps.type,
                location: info.event.extendedProps.location,
                description: info.event.extendedProps.description,
              });
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
                <div className="flex min-w-0 items-center gap-1 overflow-hidden">
                  {info.timeText && (
                    <span className="shrink-0 text-[11px] opacity-80">
                      {info.timeText}
                    </span>
                  )}
                  <span className="truncate text-xs font-medium">
                    {info.event.title}
                  </span>
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
