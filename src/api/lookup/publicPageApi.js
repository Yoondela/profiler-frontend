import axios from 'axios';

export const fetchPublicPage = async (api, providerId) => {
  console.log('Fetching public page for provider ID:', providerId);
  console.log('API client:', api);

  const res = await api.get(
    `${import.meta.env.VITE_API_URL}/providers/${providerId}/public`
  );
  console.log('found', res.data);

  return res.data;
};
