import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

function CalendarView() {

  const events = [
    {
      id: '1',
      title: 'Plumbing at 14 Main Street',
      start: '2026-07-29T09:00:00',
      end: '2026-07-29T11:00:00',
    },
    {
      id: '2',
      title: 'Team Meeting',
      start: '2026-07-30T14:00:00',
      end: '2026-07-30T15:00:00',
    },
  ];
  
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      }}
    />
  );
}

export default CalendarView;
