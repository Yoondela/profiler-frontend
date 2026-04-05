import { create } from 'zustand';
import { chatSocket } from '../socket/chatSocket';

export const useChatStore = create((set, get) => ({
  userId: null,
  channels: [],
  activeChannelId: null,
  messages: {},

  connect: (userId) => {
    console.log("@ connect with userId:", userId);
    set({ userId });

    chatSocket.onMessage((event) => {
      if (event.type === 'MESSAGE_CREATED') {
        console.log('MESSAGE_CREATED received:', event.payload);

        get().addMessage(event.payload);
      }
      if (event.type === 'CHANNEL_CREATED') {
        console.log('CHANNEL_CREATED received:', event.payload);
        get().addChannel({
          id: event.payload.id,
          type: event.payload.type,
          members: event.payload.members,
        });
        get().setActiveChannel(event.payload.id);
      }
    });

    chatSocket.connect(userId);
  },

  setActiveChannel: (channelId) => {
    set({ activeChannelId: channelId });
  },

  sendMessage: (channelId, content) => {
    chatSocket.send({
      type: 'SEND_MESSAGE',
      payload: { channelId, content },
    });
  },

  startDM: (targetUserId) => {
    console.log('Starting DM with:', targetUserId);
    chatSocket.send({
      type: 'START_DM',
      payload: { targetUserId },
    });
  },

  addMessage: (msg) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [msg.channelId]: [...(state.messages[msg.channelId] || []), msg],
      },
    }));
  },

  addChannel: (channel) => {
    set((state) => {
      const exists = state.channels.some((c) => c.id === channel.id);
      if (exists) return state;
      return { channels: [...state.channels, channel] };
    });
  },

  getDMChannel: (userId) => {
    console.log('getDMChannel called with userId:', userId);
    const { channels, userId: self } = get();
    console.log('Current channels:', channels, 'Self userId:', self);
    if (!self) return undefined;

    return channels.find(
      (c) =>
        c.type === 'dm' &&
        c.members.includes(userId) &&
        c.members.includes(self)
    );
  },
}));
