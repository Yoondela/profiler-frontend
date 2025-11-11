'use client';

import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '@/api/useApiClient';
import { getUserID } from '@/api/sync/SyncUser';
import ProviderBookingCard from './ProviderBookingCard';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProviderBookingsAll() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const api = useApiClient();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const providerId = await getUserID(getAccessTokenSilently, user.email);
      const token = await getAccessTokenSilently();

      const res = await api.get(
        `/bookings/provider/${providerId}?status=accepted`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRequests(res.data);
    } catch (err) {
      console.error('Failed to load accepted bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = async (bookingId) => {
    try {
      const token = await getAccessTokenSilently();
      const providerId = await getUserID(getAccessTokenSilently, user.email);

      await api.patch(
        `/bookings/status/${bookingId}`,
        { status: 'completed', providerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequests((prev) => prev.filter((r) => r._id !== bookingId));
    } catch (err) {
      console.error(err);
      alert(`Could not complete booking`);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) fetchRequests();
  }, [isAuthenticated, user]);

  if (loading) return <p className="p-4">Loading bookings...</p>;
  if (!requests.length)
    return <p className="p-4">No active bookings right now.</p>;

  return (
    <div
      className="mt-4 grid gap-4 
                sm:grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-3
                2xl:grid-cols-5"
    >
      {requests.map((req) => (
        <ProviderBookingCard
          key={req._id}
          booking={req}
          actions={
            <>
              <Button variant="default" onClick={() => markCompleted(req._id)}>
                Mark Completed
              </Button>
            </>
          }
        ></ProviderBookingCard>
      ))}
    </div>
  );
}
