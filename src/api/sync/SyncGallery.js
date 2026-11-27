import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

// READ
export const fetchGalleryImages = async (userId) => {
  if (!userId) throw new Error('No user ID provided');

  const res = await axios.get(`${API}/gallery/${userId}`);
  return res.data;
};

// DELETE
export const deleteGalleryImage = async (photoId, token) => {
  const res = await axios.delete(`${API}/gallery/me/${photoId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// REORDER
export const reorderGalleryPhotos = async (fromIndex, toIndex, token) => {
  const res = await axios.patch(
    `${API}/gallery/me/reorder`,
    {
      from: fromIndex,
      to: toIndex,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};

// SET PRIMARY
export const setPrimaryGalleryImage = async (photoId, token) => {
  const res = await axios.patch(
    `${API}/gallery/me/${photoId}/primary`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};

// UPLOADS
