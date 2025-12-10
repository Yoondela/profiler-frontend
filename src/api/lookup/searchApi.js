import axios from 'axios';

export const searchProviders = async (query) => {
  if (!query.trim()) return [];

  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/providers/search`,
    {
      params: { q: query },
    }
  );
  console.log('found', res.data);

  return res.data;
};
