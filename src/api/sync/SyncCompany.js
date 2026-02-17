export const getCompanyID = async (getAccessTokenSilently, email) => {
  try {
    const token = await getAccessTokenSilently({
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    });

    const res = await api.get(`/users/email/${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.data || !res.data._id) {
      throw new Error('User ID not found in backend response');
    }

    console.log('Fetched backend user ID:', res.data._id);
    return res.data._id;
  } catch (err) {
    console.error('Error fetching backend user ID:', err.response?.data || err);
    throw err;
  }
};