'use client';

import { useMemo } from 'react';
import { useFlackStore } from '@/modules/chat/store/flackStore';
import { useUIStore } from '../store/uiStore.js';

export function DmChannels() {
  const startDM = useFlackStore((s) => s.startDM);
  const getDMChannel = useFlackStore((s) => s.getDMChannel);
  const setActiveChannel = useFlackStore((s) => s.setActiveChannel);
  const selectedChatId = useUIStore((s) => s.selectedChatId);
  const setSelectedChat = useUIStore((s) => s.setSelectedChat);
  const channels = useFlackStore((s) => s.channels);
  const newChannels = useFlackStore((s) => s.newChannels);
  const channelAlerts = useFlackStore((s) => s.channelAlerts);
  const userId = useFlackStore((s) => s.userId);

  const dmChannels = useMemo(
    () => channels.filter((c) => c.type === 'dm'),
    [channels]
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Existing channels */}
      {dmChannels.map((channel) => {
        const otherUser = channel.members.find((m) => m.userId !== userId);
        const isSelected = selectedChatId === channel.id;

        return (
          <button
            key={channel.id}
            type="button"
            onClick={() => {
              setSelectedChat(channel.id);
              setActiveChannel(channel.id);
            }}
            aria-pressed={isSelected}
            className={`w-full rounded-md border-l-2 p-2 py-1 text-left flex items-center justify-between gap-1 transition-colors ${
              isSelected
                ? 'border-zinc-500 bg-zinc-700/70'
                : 'border-transparent hover:bg-zinc-700/50'
            }`}
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

                {!channelAlerts[channel.id] && (
                  <div className="text-xs text-zinc-400 truncate max-w-[150px]">
                    <span className="text-xs text-white-700">
                      {channel.lastMessage.content}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* New message dot */}
            {newChannels[channel.id] && <span className="badge-dot" />}
          </button>
        );
      })}
    </div>
  );
}

export default DmChannels;
