export async function createBookmark(api, providerId) {
  console.log('Creating a bookmark with data:', providerId);
  const res = await api.post('/bookmarks/providers/save', { providerId: providerId });
  console.log('Bookmark created:', res.data);
  return res.data;
}

export async function getBookmarks(api) {
  console.log('Getting bookmarks', api);
  const res = await api.get('/bookmarks/providers/saved');
  console.log('Bookmarks fetched:', res.data);
  return res.data;
}

export async function removeBookmark(api, providerId) {
  console.log('Removing a bookmark with data:', providerId);

  const res = await api.delete(`/bookmarks/providers/save/${providerId}`);

  return res.data;
  
}
