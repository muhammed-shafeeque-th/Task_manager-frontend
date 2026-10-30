import { io, type Socket } from 'socket.io-client';
import { SOCKET_URL } from './config';

let socket: Socket | null = null;

export const getSocket = () => socket;

export function connectSocket(token: string): Socket {
  socket?.disconnect();
  socket = io(SOCKET_URL, { auth: { token }, transports: ['websocket', 'polling'] });
  return socket;
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}
