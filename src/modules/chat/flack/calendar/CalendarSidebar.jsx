import React from 'react';
import { useCalendar } from './CalendarContext';

import MiniCalendar from './MiniCalendar';

function CalendarSidebar() {
  const { events, editingEvent, handleCreateEvent, handleSelectEvent } =
    useCalendar();

  const sortedEvents = [...events]
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 20);

  const getTypeColor = (type) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-700';

      case 'task':
        return 'bg-green-700';

      case 'reminder':
        return 'bg-orange-700';

      case 'booking':
        return 'bg-purple-700';

      default:
        return 'bg-gray-700';
    }
  };

  return (
    <aside className="flex h-full w-full flex-col overflow-y-auto border-r border-[#3c4043] bg-[#292929] text-[#e8eaed]">
      <div className="p-4">
        <button
          onClick={handleCreateEvent}
          className="w-full cursor-pointer rounded-md bg-[#8ab4f8] px-4 py-2.5 text-sm font-medium text-[#202124] transition-colors hover:bg-[#aecbfa] focus:outline-none focus:ring-2 focus:ring-[#8ab4f8] focus:ring-offset-2 focus:ring-offset-[#292929]"
        >
          + Create Event
        </button>
        <MiniCalendar />
      </div>

      <div className="px-4 pb-1">
        <h2 className="text-xs font-medium uppercase tracking-wide text-[white]!">
          Events
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sortedEvents.length === 0 ? (
          <div className="p-6 text-center text-sm text-[#9aa0a6]">
            No upcoming events.
          </div>
        ) : (
          <div className="space-y-1 px-2 pb-3">
            {sortedEvents.map((event) => {
              const selected = editingEvent?.id === event.id;

              return (
                <button
                  key={event.id}
                  onClick={() => handleSelectEvent(event)}
                  className={`
                    w-full cursor-pointer rounded-md border border-transparent p-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-[#8ab4f8]
                    ${
                      selected
                        ? 'border-[#8ab4f8] bg-[#394457]'
                        : 'hover:bg-[#303134]'
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-[#e8eaed]">
                        {event.title}
                      </div>

                      <div className="mt-1 text-xs text-[#9aa0a6]">
                        {new Date(event.start).toLocaleString()}
                      </div>
                    </div>

                    <span
                      className={`
                        mt-1 h-2.5 w-2.5 shrink-0 rounded-full
                        ${getTypeColor(event.type)}
                      `}
                    ></span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}

export default CalendarSidebar;
