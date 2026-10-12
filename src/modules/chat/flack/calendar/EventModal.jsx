import { useEffect, useState } from 'react';
import { useCalendar } from './CalendarContext';

function formatDateTimeLocal(date) {
  if (!date) return '';

  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function EventModal() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('meeting');

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const {
    isModalOpen,
    editingEvent,
    selectedDates,
    closeModal,
    handleSave,
    handleDelete,
    isMutating,
    mutationAction,
    mutationError,
  } = useCalendar();

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title || '');
      setLocation(editingEvent.location || '');
      setDescription(editingEvent.description || '');
      setType(editingEvent.type || 'meeting');

      setStart(formatDateTimeLocal(editingEvent.start));

      setEnd(formatDateTimeLocal(editingEvent.end));

      return;
    }

    if (selectedDates) {
      setTitle('');
      setLocation('');
      setDescription('');
      setType('meeting');

      setStart(formatDateTimeLocal(selectedDates.start));

      setEnd(formatDateTimeLocal(selectedDates.end));
    }
  }, [editingEvent, selectedDates]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

  if (!isModalOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    handleSave({
      title,
      location,
      description,
      type,
      start,
      end,
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 p-0 backdrop-blur-sm sm:p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="flex h-[100dvh] w-full max-w-xl flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[90dvh] sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="shrink-0 border-b p-4 sm:p-6">
          <h2 className="text-xl font-semibold">
            {editingEvent ? 'Edit Event' : 'Create Event'}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-6"
        >
          {mutationError && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {mutationError}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium">Title</label>

            <input
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Start</label>

              <input
                type="datetime-local"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">End</label>

              <input
                type="datetime-local"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Type</label>

            <select
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="meeting">Meeting</option>

              <option value="reminder">Reminder</option>

              <option value="task">Task</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Location</label>

            <input
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              rows={4}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="sticky bottom-0 -mx-4 flex flex-wrap justify-end gap-3 border-t bg-white px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:static sm:mx-0 sm:border-t-0 sm:px-0 sm:pb-0">
            {editingEvent && (
              <button
                type="button"
                onClick={() => handleDelete(editingEvent.id)}
                disabled={isMutating}
                className="rounded-lg border border-red-500 px-4 py-2 text-red-500 transition hover:bg-red-50"
              >
                {mutationAction === 'delete' ? 'Deleting…' : 'Delete'}
              </button>
            )}

            <button
              type="button"
              onClick={closeModal}
              disabled={isMutating}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isMutating}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              {mutationAction === 'save' ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
