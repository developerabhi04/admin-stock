// src/services/socket.js
import { io } from 'socket.io-client';
import { getAdminToken } from './api';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';
// Convert "/api/v1" or "https://domain.com/api/v1" → "https://domain.com"
const SOCKET_BASE_URL = API_URL.replace(/\/api\/v1$/, '');

let socket = null;

export const connectAdminSocket = () => {
    if (socket) return socket;

    const token = getAdminToken();
    console.log('🔗 connectAdminSocket token present:', !!token);
    console.log('🔗 API_URL:', API_URL);
    console.log('🔗 SOCKET_BASE_URL:', SOCKET_BASE_URL);

    if (!token) return null;

    socket = io(SOCKET_BASE_URL || window.location.origin, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
        console.log('🔌 Admin socket connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
        console.log('❌ Admin socket disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
        console.error('🔴 Socket connect error:', err.message);
    });

    return socket;
};

export const getAdminSocket = () => socket;

export const joinSupportConversation = (conversationId) => {
  const currentSocket = connectAdminSocket();
  currentSocket?.emit('join_conversation', conversationId);
};

export const leaveSupportConversation = (conversationId) => {
  socket?.emit('leave_conversation', conversationId);
};

export const disconnectAdminSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};