export async function createReview(api, reviewData) {
  console.log('Creating review with data:', reviewData);
  const res = await api.post('/reviews/provider', reviewData);
  console.log('Review created:', res.data);
  return res.data;
}

export async function getReviews(api, providerId) {
  console.log('Fetching reviews for providerId:', providerId);
  const res = await api.get(`/reviews/provider/p/${providerId}`);
  console.log('Reviews fetched:', res.data);
  return res.data;
}
