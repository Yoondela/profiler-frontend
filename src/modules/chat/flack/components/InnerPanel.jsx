'use client';

import React, { useState, useMemo } from 'react';
import { useUIStore } from '../store/uiStore.js';
import { useChatStore } from '../../store/chatStore.js';
import { NewChannelModal } from '../modals/NewChannelModal.jsx';

export function InnerPanel() {
  const { activeTab } = useUIStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setActiveChannel = useChatStore((s) => s.setActiveChannel);
  const channels = useChatStore((s) => s.channels);
  const newChannels = useChatStore((s) => s.newChannels);
  const channelAlerts = useChatStore((s) => s.channelAlerts);
  const userId = useChatStore((s) => s.userId);

  const createChannel = useChatStore((s) => s.createChannel);

  const publicChannels = useMemo(
    () =>
      channels.filter(
        (c) => c.type === 'public'
      ),
    [channels]
  );

  const handleCreateChannel = ({ channelName, selectedUsers }) => {
    console.log('Creating channel with name:', channelName, 'and users:', selectedUsers);
    createChannel({ name: channelName, memberIds: selectedUsers });
    setIsModalOpen(false);
  };

  return (
    <div className="w-64 bg-zinc-800 !text-white p-4">
      <h2 className="text-lg !font-semibold !text-white mb-4 capitalize">{activeTab}</h2>

      {activeTab === 'home' && (
        <p className="text-sm text-zinc-400">Channels & DMs</p>
      )}

      {activeTab === 'channels' && (
        <>
          <p className="text-sm text-zinc-400">Channel list</p>
          {publicChannels.map((channel) => {
            const otherUser = channel.members.find((m) => m.userId !== userId);

            return (
              <button
                key={channel.id}
                onClick={() => {
                  setActiveChannel(channel.id);
                  onSelect(channel.id);
                }}
                className="p-4 text-left hover:bg-zinc-100 flex items-start justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-zinc-300 overflow-hidden">
                    {otherUser?.avatar && (
                      <img
                        src={otherUser.avatar}
                        alt={otherUser.username}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  {/* Username + alert */}
                  <div className="flex flex-col">
                    <span className="truncate max-w-[150px]">
                      {otherUser?.username || 'Unknown User'}
                    </span>
                  
                    {channelAlerts[channel.id] && (
                      <span className="text-xs text-amber-700">
                        {channelAlerts[channel.id]}
                      </span>
                    )}
                  </div>
                </div>
                  
                {/* New message dot */}
                {newChannels[channel.id] && <span className="badge-dot" />}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-4 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-left text-sm font-semibold text-white hover:border-zinc-500 hover:bg-zinc-800"
          >
            + new channel
          </button>
        </>
      )}

      {activeTab === 'dms' && <p className="text-sm text-zinc-400">DM list</p>}

      <NewChannelModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreateChannel} />
    </div>
  );
}

export default InnerPanel;
