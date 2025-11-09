'use client';

import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '@/api/useApiClient';
import { getUserID } from '@/api/sync/SyncUser';

import ProviderBookingCard from './ProviderBookingCard';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function ProviderBookingsCompleted() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const api = useApiClient();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const providerId = await getUserID(getAccessTokenSilently, user.email);
      const token = await getAccessTokenSilently();

      const res = await api.get(`/bookings/provider/${providerId}?status=completed`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRequests(res.data);
    } catch (err) {
      console.error('Failed to load completed bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) fetchRequests();
  }, [isAuthenticated, user]);

  if (loading) return <p className="p-4">Loading completed bookings...</p>;
  if (!requests.length) return <p className="p-4">No completed bookings yet.</p>;

  return (
    <div className="space-y-4 mt-4">
      {requests.map((req) => (
        <ProviderBookingCard
          key={req._id}
          booking={req}
        />
      ))}
    </div>
  );
}
