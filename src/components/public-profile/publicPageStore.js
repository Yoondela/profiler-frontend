import { create } from 'zustand';

export const usePublicPageStore = create((set) => ({
  selectedMember: null,

  selectMember: (member) => set({ selectedMember: member }),

  clearSelectedMember: () => set({ selectedMember: null }),

  toggleMember: (member) =>
    set((state) => ({
      selectedMember:
        state.selectedMember?.user?._id === member.user._id ? null : member,
    })),
}));
