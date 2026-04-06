import { create } from 'zustand';
import { chatSocket } from '../socket/chatSocket';

export const useChatStore = create((set, get) => ({
  userId: null,
  channels: [],
  activeChannelId: null,
  viewedChannelId: null,

  // { [channelId]: Message[] }
  messages: {},

  // { [channelId]: number }
  unreadCounts: {},

  // 🔌 CONNECT
  connect: (userId) => {
    console.log('@ connect with userId:', userId);
    set({ userId });

    chatSocket.onMessage((event) => {
      switch (event.type) {
        case 'MESSAGE_SENT':
        case 'MESSAGE_RECEIVED':
          console.log(event.type, 'received:', event.payload);
          get().addMessage(event.payload);
          break;

        case 'CHANNEL_CREATED':
          console.log('CHANNEL_CREATED received:', event.payload);
          get().addChannel({
            id: event.payload.id,
            type: event.payload.type,
            members: event.payload.members,
          });

          get().setActiveChannel(event.payload.id);
          break;
      }
    });

    chatSocket.connect(userId);
  },

  // 📍 ACTIVE CHANNEL
  setActiveChannel: (channelId) => {
    set((state) => ({
      activeChannelId: channelId,
      unreadCounts: {
        ...state.unreadCounts,
        [channelId]: 0, // clear unread
      },
    }));
  },

  setViewedChannel: (channelId) => {
    set({ viewedChannelId: channelId });
  },

  clearViewedChannel: () => {
    set({ viewedChannelId: null });
  },

  // ✉️ SEND MESSAGE
  sendMessage: (channelId, content) => {
    chatSocket.send({
      type: 'SEND_MESSAGE',
      payload: { channelId, content },
    });
  },

  // 💬 START DM
  startDM: (targetUserId) => {
    console.log('Starting DM with:', targetUserId);
    chatSocket.send({
      type: 'START_DM',
      payload: { targetUserId },
    });
  },

  // ➕ ADD MESSAGE
  addMessage: (msg) => {
    set((state) => {
      const isViewed = state.viewedChannelId === msg.channelId;
      const isOwnMessage = msg.senderId === state.userId;

      const shouldIncrement = !isOwnMessage && !isViewed;

      return {
        messages: {
          ...state.messages,
          [msg.channelId]: [...(state.messages[msg.channelId] || []), msg],
        },

        unreadCounts: {
          ...state.unreadCounts,
          [msg.channelId]: shouldIncrement
            ? (state.unreadCounts[msg.channelId] || 0) + 1
            : state.unreadCounts[msg.channelId] || 0,
        },
      };
    });
  },

  // ➕ ADD CHANNEL
  addChannel: (channel) => {
    set((state) => {
      const exists = state.channels.some((c) => c.id === channel.id);
      if (exists) return state;

      return {
        channels: [...state.channels, channel],
        unreadCounts: {
          ...state.unreadCounts,
          [channel.id]: 0, // initialize
        },
      };
    });
  },

  // 🔍 FIND DM CHANNEL
  getDMChannel: (userId) => {
    const { channels, userId: self } = get();
    if (!self) return undefined;

    return channels.find(
      (c) =>
        c.type === 'dm' &&
        c.members.includes(userId) &&
        c.members.includes(self)
    );
  },

  // 🔢 TOTAL UNREAD
  getTotalUnread: () => {
    const counts = get().unreadCounts;
    return Object.values(counts).reduce((a, b) => a + b, 0);
  },
}));
