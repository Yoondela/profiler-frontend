// src/utils/portfolioSync.js
import axios from 'axios';

/** Fetch the user profile using email */
export const fetchPortfolio = async (providerId) => {
  if (!providerId) return null;
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/portfolios/${providerId}`
  );
  console.log('fetched portfolio:', res.data);
  return res.data;
};

/** Update user profile */
export const updatePortfolio = async (userId, changes) => {
  console.log('ID', userId);
  if (!userId) throw new Error('No user ID provided');
  const res = await axios.patch(
    `${import.meta.env.VITE_API_URL}/portfolios/${userId}`,
    changes
  );
  return res.data;
};
