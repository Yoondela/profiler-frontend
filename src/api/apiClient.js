import axios from 'axios';

console.log('API Base URL:', import.meta.env.VITE_API_URL);

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15s default timeout
});

export function setAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
}

/**
 * Request interceptor - here for logging, additional headers, etc.
 * Keep lightweight and fast.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Example: attach a client-side request id, dev-only logging, etc.
    // config.headers["X-Request-Id"] = generateRequestId();
    // console.debug(`[api] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor - normalize errors and optionally handle auth globally.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize error shape: error.response?.data || error.message
    const normalized = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };

    // Example global handling: if 401 or 403 you could dispatch logout
    // But don't auto-logout here — let useApiClient handle token refresh / logout.
    return Promise.reject(normalized);
  }
);

export default apiClient;
