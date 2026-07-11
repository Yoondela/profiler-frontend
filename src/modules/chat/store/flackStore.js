import { create } from 'zustand';
import { chatSocket } from '../socket/chatSocket';

export const useFlackStore = create((set, get) => ({
  userId: null,

  activeView: 'channels',

  hydrated: false,

  channels: [],
  chat: {
    activeChannelId: null,
    viewedChannelId: null,
  },
  calendar: {
    activeEventId: null,
    selectedDate: new Date(),
    filters: {
      bookings: true,
      meetings: true,
      reminders: true,
    },
  },

  notifications: [],

  messages: {},

  unreadCounts: {},

  newChannels: {},

  channelAlerts: {},

  // =========================
  // HYDRATION
  // =========================

  setChannels: (channels) => {
    set((state) => ({
      channels,
      unreadCounts: channels.reduce(
        (acc, channel) => ({
          ...acc,
          [channel.id]: state.unreadCounts[channel.id] || 0,
        }),
        {}
      ),
    }));
  },

  setMessages: (messages) => {
    set({ messages });
  },

  loadInitialData: async () => {
    try {
      if (get().hydrated) return;

      const userId = get().userId;

      if (!userId) return;

      console.log('Loading initial Flack data for:', userId);

      const res = await fetch(`http://localhost:3001/channels/${userId}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch channels: ${res.status}`);
      }

      const data = await res.json();

      console.log('Initial Flack data:', data);

      get().setChannels(data.channels || []);
      get().setMessages(data.messages || {});

      set({
        hydrated: true,
      });
    } catch (err) {
      console.error('Failed loading Flack data', err);
    }
  },

  // =========================
  // CONNECT
  // =========================

  connect: (userId) => {
    console.log('@ connect with userId:', userId);

    set({ userId });

    chatSocket.onMessage((event) => {
      switch (event.type) {
        case 'MESSAGE_SENT':
        case 'MESSAGE_RECEIVED':
          console.log(event.type, 'received:', event.payload);

          get().addMessage(event.payload);

          get().clearChannelAlert(event.payload.channelId);

          break;

        case 'CHANNEL_CREATED':
          console.log('CHANNEL_CREATED received:', event.payload);

          get().addChannel(event.payload);

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

          get().addChannel(event.payload);

          break;
      }
    });

    chatSocket.connect(userId);

    get().loadInitialData();
  },

  // =========================
  // ACTIVE CHANNEL
  // =========================

  setActiveChannel: (channelId) => {
    set((state) => {
      const { [channelId]: _, ...rest } = state.newChannels;

      return {
        chat: {
          ...state.chat,
          activeChannelId: channelId,
        },
        newChannels: rest,
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
        newChannels: rest,
      };
    });
  },

  clearChannelAlert: (channelId) => {
    set((state) => {
      const { [channelId]: _, ...restAlerts } = state.channelAlerts;

      return {
        channelAlerts: restAlerts,
      };
    });
  },

  setViewedChannel: (channelId) => {
    set((state) => ({
      chat: {
        ...state.chat,
        viewedChannelId: channelId,
      },
    }));
  },

  clearViewedChannel: () => {
    set((state) => ({
      chat: {
        ...state.chat,
        viewedChannelId: null,
      },
    }));
  },

  setCalendarActiveEvent: (activeEventId) => {
    set((state) => ({
      calendar: {
        ...state.calendar,
        activeEventId,
      },
    }));
  },

  setCalendarSelectedDate: (selectedDate) => {
    set((state) => ({
      calendar: {
        ...state.calendar,
        selectedDate,
      },
    }));
  },

  setCalendarFilters: (filters) => {
    set((state) => ({
      calendar: {
        ...state.calendar,
        filters: {
          ...state.calendar.filters,
          ...filters,
        },
      },
    }));
  },

  createChannel: ({ name, memberIds }) => {
    chatSocket.send({
      type: 'CREATE_CHANNEL',
      payload: {
        type: 'public',
        name,
        memberIds,
      },
    });
  },

  sendMessage: (channelId, content) => {
    console.log('Sending message to channel:', channelId, 'content:', content);

    chatSocket.send({
      type: 'SEND_MESSAGE',
      payload: {
        channelId,
        content,
      },
    });
  },

  updateChannelLastMessage: (channelId, lastMessage) => {
    set((state) => ({
      channels: state.channels.map((channel) =>
        channel.id === channelId
          ? {
              ...channel,
              lastMessage,
            }
          : channel
      ),
    }));
  },

  startDM: (targetUserId) => {
    console.log('Starting DM with:', targetUserId);

    chatSocket.send({
      type: 'START_DM',
      payload: {
        targetUserId,
      },
    });
  },

  addMessage: (msg) => {
    set((state) => {
      const isViewed = state.chat.viewedChannelId === msg.channelId;

      const isOwnMessage = msg.senderId === state.userId;

      const shouldIncrement = !isOwnMessage && !isViewed;

      return {
        messages: {
          ...state.messages,

          [msg.channelId]: [...(state.messages[msg.channelId] || []), msg],
        },

        channels: state.channels.map((channel) =>
          channel.id === msg.channelId
            ? {
                ...channel,
                lastMessage: {
                  content: msg.lastMessage.content,
                  senderId: msg.lastMessage.senderId,
                  senderName: msg.lastMessage.senderName,
                  createdAt: msg.lastMessage.createdAt,
                },
              }
            : channel
        ),

        unreadCounts: {
          ...state.unreadCounts,

          [msg.channelId]: shouldIncrement
            ? (state.unreadCounts[msg.channelId] || 0) + 1
            : state.unreadCounts[msg.channelId] || 0,
        },
      };
    });
  },

  addChannel: (channel) => {
    set((state) => {
      const exists = state.channels.some((c) => c.id === channel.id);

      if (exists) return state;

      return {
        channels: [...state.channels, channel],

        unreadCounts: {
          ...state.unreadCounts,
          [channel.id]: 0,
        },
      };
    });
  },

  getDMChannel: (userId) => {
    const { channels, userId: self } = get();

    if (!self) return undefined;

    return channels.find(
      (c) =>
        c.type === 'dm' &&
        c.members?.some((m) => m.userId === userId) &&
        c.members?.some((m) => m.userId === self)
    );
  },

  getTotalUnread: () => {
    const counts = get().unreadCounts;

    return Object.values(counts).reduce((a, b) => a + b, 0);
  },

  isNew: () => {
    const {
      chat: { activeChannelId },
      newChannels,
    } = get();

    return !!newChannels[activeChannelId];
  },
}));

export const useChatStore = useFlackStore;
