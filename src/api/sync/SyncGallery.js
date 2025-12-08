import axios from 'axios';
// GALLERY — append
export const sendGalleryUrlsToApp = async (userId, urls) => {
  console.log('sending');
  console.log(userId);
  console.log('urls:');
  console.log(urls);
  if (!userId) throw new Error('No user ID provided');

  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/portfolios/${userId}/gallery`,
    {
      urls, // pass array
    }
  );

  return res.data; // updated list
};

export const fetchGalleryImages = async (userId, urls) => {
  if (!userId) throw new Error('No user ID provided');

  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/portfolios/${userId}/gallery`
  );

  console.log('fetched gallery photos:', res.data);
  return res.data;
};

// GALLERY — delete
export const deleteGalleryImage = async (userId, img_id) => {
  if (!userId) throw new Error('No user ID provided');

  const res = await axios.delete(`/portfolios/${userId}/gallery/${img_id}`);
  return res.data;
};

// GALLERY — reorder
export const reorderGalleryPhotos = async (userId, fromIndex, toIndex) => {
  if (!userId) throw new Error('No user ID provided');

  const res = await axios.patch(`/portfolios/${userId}/gallery/reorder`, {
    from: fromIndex,
    to: toIndex,
  });

  return res.data;
};
