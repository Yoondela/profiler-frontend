// src/utils/portfolioSync.js
import axios from 'axios';

/** Fetch the user profile using email */
export const fetchPortfolio = async (userEmail) => {
  if (!userEmail) return null;
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/profiles/me/mail/${userEmail}`
  );
  return res.data.userAccount;
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
