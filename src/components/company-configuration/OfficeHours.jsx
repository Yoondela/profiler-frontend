import { useState, useEffect } from 'react';
import { Clock8, ClockArrowDown } from 'lucide-react';
import RequireAdminPassword from './RequireAdminPassword';
import { updateOfficeHours } from '@/api/sync/SyncPortfolio';
import { useUserContext } from '@/api/context/userContext';
import { usePortfolioContext } from '@/api/context/portfolioContext';
import { toast } from 'sonner';

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

export default function OfficeHoursSection() {
  const [hours, setHours] = useState(createInitialState());
  const [applySettings, setApplySettings] = useState(false);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { userCtx, appUser_ID } = useUserContext();
  const { getWorkingHours } = usePortfolioContext();

  const getLoadedWorkingHours = () => getWorkingHours && getWorkingHours();

  const hasExistingWorkingHours = () => {
    const working = getLoadedWorkingHours();
    return Boolean(working && working.weeklySchedule && Object.keys(working.weeklySchedule).length);
  };

  console.log('Current office hours state:', getWorkingHours());
  // --- Helpers ---

  const minutesFromTime = (time) => {
    if (!time) return 0;
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const calculateWeeklyTotal = () => {
    let totalMinutes = 0;

    Object.values(hours).forEach((day) => {
      if (!day.enabled) return;

      day.shifts.forEach((shift) => {
        const start = minutesFromTime(shift.start);
        const end = minutesFromTime(shift.end);

        if (end > start) {
          totalMinutes += end - start;
        }
      });
    });

    return (totalMinutes / 60).toFixed(1);
  };

  // --- Handlers ---

  const toggleDay = (day) => {
    setApplySettings(false);
    setHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      },
    }));
  };

  const buildPayload = () => {
    const weeklySchedule = days.reduce((acc, day) => {
      const current = hours[day];
      const shift = current.shifts[0];

      if (current.enabled && shift.start && shift.end) {
        acc[day] = {
          isOpen: true,
          opensAt: shift.start,
          closesAt: shift.end,
        };
      } else {
        acc[day] = {
          isOpen: false,
        };
      }

      return acc;
    }, {});

    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      weeklySchedule,
    };
  };

  const handleApplyToggle = () => {
    if (applySettings) {
      setApplySettings(false);
      return;
    }

    setShowAdminPrompt(true);
  };

  const handleAdminSubmit = async (payload) => {
    try {
      setIsSaving(true);
      console.log('Submit payload:', payload);

      const userId = userCtx?.id || appUser_ID;
      if (!userId) {
        throw new Error('No user ID available from UserContext');
      }

      await updateOfficeHours(userId, payload);

      toast.success('Office hours updated');
      setApplySettings(true);
      setShowAdminPrompt(false);
    } catch (err) {
      console.error('Failed to update office hours', err);
      toast.error(err?.message || 'Failed to update office hours');
    } finally {
      setIsSaving(false);
    }
  };

  const updateTime = (day, field, value) => {
    setApplySettings(false);
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
    setApplySettings(false);
    const monday = hours.monday;
    const updated = { ...hours };

    ['tuesday', 'wednesday', 'thursday', 'friday'].forEach((d) => {
      updated[d] = JSON.parse(JSON.stringify(monday));
    });

    setHours(updated);
  };

  // Initialize hours from portfolio workingHours when available
  useEffect(() => {
    const working = getWorkingHours && getWorkingHours();
    if (!working) return;

    const schedule = working.weeklySchedule || {};
    const mapped = days.reduce((acc, day) => {
      const entry = schedule[day];
      if (entry && entry.isOpen) {
        acc[day] = {
          enabled: true,
          shifts: [
            {
              start: entry.opensAt || '',
              end: entry.closesAt || '',
            },
          ],
        };
      } else if (entry) {
        // explicit entry but closed
        acc[day] = {
          enabled: false,
          shifts: [
            {
              start: entry.opensAt || '',
              end: entry.closesAt || '',
            },
          ],
        };
      } else {
        acc[day] = { enabled: false, shifts: [{ start: '', end: '' }] };
      }
      return acc;
    }, {});

    setHours((prev) => ({ ...prev, ...mapped }));
    setApplySettings(Boolean(Object.keys(schedule).length));
  }, [getWorkingHours]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold text-gray-900">Office hours</h1>

      <p className="mt-1 text-sm text-gray-500">
        Set the days and times you're available to work.
      </p>

      <div className="flex items-center justify-between bg-blue-50 rounded-xl border border-blue-200 p-4 mt-6">
        <div className="flex items-center gap-3">
          <ClockArrowDown className="h-5 w-5 text-gray-700" />

          <button
            onClick={repeatMondayToWeekdays}
            className="text-sm font-medium text-gray-900 hover:underline hover:cursor-pointer"
          >
            <strong>Repeat</strong> Monday
          </button>
        </div>
        <div className="flex items-center">
          <p className="mr-1">Apply</p>
          <button
            onClick={handleApplyToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 ${
              applySettings ? 'bg-blue-200' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                applySettings ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
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

      {showAdminPrompt && (
        <RequireAdminPassword
          open={showAdminPrompt}
          payload={buildPayload()}
          onClose={() => setShowAdminPrompt(false)}
          onSubmit={handleAdminSubmit}
        />
      )}

      <div className="mt-6 text-sm text-gray-600">
        Total weekly hours:{' '}
        <span className="font-medium text-gray-900">
          {calculateWeeklyTotal()} hrs
        </span>
      </div>
    </div>
  );
}
