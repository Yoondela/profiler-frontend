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

  // todo: use a newChannels and channelAlerts on liteChat (to render a red badge) when a CHANNEL_AVAILABLE event is received for a channel that isn't active and also show it in the channel list. then show the allert inside the chat view when they click in. also remove the new channel alert when they click into the channel or when they receive a message in that channel (since that means they have seen it)
  newChannels: {}, // { [channelId]: true }

  channelAlerts: {}, // { [channelId]: string }

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
          clearChannelAlert(event.payload.channelId);
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

        case 'CHANNEL_AVAILABLE':
          console.log('CHANNEL_AVAILABLE received:', event.payload);
          set((state) => ({
            newChannels: {
              ...state.newChannels,
              [event.payload.id]: true,
            },
            channelAlerts: {
              ...state.channelAlerts,
              [event.payload.id]: 'Communication opened',
            },

          }));
          console.log('CHANNEL_AVAILABLE, setting alert for channel:', event.payload.id),

          get().addChannel({
            id: event.payload.id,
            type: event.payload.type,
            members: event.payload.members,
          });

          get().setChannelState(event.payload.id, 'active');
          break;
      }
    });

    chatSocket.connect(userId);
  },

  // 📍 ACTIVE CHANNEL
  setActiveChannel: (channelId) => {
    set((state) => {
      const { [channelId]: _, ...rest } = state.newChannels;
      // const { [channelId]: __, ...restAlerts } = state.channelAlerts;

      return {
        activeChannelId: channelId,
        // channelAlerts: restAlerts,
        newChannels: rest, // remove this channel
        unreadCounts: {
          ...state.unreadCounts,
          [channelId]: 0,
        },
      };
    });
  },


  clearNewChannel: (channelId) => {
    set((state) => {
      const { [channelId]: _, ...rest } = state.newChannels;
      
      return {
        newChannels: rest, // remove this channel
      };
    });
  },

  clearChannelAlert: (channelId) => {
    set((state) => {
      const { [channelId]: __, ...restAlerts } = state.channelAlerts;

      return {
        channelAlerts: restAlerts,
      };
    });
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

  isNew: () => {
    const { activeChannelId, newChannels } = get();
    return !!newChannels[activeChannelId];
  },
}));
