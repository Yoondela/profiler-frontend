import axios from 'axios';

export const searchProviders = async (query, page = 1, limit = 18) => {
  if (!query.trim()) return [];

  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/providers/search`,
    {
      params: {
        q: query,
        page,
        limit,
      },
    }
  );
  console.log('found', res.data);

  return res.data;
};
