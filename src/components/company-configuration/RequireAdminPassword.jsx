import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';

export default function RequireAdminPassword({ open, payload, onClose, onSubmit }) {
  const [password, setPassword] = useState('');
  const [changeWorkingHours, setChangeWorkingHours] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!open) {
      setPassword('');
      setChangeWorkingHours(false);
      setErrorMessage('');
    }
  }, [open]);

  const handleSubmit = () => {
    if (!password.trim()) {
      setErrorMessage('Please enter your admin password.');
      return;
    }

    setErrorMessage('');

    // Include admin metadata so parent can act accordingly
    const enriched = {
      ...payload,
      adminPassword: password,
      changeWorkingHoursForCompany: changeWorkingHours,
    };

    onSubmit(enriched);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <Shield className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Admin password required</h2>
            <p className="mt-1 text-sm text-gray-500">Enter your admin password, then confirm.</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            placeholder="Enter admin password"
          />

          <label className="inline-flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={changeWorkingHours}
              onChange={(e) => setChangeWorkingHours(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Change working hours for company</span>
          </label>

          {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
          >
            Submit
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
