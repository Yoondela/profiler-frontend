import { create } from 'zustand';

export const useUIStore = create((set) => ({
  activeTab: 'home',
  setTab: (tab) => set({ activeTab: tab }),
}));
