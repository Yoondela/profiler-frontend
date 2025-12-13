import axios from 'axios';

export const fetchPublicPage = async (providerId) => {
  console.log('Fetching public page for provider ID:', providerId);

  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/providers/${providerId}/public`
  );
  console.log('found', res.data);

  return res.data;
};
