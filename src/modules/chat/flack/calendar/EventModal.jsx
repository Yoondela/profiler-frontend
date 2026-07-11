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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">
            {editingEvent ? 'Edit Event' : 'Create Event'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium">Title</label>

            <input
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

          <div className="flex justify-end gap-3 pt-4">
            {editingEvent && (
              <button
                type="button"
                onClick={() => handleDelete(editingEvent.id)}
                className="rounded-lg border border-red-500 px-4 py-2 text-red-500 transition hover:bg-red-50"
              >
                Delete
              </button>
            )}

            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
