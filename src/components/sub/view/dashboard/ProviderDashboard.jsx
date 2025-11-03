'use client';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '@/api/useApiClient';
import { getUserID } from '@/api/sync/SyncUser';
import axios from 'axios';

export default function ProviderDashboard() {
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
        { status: newStatus, providerId: providerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests((prev) => prev.filter((r) => r._id !== bookingId));
    } catch (err) {
      console.error(`Failed to ${newStatus} booking:`, err);
      alert(`Could not ${newStatus} booking`);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) fetchRequests();
  }, [isAuthenticated, user]);

  if (loading) return <p>Loading pending requests...</p>;
  if (!requests.length) return <p>No pending requests at the moment.</p>;

  return (
    <div className="provider-dashboard">
      <h2 className="dashboard-title">Pending Service Requests</h2>
      <div className="requests-list">
        {requests.map((req) => (
          <div key={req._id} className="request-card">
            <div className="request-info">
              <h3>{req.serviceType}</h3>
              <p>
                <strong>Client:</strong> {req.client?.name || 'Unknown'}
              </p>
              <p>
                <strong>Description:</strong> {req.description}
              </p>
              <p>
                <strong>Date:</strong>{' '}
                {new Date(req.requestedAt).toLocaleString()}
              </p>
            </div>
            <div className="request-actions">
              <button
                className="accept-btn"
                onClick={() => handleUpdateStatus(req._id, 'accepted')}
              >
                Accept
              </button>
              <button
                className="reject-btn"
                onClick={() => handleUpdateStatus(req._id, 'rejected')}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
