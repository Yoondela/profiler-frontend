export const fetchPublicTargetPage = async (api, publicSlug) => {
  const res = await api.get(
    `${import.meta.env.VITE_API_URL}/public-targets/${encodeURIComponent(publicSlug)}`
  );

  return res.data;
};

export const fetchPublicTargetAvailability = async (api, publicSlug) => {
  const res = await api.get(
    `${import.meta.env.VITE_API_URL}/public-targets/${encodeURIComponent(publicSlug)}/availability`
  );

  return res.data;
};
