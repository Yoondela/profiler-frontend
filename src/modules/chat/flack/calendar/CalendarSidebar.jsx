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
    <aside className="flex h-full w-full flex-col bg-[#292929] overflow-y-auto">
      <div className="p-4">
        <button
          onClick={handleCreateEvent}
          className="
            w-full rounded-xl
            cursor-pointer
            px-4 py-3
            font-medium
            text-white
            transition
            hover:bg-blue-700
          "
        >
          + Create Event
        </button>
        <MiniCalendar />
      </div>

      <div className="px-4 pt-3">
        <h2 className="text-lg !text-[white] !font-semibold">Next 7 days</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sortedEvents.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">
            No upcoming events.
          </div>
        ) : (
          <div className="space-y-0 p-2">
            {sortedEvents.map((event) => {
              const selected = editingEvent?.id === event.id;

              return (
                <button
                  key={event.id}
                  onClick={() => handleSelectEvent(event)}
                  className={`
                    w-full rounded-sm p-2 text-left transition
                    ${
                      selected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-zinc-700/50'
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{event.title}</div>

                      <div className="mt-1 text-sm text-gray-500">
                        {new Date(event.start).toLocaleString()}
                      </div>
                    </div>

                    <span
                      className={`
                        rounded-full
                        px-2 py-1
                        text-xs
                        font-medium
                        ${getTypeColor(event.type)}
                      `}
                    >
                      
                    </span>
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
