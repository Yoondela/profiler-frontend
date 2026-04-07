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

  const users = ['amber', 'Yondela Sasayi', 'bonga@bones.com']; // temp until API

  return (
    // todo:display 
    <div className="flex flex-col">
      {channels.map((channel) => {

        const otherUser = channel.members.find((m) => m !== userId);

        return (
        <button
          key={channel.id}
          onClick={() => {
            setActiveChannel(channel.id);
            onSelect(channel.id);
          }}
          className="p-4 text-left hover:bg-zinc-100 flex items-start justify-between gap-3"
        >
          <div className="flex flex-col">
            <span className="truncate max-w-[150px]">{otherUser || channel.id}</span>
            {channelAlerts[channel.id] && (
              <span className="text-xs text-amber-700">
                {channelAlerts[channel.id]}
              </span>
            )}
          </div>
          {newChannels[channel.id] && <span className="badge-dot" />}
        </button>
        );
      })}

      {users.map((id) => (
        <div>
          <button
            key={id}
            onClick={() => {
              const existing = getDMChannel(id);

              console.log('existing:', existing, id);

              if (existing) {
                console.log(
                  'Existing channel found, setting active:',
                  existing.id
                );
                setActiveChannel(existing.id);
              } else {
                console.log('No existing channel, starting DM with:', id);
                startDM(id);
              }

              onSelect(existing?.id ?? id);
            }}
            className="p-4 text-left hover:bg-zinc-100"
          >
            {id}
          </button>
          {/* <div>Last message</div> */}
        </div>
      ))}
    </div>
  );
}
