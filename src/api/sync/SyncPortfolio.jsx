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

export const fetchPortfolioEdits = async (providerId, token) => {
  if (!providerId) throw new Error('No provider ID provided');
  if (!token) throw new Error('Authentication is required');

  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/portfolios/${providerId}/edits`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const fetchProviderPage = async (providerId, token) => {
  if (!providerId) throw new Error('No provider ID provided');
  if (!token) throw new Error('Authentication is required');

  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/portfolios/${providerId}/provider-page`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const updateProviderBranding = async (providerId, changes, token) => {
  if (!providerId) throw new Error('No provider ID provided');
  if (!token) throw new Error('Authentication is required');

  const res = await axios.patch(
    `${import.meta.env.VITE_API_URL}/portfolios/${providerId}/branding`,
    changes,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

/** Update user profile */
export const updatePortfolio = async (
  userId,
  changes,
  getAccessTokenSilently
) => {
  console.log('ID', userId);
  if (!userId) throw new Error('No user ID provided');
  if (!getAccessTokenSilently) throw new Error('Authentication is required');

  const token = await getAccessTokenSilently();
  if (!token) throw new Error('Authentication is required');

  const res = await axios.patch(
    `${import.meta.env.VITE_API_URL}/portfolios/${userId}`,
    changes,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const fetchVisibility = async (token) => {
  if (!token) throw new Error('Authentication is required');

  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/portfolios/visibility`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const updateVisibility = async (visibilityAction, token) => {
  if (!token) throw new Error('Authentication is required');
  if (
    !visibilityAction ||
    Array.isArray(visibilityAction) ||
    typeof visibilityAction !== 'object' ||
    !visibilityAction.action
  ) {
    throw new Error('A visibility action is required');
  }

  const res = await axios.patch(
    `${import.meta.env.VITE_API_URL}/portfolios/visibility`,
    visibilityAction,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const updateOfficeHours = async (userId, payload) => {
  console.log('ID', userId);

  if (!userId) throw new Error('No user ID provided');
  const res = await axios.patch(
    `${import.meta.env.VITE_API_URL}/portfolios/office/${userId}/working-hours`,
    { payload }
  );
  return res.data;
};
