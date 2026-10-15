import { create } from 'zustand';

export const useCompanyConfigurationStore = create((set) => ({
  activeEditor: 'configuration',
  setActiveEditor: (activeEditor) => set({ activeEditor }),
}));
