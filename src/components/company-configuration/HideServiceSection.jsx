import { useState } from 'react';
import { CalendarX, X } from 'lucide-react';

export default function HideServiceSection() {
  const [selectedDate, setSelectedDate] = useState('');
  const [blockedDates, setBlockedDates] = useState([]);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [hideNow, setHideNow] = useState(false); // <-- added

  function addBlockedDate() {
    if (!selectedDate) return;
    if (blockedDates.includes(selectedDate)) return;

    setBlockedDates((prev) => [...prev, selectedDate]);
    setSelectedDate('');
  }

  function removeDate(date) {
    setBlockedDates((prev) => prev.filter((d) => d !== date));
  }

  function handleSave() {
    if (blockedDates.length === 0 && !hideNow) return;
    setShowAdminPrompt(true);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold text-gray-900">
        Hide service visibility
      </h1>

      <p className="mt-1 text-sm text-gray-500">
        This hides the service from search, booking and request.
      </p>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <CalendarX className="h-5 w-5 text-gray-700" />
              <p className="text-sm font-medium text-gray-900">
                Block specific dates
              </p>
            </div>

            <p className="mt-4 text-sm text-gray-500 max-w-md">
              Selected dates will not be available for new bookings. Existing
              bookings remain unaffected.
            </p>
          </div>

          {/* Hide Now Toggle */}
          <button
            onClick={() => setHideNow((prev) => !prev)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 ${
              hideNow ? 'bg-red-200' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                hideNow ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Date Picker */}
        <div className="mt-6 flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />

          <button
            onClick={addBlockedDate}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 transition"
          >
            Add
          </button>
        </div>

        {/* Blocked Dates List */}
        {blockedDates.length > 0 && (
          <div className="mt-6 space-y-2">
            {blockedDates.map((date) => (
              <div
                key={date}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
              >
                <span className="text-gray-700">{date}</span>

                <X
                  className="h-4 w-4 cursor-pointer text-gray-500 hover:text-red-500"
                  onClick={() => removeDate(date)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Save */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={blockedDates.length === 0 && !hideNow}
            className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50 transition"
          >
            Save changes
          </button>
        </div>
      </div>

      {/* Admin Prompt Placeholder */}
      {showAdminPrompt && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-900 font-medium">
            Admin password required
          </p>
          <p className="mt-1 text-sm text-gray-500">
            This action requires administrative approval.
          </p>

          <input
            type="password"
            placeholder="Enter admin password"
            className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />

          <button className="mt-4 w-full rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 transition">
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}
