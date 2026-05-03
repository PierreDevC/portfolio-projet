export const EVENTS = {
    // Client → Server
    USER_JOIN:    'user:join',
    MESSAGE_SEND: 'message:send',
    USER_TYPING:  'user:typing',
  
    // Server → Client
    USER_JOINED:    'user:joined',
    USER_LEFT:      'user:left',
    MESSAGE_RECEIVE:'message:receive',
    USERS_COUNT:    'users:count',
    TYPING_UPDATE:  'typing:update',
  }