import { create } from 'zustand';

export const useUIStore = create((set) => ({
  activeTab: 'home',
  selectedChatId: null,
  setTab: (tab) => set({ activeTab: tab }),
  setSelectedChat: (selectedChatId) => set({ selectedChatId }),
}));
