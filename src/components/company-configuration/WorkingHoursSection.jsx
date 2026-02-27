import { useState } from 'react';
import { Clock8, ClockArrowDown } from 'lucide-react';

const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const createInitialState = () =>
  days.reduce((acc, day) => {
    acc[day] = {
      enabled: false,
      shifts: [{ start: '', end: '' }], // future-proof
    };
    return acc;
  }, {});

export default function OfficeOursSection() {
  const [hours, setHours] = useState(createInitialState());

  // --- Helpers ---

  const minutesFromTime = (time) => {
    if (!time) return 0;
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  // --- Handlers ---

  const toggleDay = (day) => {
    setHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      },
    }));
  };

  const updateTime = (day, field, value) => {
    const updatedShifts = [...hours[day].shifts];
    updatedShifts[0][field] = value;

    const { start, end } = updatedShifts[0];

    // Auto-disable if equal
    if (start && end && start === end) {
      setHours((prev) => ({
        ...prev,
        [day]: {
          ...prev[day],
          enabled: false,
          shifts: updatedShifts,
        },
      }));
      return;
    }

    setHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        shifts: updatedShifts,
      },
    }));
  };

  const repeatMondayToWeekdays = () => {
    const monday = hours.monday;
    const updated = { ...hours };

    ['tuesday', 'wednesday', 'thursday', 'friday'].forEach((d) => {
      updated[d] = JSON.parse(JSON.stringify(monday));
    });

    setHours(updated);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold text-gray-900">Office hours</h1>

      <p className="mt-1 text-sm text-gray-500">
        Set the days and times you're available to work.
      </p>

      <div className="mt-4 flex items-center gap-3">
        <ClockArrowDown className="h-5 w-5 text-gray-700" />

        <button
          onClick={repeatMondayToWeekdays}
          className="text-sm font-medium text-gray-900 hover:underline hover:cursor-pointer"
        >
          <strong>Click</strong> here to repeat Monday for weekdays
        </button>
      </div>
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 space-y-5">
        {days.map((day) => {
          const isEnabled = hours[day].enabled;
          const shift = hours[day].shifts[0];

          const isInvalid =
            shift.start &&
            shift.end &&
            minutesFromTime(shift.end) <= minutesFromTime(shift.start);

          return (
            <div key={day} className="flex items-center justify-between">
              {/* Left */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleDay(day)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isEnabled ? 'bg-blue-200' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      isEnabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>

                <span className="text-sm font-medium text-gray-900 capitalize">
                  {day}
                </span>
              </div>

              {/* Right */}
              {isEnabled ? (
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={shift.start}
                    onChange={(e) => updateTime(day, 'start', e.target.value)}
                    className={`rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                      isInvalid ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />

                  <span className="text-sm text-gray-400">–</span>

                  <input
                    type="time"
                    value={shift.end}
                    onChange={(e) => updateTime(day, 'end', e.target.value)}
                    className={`rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                      isInvalid ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
              ) : (
                <p>Closed</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
