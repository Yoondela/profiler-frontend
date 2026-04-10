'use client';

import apiClient from '../apiClient';

export const getFlackUserId = async (userId) => {
  try {
    const res = await apiClient.get(
      `/users/email/${encodeURIComponent(userId)}`
    );

    if (!res.data || !res.data.flackUserId) {
      throw new Error('User ID not found in backend response');
    }

    console.log('Fetched flack user ID:', res.data.flackUserId);
    return res.data.flackUserId;
  } catch (err) {
    console.error('Error fetching flack user ID:', err.response?.data || err);
    throw err;
  }
};
