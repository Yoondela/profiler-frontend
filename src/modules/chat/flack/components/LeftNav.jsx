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
    <div className="w-16 bg-[#292929] text-white flex flex-col items-center py-4 gap-4">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`p-3 rounded-xl ${
              activeTab === tab.id ? 'bg-zinc-700' : 'hover:bg-zinc-800'
            }`}
            aria-label={`Go to ${tab.id}`}
          >
            <Icon size={20} />
          </button>
        );
      })}
    </div>
  );
}

export default LeftNav;
