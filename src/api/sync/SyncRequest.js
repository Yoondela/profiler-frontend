// src/api/requests.js

// import { useApiClient } from "@/api/useApiClient";

// const api = useApiClient();

export async function createRequest(api, requestData) {
  const res = await api.post('/service-requests', requestData);
  return res.data;
}

export async function getRequests(api, { status } = {}) {
  const params = {};
  if (status) params.status = status;
  const res = await api.get('/service-requests', { params });
  return res.data;
}

export async function respondToRequest(api, requestId) {
  const res = await api.patch(`/service-requests/status/${requestId}`, {
    status: 'accepted',
  });
  return res.data;
}
