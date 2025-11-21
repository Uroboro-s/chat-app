// API Configuration
export const API_BASE_URL = "http://localhost:3000";
export const SOCKET_URL = "http://localhost:3000";

// Message Limits
export const MAX_MESSAGE_LENGTH = 500;

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  CHAT: "/app/list/:userid",
  NOT_FOUND: "*",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER_ID: "userid",
  THEME: "theme",
};

// Socket Events
export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  SEND: "send",
  RECEIVE: "receive",
  JOIN_ROOM: "join-room",
  ERROR: "error",
};
