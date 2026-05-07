export async function createLike(api, providerId) {
  console.log('Creating a like with data:', providerId);
  const res = await api.post('/likes/providers/like', {
    providerId: providerId,
  });
  console.log('Like created:', res.data);
  return res.data;
}

export async function getLikes(api) {
  console.log('Getting likes', api);
  const res = await api.get('/likes/providers/liked');
  console.log('Likes fetched:', res.data);
  return res.data;
}

export async function removeLike(api, providerId) {
  console.log('Removing a like with data:', providerId);

  const res = await api.delete(`/likes/providers/like/${providerId}`);

  return res.data;
}
