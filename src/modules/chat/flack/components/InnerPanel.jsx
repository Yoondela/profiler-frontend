'use client';

import React from 'react';
import { useUIStore } from '../store/uiStore.js';
import { Home } from './Home.jsx';
import { GroupChannels } from './GroupChannels.jsx';
import { DmChannels } from './DmChannels.jsx';

export function InnerPanel() {
  const { activeTab } = useUIStore();

  return (
    <div className="w-64 bg-zinc-800 !text-white p-4">
      <h2 className="text-lg !font-semibold !text-white mb-4 capitalize">
        {activeTab}
      </h2>

      {activeTab === 'home' && (
        <>
          <p className="text-sm text-zinc-400 mb-3">All channels</p>
          <Home />
        </>
      )}

      {activeTab === 'channels' && (
        <>
          <p className="text-sm text-zinc-400 mb-3">Channel list</p>
          <GroupChannels showAddNewChannel={true} />
        </>
      )}

      {activeTab === 'dms' && (
        <>
          <p className="text-sm text-zinc-400 mb-3">DM list</p>
          <DmChannels />
        </>
      )}
    </div>
  );
}
