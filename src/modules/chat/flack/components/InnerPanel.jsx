'use client';

import React from 'react';
import { useUIStore } from '../store/uiStore.js';
import { Home } from './Home.jsx';
import { GroupChannels } from './GroupChannels.jsx';
import { DmChannels } from './DmChannels.jsx';
import CalendarSidebar from '../calendar/CalendarSidebar.jsx';
import SearchFlackUser from './SearchFlackUser.jsx';

export function InnerPanel() {
  const { activeTab } = useUIStore();

  return (
    <aside className="min-h-0 min-w-0 w-full overflow-y-auto border-r border-zinc-800 bg-[#292929] text-white md:w-64 md:shrink-0">
      {activeTab !== 'calendar' && (
        <h2 className="text-lg !font-semibold pl-4 pt-4 capitalize !text-[white]">
          {activeTab}
        </h2>
      )}

      {activeTab === 'home' && (
        <div className="p-2">
          <p className="text-sm text-zinc-400 mb-3">All channels</p>
          <Home />
        </div>
      )}

      {activeTab === 'channels' && (
        <div className="p-2">
          <p className="text-sm text-zinc-400 mb-3">Public</p>
          <GroupChannels showAddNewChannel={true} />
        </div>
      )}

      {activeTab === 'dms' && (
        <div className="p-2">
          <SearchFlackUser />
          {/* <p className="text-sm text-zinc-400 mb-3">DM list</p> */}
          <DmChannels />
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="p-4">
          <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 px-4 py-8 text-center">
            <p className="text-sm font-medium text-zinc-200">
              Activity view unavailable
            </p>
            <p className="mt-1 text-xs leading-5 text-zinc-400">
              Conversation alerts remain available in the channel lists.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <>
          <CalendarSidebar />
        </>
      )}
    </aside>
  );
}
