import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export async function createReview(api, reviewData) {
  console.log('Creating review with data:', reviewData);
  const res = await api.post('/reviews/provider', reviewData);
  console.log('Review created:', res.data);
  return res.data;
}

export async function fetchCompanyReviews(token) {
  if (!token) throw new Error('Authentication is required');

  const res = await axios.get(`${API}/reviews/company`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateCompanyReviewFeature(reviewId, isFeatured, token) {
  if (!reviewId) throw new Error('No review ID provided');
  if (!token) throw new Error('Authentication is required');

  const res = await axios.patch(
    `${API}/reviews/company/${reviewId}/feature`,
    { isFeatured },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

export async function getReviews(api, providerId) {
  console.log('Fetching reviews for providerId:', providerId);
  const res = await api.get(`/reviews/provider/p/${providerId}`);
  console.log('Reviews fetched:', res.data);
  return res.data;
}
