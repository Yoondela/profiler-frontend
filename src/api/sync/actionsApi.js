import axios from 'axios';
import apiClient from '../apiClient';

export const respondToBooking = async (
  bookingId,
  action,
  providerId = null
) => {
  const { data } = await apiClient.patch(`/actions/respond/${bookingId}`, {
    action,
    providerId,
  });

  return data;
};
