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
  // FIX 1: Keeping only one unified open state to drive the panel and the triggers
  const [isOpen, setIsOpen] = useState(true);

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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleContent className="overflow-hidden bg-white data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
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

      {/* FIX 2: CollapsibleTrigger IS the button. Removed the inner <button> tag entirely. */}
      {/* FIX 3: Replaced conditional isExpanded variables with your clean isOpen state flag. */}
      <CollapsibleTrigger
        className={`group flex h-5 w-full items-center justify-center ease-in-out bg-gray-100 shadow-xs p-0 m-0 text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer hover:shadow-sm transition-all
          ${isOpen ? 'duration-200' : 'duration-700'}`}
      >
        <ChevronDown className="w-4 h-4 transition-transform ease-in-out group-data-[state=open]:rotate-180 duration-[1.2s] group-data-[state=closed]:duration-[1.7s]" />
      </CollapsibleTrigger>
    </Collapsible>
  );
}

export default MiniCalendar;
