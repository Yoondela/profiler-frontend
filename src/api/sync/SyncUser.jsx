'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserContext } from '../context/userContext';

// Create a pre-configured axios instance for DRY headers
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------- COMPONENT ----------
export const CreateUser = () => {
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [synced, setSynced] = useState(false);
  const { appUser_ID, setAppUser_ID } = useUserContext(); // ✅ fixed parentheses

  useEffect(() => {
    const syncUser = async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        });

        const res = await api.post(
          '/users',
          {
            name: user.name,
            email: user.email,
            sub: user.sub,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data;
        console.log('User synced:', data.body);
        // Optionally save backend _id in context
        // setAppUser_ID(data.body._id);
        setSynced(true);
      } catch (err) {
        console.error(
          'Error syncing user to backend:',
          err.response?.data || err
        );
      }
    };

    if (user && isAuthenticated && !synced) {
      syncUser();
    }
  }, [user, isAuthenticated, synced, getAccessTokenSilently]);

  return null;
};

// ---------- HOOK UTILS ----------

// Fetch user by ID
export const useUserById = (userId) => {
  const { getAccessTokenSilently } = useAuth0();

  const getUserById = async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      });

      const res = await api.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (err) {
      console.error('Error fetching user by ID:', err.response?.data || err);
      throw err;
    }
  };

  return { getUserById };
};

// Fetch user by email
export const useUserByEmail = (email) => {
  const { getAccessTokenSilently } = useAuth0();

  const getUserByEmail = async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      });

      const res = await api.get(`/users/email/${encodeURIComponent(email)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (err) {
      console.error('Error fetching user by email:', err.response?.data || err);
      throw err;
    }
  };

  return { getUserByEmail };
};

// ---------- NEW FUNCTION: getUserID ----------
export const getUserID = async (getAccessTokenSilently, email) => {
  try {
    const token = await getAccessTokenSilently({
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    });

    const res = await api.get(`/users/email/${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.data || !res.data._id) {
      throw new Error('User ID not found in backend response');
    }

    console.log('Fetched backend user ID:', res.data._id);
    return res.data._id;
  } catch (err) {
    console.error('Error fetching backend user ID:', err.response?.data || err);
    throw err;
  }
};
