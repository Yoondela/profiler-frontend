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
    <div className="w-64 bg-[#292929] border-r border-zinc-800 text-white overflow-y-auto">
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

      {activeTab === 'calendar' && (
        <>
          <CalendarSidebar />
        </>
      )}
    </div>
  );
}
