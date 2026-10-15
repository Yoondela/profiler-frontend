import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

// CREATE
export const sendGalleryUrlsToApp = async (userId, urls) => {
  if (!userId) throw new Error('No user ID provided');

  const res = await axios.post(`${API}/portfolios/${userId}/gallery`, { urls });
  return res.data;
};

// READ
export const fetchGalleryImages = async (userId) => {
  if (!userId) throw new Error('No user ID provided');

  const res = await axios.get(`${API}/portfolios/${userId}/gallery`);
  return res.data;
};

// DELETE
export const deleteGalleryImage = async (userId, photoId, token) => {
  if (!userId) throw new Error('No user ID provided');

  const res = await axios.delete(
    `${API}/portfolios/${userId}/gallery/${photoId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// REORDER
export const reorderGalleryPhotos = async (
  userId,
  fromIndex,
  toIndex,
  token
) => {
  if (!userId) throw new Error('No user ID provided');

  const res = await axios.patch(
    `${API}/portfolios/${userId}/gallery/reorder`,
    {
      from: fromIndex,
      to: toIndex,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};

// SET PRIMARY
export const setPrimaryGalleryImage = async (userId, photoId, token) => {
  if (!userId) throw new Error('No user ID provided');

  const res = await axios.patch(
    `${API}/gallery/${userId}/${photoId}/primary`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};

// UPLOADS
