// src/api/bookings.js
export async function createBooking(api, bookingData) {
  const res = await api.post('/bookings', bookingData);
  return res.data;
}

export async function getBookings(api, { status } = {}) {
  const params = {};
  if (status) params.status = status;
  const res = await api.get('/service-requests', { params });
  return res.data;
}
