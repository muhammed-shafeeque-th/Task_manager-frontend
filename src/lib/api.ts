import axios from 'axios';
import { useAuthStore } from '@/features/auth/store';
import { API_URL } from './config';
import { getSocket } from './socket';

export const api = axios.create({ baseURL: API_URL, timeout: 15_000 });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Lets the server skip echoing real-time events back to the tab that made the change.
  const socketId = getSocket()?.id;
  if (socketId) config.headers['x-socket-id'] = socketId;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // An expired/invalid token on a protected call ends the session.
    if (axios.isAxiosError(error) && error.response?.status === 401 && useAuthStore.getState().token) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);
