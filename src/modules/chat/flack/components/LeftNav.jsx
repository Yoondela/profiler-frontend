'use client';

import React from 'react';
import { useUIStore } from '../store/uiStore.js';
import { Home, Network, MessageCircle, Bell, Calendar } from 'lucide-react';

const tabs = [
  { id: 'home', icon: Home },
  { id: 'channels', icon: Network },
  { id: 'dms', icon: MessageCircle },
  { id: 'activity', icon: Bell },
  { id: 'calendar', icon: Calendar },
];

export function LeftNav() {
  const { activeTab, setTab } = useUIStore();

  return (
    <nav
      aria-label="Flack sections"
      className="flex h-[calc(3.5rem+env(safe-area-inset-bottom))] w-full shrink-0 items-start justify-around gap-1 border-t border-zinc-700 bg-[#292929] px-1 pt-1 pb-[env(safe-area-inset-bottom)] text-white md:h-auto md:w-16 md:flex-col md:items-center md:justify-start md:gap-4 md:border-t-0 md:px-0 md:py-4"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
              activeTab === tab.id ? 'bg-zinc-700' : 'hover:bg-zinc-800'
            }`}
            aria-label={`Go to ${tab.id}`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <Icon size={20} />
          </button>
        );
      })}
    </nav>
  );
}

export default LeftNav;
