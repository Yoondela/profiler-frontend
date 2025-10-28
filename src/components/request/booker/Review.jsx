import React, { useState } from 'react';
import { useApiClient } from '@/api/useApiClient';
import { createBooking } from '@/api/sync/SyncBooking';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserID } from '@/api/sync/SyncUser';
import { useServiceBooking } from '../contexts/ServiceBookingContext';

const BookingReview = ({ onBack }) => {
  const api = useApiClient();
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  // --- Global context data ---
  const {
    userDate,
    userTime,
    userService,
    userLocation,
    subjectSize,
    serviceTasks,
    userNote,
    setUserNote,
  } = useServiceBooking();

  const [loading, setLoading] = useState(false);

  const getClient = async () => {
    let clientId = null;
    if (isAuthenticated && user) {
      clientId = await getUserID(getAccessTokenSilently, user.email);
    }
    console.log('Client ID:', clientId);
    return clientId;
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const bookingPayload = {
        client: await getClient(),
        serviceType: userService,
        description: JSON.stringify(serviceTasks || {}),
        forDate: userDate,
        forTime: userTime,
        forAddress: userLocation,
        note: userNote || '',
        selectedSize: subjectSize,
      };

      console.log('Booking Payload:', bookingPayload);

      const data = await createBooking(api, bookingPayload);
      console.log('✅ Booking created:', data);

      alert('Booking successfully created!');
    } catch (err) {
      console.error('❌ createBooking failed', err);
      const message =
        err?.data?.message || err?.message || 'Something went wrong';
      alert(`Booking failed: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-review-container request-reviewer">
      <div className="booker-header">
        <h2>Review Your Booking</h2>
        <hr />
      </div>

      <div className="review-fields">
        <table>
          <tbody>
            <tr>
              <td>
                <span>Service:</span>
              </td>
              <td>{userService}</td>
            </tr>
            <tr>
              <td>
                <span>Date:</span>
              </td>
              <td>
                {userDate ? new Date(userDate).toLocaleDateString() : '-'}
              </td>
            </tr>
            <tr>
              <td>
                <span>Time:</span>
              </td>
              <td>{userTime || '-'}</td>
            </tr>
            <tr>
              <td>
                <span>Location:</span>
              </td>
              <td>{userLocation || '-'}</td>
            </tr>
            <tr>
              <td>
                <span>Size:</span>
              </td>
              <td>{subjectSize || '-'}</td>
            </tr>
            <tr>
              <td>
                <span>Tasks:</span>
              </td>
              <td>{serviceTasks ? JSON.stringify(serviceTasks) : '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 📝 Note Input */}
      <div className="note-section">
        <label htmlFor="userNote">Add a note or special instruction:</label>
        <textarea
          id="userNote"
          rows="4"
          className="note-input"
          placeholder="e.g., Please come after 10 AM, gate code is 2345..."
          value={userNote}
          onChange={(e) => setUserNote(e.target.value)}
        ></textarea>
      </div>

      <div className="slider-btns">
        <div className="left-btn">
          <button
            className="request-button"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Confirm'}
          </button>
        </div>
        <div className="right-btn">
          <button className="back-btn small-btn" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingReview;
