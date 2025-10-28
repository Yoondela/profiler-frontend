// src/api/useApiClient.js
import { useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import apiClient, { setAuthToken } from './apiClient';

/**
 * useApiClient
 * - returns an axios instance that will include the Auth0 token on every request.
 * - uses useMemo so interceptors are added only once per hook lifecycle.
 *
 * Usage:
 *   const api = useApiClient();
 *   await api.get("/profiles");
 */

export function useApiClient() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // Memoize to avoid re-adding interceptors on every render
  return useMemo(() => {
    // Add a request interceptor that injects the latest token
    const requestInterceptor = apiClient.interceptors.request.use(
      async (config) => {
        try {
          if (isAuthenticated) {
            const token = await getAccessTokenSilently();
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
              // Keep global defaults in sync for non-hook callers (optional)
              setAuthToken(token);
            }
          }
        } catch (err) {
          // If token retrieval fails, we still proceed without throwing here.
          // Upstream call will get a 401 and you can handle it in components/hooks.
          // console.warn("Auth0 token retrieval failed", err);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add a response interceptor that bubbles the axios-normalized error
    const responseInterceptor = apiClient.interceptors.response.use(
      (res) => res,
      (err) => {
        // err is the normalized object returned from apiClient's response interceptor
        // Re-throw so callers handle errors consistently.
        return Promise.reject(err);
      }
    );

    // Cleanup function for interceptors removal — returned as part of memoized object
    // Note: React's useMemo cannot run cleanup, so we return a wrapped client containing a detach method.
    const wrappedClient = {
      ...apiClient,
      // allow manual cleanup if desired
      detachInterceptors: () => {
        apiClient.interceptors.request.eject(requestInterceptor);
        apiClient.interceptors.response.eject(responseInterceptor);
      },
    };

    return wrappedClient;
  }, [getAccessTokenSilently, isAuthenticated]);
}
