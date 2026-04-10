'use client';

import { useChatStore } from '@/modules/chat/store/chatStore';

export function DMList({ onSelect }) {
  const startDM = useChatStore((s) => s.startDM);
  const getDMChannel = useChatStore((s) => s.getDMChannel);
  const setActiveChannel = useChatStore((s) => s.setActiveChannel);
  const channels = useChatStore((s) => s.channels);
  const newChannels = useChatStore((s) => s.newChannels);
  const channelAlerts = useChatStore((s) => s.channelAlerts);
  const userId = useChatStore((s) => s.userId);

  const users = ['amber', 'Yondela Sasayi', 'bonga@bones.com']; // temp

  console.log('Channels:', channels);
  
  return (
    <div className="flex flex-col">
      {/* Existing channels */}
      {channels.map((channel) => {
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

      {/* Temp users list */}
      {users.map((id) => (
        <div key={id}>
          <button
            onClick={() => {
              const existing = getDMChannel(id);

              if (existing) {
                setActiveChannel(existing.id);
                onSelect(existing.id);
              } else {
                startDM(id);
                onSelect(id);
              }
            }}
            className="p-4 text-left hover:bg-zinc-100"
          >
            {id}
          </button>
        </div>
      ))}
    </div>
  );
}
