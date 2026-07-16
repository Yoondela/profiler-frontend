// stores/publicPageStore.js

import { create } from 'zustand';

export const usePublicPageStore = create((set) => ({
  /**
   * The company currently being viewed.
   * Null when viewing an independent provider.
   */
  company: null,

  /**
   * The member whose profile is currently displayed.
   * Null means show the owner's profile.
   */
  selectedMember: null,

  /**
   * Whether the booking panel is open.
   */
  bookingOpen: false,

  /**
   * Set the company once the page has loaded.
   */
  setCompany: (company) =>
    set({
      company,
    }),

  /**
   * Show a member's profile.
   */
  selectMember: (member) =>
    set({
      selectedMember: member,
    }),

  /**
   * Return to showing the owner's profile.
   */
  clearSelectedMember: () =>
    set({
      selectedMember: null,
    }),

  /**
   * Open booking panel.
   */
  openBooking: () =>
    set({
      bookingOpen: true,
    }),

  /**
   * Close booking panel.
   */
  closeBooking: () =>
    set({
      bookingOpen: false,
    }),

  /**
   * Reset the page.
   * Useful when navigating between providers.
   */
  reset: () =>
    set({
      company: null,
      selectedMember: null,
      bookingOpen: false,
    }),
}));
