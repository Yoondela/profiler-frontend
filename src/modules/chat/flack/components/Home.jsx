'use client';

import { useMemo } from 'react';
import { Users } from 'lucide-react';
import { useFlackStore } from '@/modules/chat/store/flackStore';

function getOtherMember(channel, userId) {
  if (!Array.isArray(channel.members)) return null;

  return channel.members.find((member) => {
    if (!member) return false;
    if (typeof member === 'string') return member !== userId;
    if (typeof member === 'object') {
      return member.userId !== userId && member.id !== userId;
    }
    return false;
  });
}

function getChannelTitle(channel, userId) {
  if (channel.name) return channel.name;

  const other = getOtherMember(channel, userId);
  if (!other) return channel.type === 'dm' ? 'Direct message' : channel.id;

  return (
    other.username ||
    other.displayName ||
    other.email ||
    other.id ||
    'Direct message'
  );
}

function getChannelAvatar(channel, userId) {
  if (channel.avatar) return channel.avatar;

  const other = getOtherMember(channel, userId);
  return other?.avatar || null;
}

export function Home() {
  const setActiveChannel = useFlackStore((s) => s.setActiveChannel);
  const channels = useFlackStore((s) => s.channels);
  const newChannels = useFlackStore((s) => s.newChannels);
  const channelAlerts = useFlackStore((s) => s.channelAlerts);
  const userId = useFlackStore((s) => s.userId);

  const channelList = useMemo(
    () =>
      [...channels].sort((a, b) => {
        const titleA = getChannelTitle(a, userId).toLowerCase();
        const titleB = getChannelTitle(b, userId).toLowerCase();
        return titleA.localeCompare(titleB);
      }),
    [channels, userId]
  );

  console.log('Home channels:', channels);

  return (
    <div className="flex flex-col">
      {channelList.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/80 px-4 py-6 text-center text-sm text-zinc-400">
          No channels available.
        </div>
      ) : (
        channelList.map((channel) => {
          const title = getChannelTitle(channel, userId);
          const avatar = getChannelAvatar(channel, userId);

          return (
            <button
              key={channel.id}
              type="button"
              onClick={() => setActiveChannel(channel.id)}
              className="w-full rounded-2xl px-0 py-3 text-left hover:bg-zinc-700/50 flex items-center justify-between gap-1"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden flex items-center justify-center text-white">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users size={18} />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="truncate font-medium text-white">{title}</div>
                  {channelAlerts[channel.id] && (
                    <div className="text-xs text-amber-300">
                      {channelAlerts[channel.id]}
                    </div>
                  )}
                  {!channelAlerts[channel.id] && (
                    <div className="text-xs text-zinc-400 truncate max-w-[150px]">
                      <span className="text-xs text-white-700">
                        {channel.lastMessage.senderName}:{' '}
                        {channel.lastMessage.content}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })
      )}
    </div>
  );
}

export default Home;
