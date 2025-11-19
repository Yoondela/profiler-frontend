import axios from 'axios';
// GALLERY — append
export const sendGalleryUrlsToApp = async (userId, urls) => {
  console.log('sending');
  console.log(userId);
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

// GALLERY — delete
export const deleteGalleryPhoto = async (userId, index) => {
  if (!userId) throw new Error('No user ID provided');

  const res = await axios.delete(`/portfolios/${userId}/gallery/${index}`);
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
