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

export const fetchPortfolioEdits = async (token) => {
  if (!token) throw new Error('Authentication is required');

  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/portfolios/me/edits`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const fetchProviderPage = async (token) => {
  if (!token) throw new Error('Authentication is required');

  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/portfolios/me/provider-page`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const updateProviderBranding = async (changes, token) => {
  if (!token) throw new Error('Authentication is required');

  const res = await axios.patch(
    `${import.meta.env.VITE_API_URL}/portfolios/me/branding`,
    changes,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

/** Update user profile */
export const updatePortfolio = async (changes, getAccessTokenSilently) => {
  if (!getAccessTokenSilently) throw new Error('Authentication is required');

  const token = await getAccessTokenSilently();
  if (!token) throw new Error('Authentication is required');

  const res = await axios.patch(
    `${import.meta.env.VITE_API_URL}/portfolios/me`,
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

export const updateOfficeHours = async (payload, token) => {
  if (!token) throw new Error('Authentication is required');
  const res = await axios.patch(
    `${import.meta.env.VITE_API_URL}/portfolios/me/office/working-hours`,
    { payload },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
