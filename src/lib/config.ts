export const API_URL = import.meta.env.VITE_API_URL || '/api';
// Empty string => connect to the page origin (Vite proxies /socket.io in development).
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || undefined;
