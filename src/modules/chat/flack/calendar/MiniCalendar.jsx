import {
  addDays,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
} from 'date-fns';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { useState } from 'react';
import { useCalendar } from './CalendarContext';

import { ChevronDown } from 'lucide-react';

function MiniCalendar() {
  const { events, selectedDate, setSelectedDate } = useCalendar();

  const getEventsForDay = (date) => {
    return events.filter((event) => isSameDay(new Date(event.start), date));
  };

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);

  const monthEnd = endOfMonth(currentMonth);

  const startDate = startOfWeek(monthStart);

  const endDate = endOfWeek(monthEnd);

  const rows = [];

  let day = startDate;

  while (day <= endDate) {
    const days = [];

    for (let i = 0; i < 7; i++) {
      const cloneDay = day;

      const dayEvents = getEventsForDay(day);

      days.push(
        <button
          key={day.toString()}
          onClick={() => {
            setSelectedDate(cloneDay);
            setCurrentMonth(cloneDay);
          }}
          className={`
            flex h-6 w-6 flex-col items-center justify-center rounded-full text-xs text-black
            ${!isSameMonth(day, currentMonth) ? 'text-gray-300' : ''}
            ${
              isSameDay(day, selectedDate)
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100'
            }
          `}
        >
          <span>{format(day, 'd')}</span>

          {dayEvents.length > 0 && (
            <div className="mt-0.5 flex gap-[2px]">
              {dayEvents.slice(0, 3).map((_, index) => (
                <span
                  key={index}
                  className={`
                      h-1.5 w-1.5 rounded-full
                      ${
                        isSameDay(day, selectedDate)
                          ? 'bg-white'
                          : 'bg-blue-500'
                      }
                    `}
                />
              ))}
            </div>
          )}
        </button>
      );

      day = addDays(day, 1);
    }

    rows.push(
      <div
        key={day.toString()}
        className="grid grid-cols-7 justify-items-center"
      >
        {days}
      </div>
    );
  }

  return (
    <Collapsible>
      <CollapsibleTrigger className="w-full">
        <div className="flex min-w-full content-between justify-between">
          <span>Calendar</span>
          <ChevronDown />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="rounded-xl p-0">
          <div className="mb-1 flex items-center justify-between text-black">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="rounded p-1 hover:bg-gray-100"
            >
              ←
            </button>

            <div className="font-medium">
              {format(currentMonth, 'MMMM yyyy')}
            </div>

            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="rounded p-2 hover:bg-gray-100"
            >
              →
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 text-center text-xs text-gray-500">
            <div>Su</div>
            <div>Mo</div>
            <div>Tu</div>
            <div>We</div>
            <div>Th</div>
            <div>Fr</div>
            <div>Sa</div>
          </div>

          <div className="space-y-1">{rows}</div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default MiniCalendar;
