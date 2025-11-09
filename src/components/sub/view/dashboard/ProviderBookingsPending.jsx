'use client';

import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '@/api/useApiClient';
import { getUserID } from '@/api/sync/SyncUser';

import ProviderBookingCard from './ProviderBookingCard';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ProviderBookingsPending() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const api = useApiClient();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const providerId = await getUserID(getAccessTokenSilently, user.email);
      const token = await getAccessTokenSilently();

      const res = await api.get(`/bookings/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRequests(res.data);
    } catch (err) {
      console.error('Failed to load pending requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const token = await getAccessTokenSilently();
      const providerId = await getUserID(getAccessTokenSilently, user.email);

      await api.patch(
        `/bookings/status/${bookingId}`,
        { status: newStatus, providerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequests((prev) => prev.filter((r) => r._id !== bookingId));
    } catch (err) {
      console.error(err);
      alert(`Could not ${newStatus} booking`);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) fetchRequests();
  }, [isAuthenticated, user]);

  if (loading) return <p className="p-4">Loading pending requests...</p>;
  if (!requests.length) return <p className="p-4">No pending requests at the moment.</p>;

  return (
    <div className="mt-4 grid gap-4 
                sm:grid-cols-1  /* 1 card per row on small screens */
                md:grid-cols-2  /* 2 cards per row on medium screens */
                lg:grid-cols-3  /* 3 cards per row on large screens */
                xl:grid-cols-3  /* 3 cards per row on extra-large screens */
                2xl:grid-cols-5 /* 5 cards per row on 2xl screens */">
      {requests.map((req) => (
        <ProviderBookingCard
          key={req._id}
          booking={req}
          actions={
            <>
              <Button variant="default" onClick={() => handleUpdateStatus(req._id, 'accepted')}>
                Accept
              </Button>
              <Button variant="destructive" onClick={() => handleUpdateStatus(req._id, 'rejected')}>
                Reject
              </Button>
            </>
          }
        >
        </ProviderBookingCard>
      ))}
    </div>
  );
}
