import React from 'react';
// import BookingList from '@/components/bookings/bookingList';
import { useBookings } from '@/api/context/bookingsContext';

export default function BookingsPage() {
  const { clearNewFlag } = useBookings();

  // clear new flag when page mounts
  React.useEffect(() => {
    clearNewFlag();
  }, [clearNewFlag]);

  return (
    <div className="p-6">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Bookings</h2>
        {/* <BookingList /> */}
      </div>
    </div>
  );
}
