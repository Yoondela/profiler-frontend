let socket = null;
let listeners = [];
let handler = null;

export const chatSocket = {
  connect(userId) {
    if (socket) return;

    socket = new WebSocket(`ws://localhost:3001/ws?userId=${userId}`);

    socket.onopen = () => {
      console.log('Chat socket connected');
    };

    socket.onmessage = (event) => {
      console.log('Received event:', event.data);
      const data = JSON.parse(event.data);

      if (handler) handler(data);
      listeners.forEach((cb) => cb(data));
    };

    socket.onclose = () => {
      console.log('Chat socket disconnected');
      socket = null;
    };
  },
  
  onMessage(nextHandler) {
    console.log('Registering message handler');
    handler = nextHandler;
  },

  send(event) {
    console.log('Sending event:', event);

    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify(event));
  },

  subscribe(cb) {
    listeners.push(cb);
  },
};
