import React from 'react';
import { useBookings } from '@/api/context/bookingsContext';
import { ProviderPicker } from '@/components/bookings/bookingList';
import { formatTimeAgo } from '@/utils/formatTimeAgo';

export default function ActionsPage() {
  const { bookings, invites, loading, hasNew, clearNewFlag } = useBookings();
  const [selected, setSelected] = React.useState('bookings');

  React.useEffect(() => {
    clearNewFlag();
  }, [clearNewFlag]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-12 flex">
      <div className="w-64 bg-white p-3">
        <button
          onClick={() => setSelected('bookings')}
          className={`w-full text-left px-3 py-2 rounded ${selected === 'bookings' ? 'bg-gray-100' : ''}`}
        >
          Bookings {hasNew && <span className="inline-block ml-2 h-2 w-2 rounded-full bg-red-600" />}
        </button>

        <button
          onClick={() => setSelected('invites')}
          className={`w-full text-left px-3 py-2 rounded mt-2 ${selected === 'invites' ? 'bg-gray-100' : ''}`}
        >
          Invites
        </button>
      </div>

      <div className="flex-1 p-3">
        {selected === 'bookings' && (
          <div>
            {bookings.length === 0 && <div className="text-sm text-gray-500">No bookings</div>}
            {bookings.map((b) => (
              <div key={b._id} className="mb-3 p-3 rounded">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{b.status || 'Booking'}</div>
                  <div className="text-xs text-gray-500">{formatTimeAgo(b.createdAt)}</div>
                </div>
                  <ProviderPicker booking={b} />
              </div>
            ))}
          </div>
        )}

        {selected === 'invites' && (
          <div>
            {invites.length === 0 && <div className="text-sm text-gray-500">No invites</div>}
            {invites.map((i) => (
              <div key={i._id} className="mb-3 p-3 rounded">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Invite</div>
                  <div className="text-xs text-gray-500">{formatTimeAgo(i.createdAt)}</div>
                </div>
                <div className="text-sm text-gray-700">Status: {i.status}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
