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
  isToday,
} from 'date-fns';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { useState } from 'react';
import { useCalendar } from './CalendarContext';

import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

function MiniCalendar() {
  const { events, selectedDate, setSelectedDate } = useCalendar();

  const getEventsForDay = (date) => {
    return events.filter((event) => isSameDay(new Date(event.start), date));
  };

  const [currentMonth, setCurrentMonth] = useState(new Date());
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
      const isSelected = isSameDay(day, selectedDate);
      const isCurrentDay = isToday(day);

      days.push(
        <button
          type="button"
          key={day.toString()}
          aria-label={format(day, 'EEEE, MMMM d, yyyy')}
          aria-pressed={isSelected}
          onClick={() => {
            setSelectedDate(cloneDay);
            setCurrentMonth(cloneDay);
          }}
          className={`
            relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-transparent
            text-[11px] font-medium text-[#bdc1c6] transition-colors
            ${!isSameMonth(day, currentMonth) ? 'text-[#5f6368]' : ''}
            ${
              isSelected
                ? 'border-[#8ab4f8] bg-[#8ab4f8] !text-[#202124] hover:bg-[#aecbfa]'
                : isCurrentDay
                  ? 'border-[#8ab4f8] !text-[#8ab4f8] hover:bg-[#3c4043]'
                  : 'hover:bg-[#3c4043] hover:text-[#e8eaed]'
            }
          `}
        >
          <span>{format(day, 'd')}</span>

          {dayEvents.length > 0 && (
            <span className="absolute bottom-[2px] flex gap-[2px]">
              {dayEvents.slice(0, 3).map((_, index) => (
                <span
                  key={index}
                  className={`
                    h-0.5 w-0.5 rounded-full
                    ${isSelected ? 'bg-[#202124]' : 'bg-[#8ab4f8]'}
                    `}
                />
              ))}
            </span>
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
      <CollapsibleContent className="overflow-hidden bg-[#292929] px-2 pb-3 pt-2 data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <div>
          <div className="mb-3 flex items-center justify-between px-1">
            <div className="text-sm font-medium text-[#e8eaed]">
              {format(currentMonth, 'MMMM yyyy')}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[#bdc1c6] transition-colors hover:bg-[#3c4043] hover:text-[#e8eaed]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                aria-label="Next month"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[#bdc1c6] transition-colors hover:bg-[#3c4043] hover:text-[#e8eaed]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mb-1 grid grid-cols-7 text-center text-[10px] font-medium text-[#9aa0a6]">
            <div>S</div>
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
          </div>

          <div className="space-y-0.5">{rows}</div>
        </div>
      </CollapsibleContent>

      <CollapsibleTrigger
        aria-label={isOpen ? 'Collapse mini calendar' : 'Expand mini calendar'}
        className={`group flex h-7 w-full cursor-pointer items-center justify-center rounded-b-lg border-t border-[#3c4043] bg-[#292929] text-[#9aa0a6] transition-colors hover:bg-[#303134] hover:text-[#e8eaed]
          ${isOpen ? 'duration-200' : 'duration-700'}`}
      >
        <ChevronDown className="h-4 w-4 transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
    </Collapsible>
  );
}

export default MiniCalendar;
