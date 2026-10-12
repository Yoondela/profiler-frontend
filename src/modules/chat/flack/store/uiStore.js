import { create } from 'zustand';

export const useUIStore = create((set) => ({
  activeTab: 'home',
  selectedChatId: null,
  mobilePane: 'browse',
  flackUserId: null,
  drafts: {},
  setTab: (tab) => set({ activeTab: tab, mobilePane: 'browse' }),
  setSelectedChat: (selectedChatId) => set({ selectedChatId }),
  openConversation: (selectedChatId) =>
    set({ selectedChatId, mobilePane: 'conversation' }),
  showConversationList: () => set({ mobilePane: 'browse' }),
  setDraft: (channelId, draft) =>
    set((state) => ({
      drafts: {
        ...state.drafts,
        [channelId]: draft,
      },
    })),
  clearDraft: (channelId) =>
    set((state) => {
      const { [channelId]: _, ...drafts } = state.drafts;
      return { drafts };
    }),
  resetForUser: (flackUserId) =>
    set((state) => {
      if (state.flackUserId === flackUserId) return state;

      return {
        activeTab: 'home',
        selectedChatId: null,
        mobilePane: 'browse',
        flackUserId,
        drafts: {},
      };
    }),
}));
