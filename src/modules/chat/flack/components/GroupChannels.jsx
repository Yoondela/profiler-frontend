'use client';

import { useMemo, useState } from 'react';
import { useFlackStore } from '@/modules/chat/store/flackStore';
import { NewChannelModal } from '../modals/NewChannelModal.jsx';
import { Users } from 'lucide-react';
import { useUIStore } from '../store/uiStore.js';

export function GroupChannels() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setActiveChannel = useFlackStore((s) => s.setActiveChannel);
  const selectedChatId = useUIStore((s) => s.selectedChatId);
  const openConversation = useUIStore((s) => s.openConversation);
  const channels = useFlackStore((s) => s.channels);
  const newChannels = useFlackStore((s) => s.newChannels);
  const channelAlerts = useFlackStore((s) => s.channelAlerts);
  const createChannel = useFlackStore((s) => s.createChannel);

  const publicChannels = useMemo(
    () => channels.filter((c) => c.type === 'public'),
    [channels]
  );

  const handleCreateChannel = ({ channelName, selectedUsers }) => {
    console.log(
      'Creating channel with name:',
      channelName,
      'and users:',
      selectedUsers
    );
    createChannel({ name: channelName, memberIds: selectedUsers });
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {publicChannels.map((channel) => {
        const isSelected = selectedChatId === channel.id;

        return (
          <button
            key={channel.id}
            type="button"
            onClick={() => {
              openConversation(channel.id);
              setActiveChannel(channel.id);
            }}
            aria-pressed={isSelected}
            className={`w-full rounded-md border-l-2 p-2 py-1 text-left flex items-center justify-between gap-1 transition-colors ${
              isSelected
                ? 'border-zinc-500 bg-zinc-700/70'
                : 'border-transparent hover:bg-zinc-700/50'
            }`}
          >
            <div className="flex min-w-0 items-center gap-2">
              {/* Avatar */}
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-zinc-300 md:h-8 md:w-8">
                {channel?.avatar ? (
                  <img
                    src={channel.avatar}
                    alt={channel.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-500 text-white">
                    <Users size={16} />
                  </div>
                )}
              </div>

              {/* Username + alert */}
              <div className="flex min-w-0 flex-col">
                <span className="max-w-[calc(100vw-7rem)] truncate md:max-w-[150px]">
                  {channel?.name || 'Unknown Channel'}
                </span>

                {channelAlerts[channel.id] && (
                  <span className="text-xs text-amber-700">
                    {channelAlerts[channel.id]}
                  </span>
                )}

                {!channelAlerts[channel.id] && channel.lastMessage && (
                  <div className="text-xs text-zinc-400 truncate max-w-[150px]">
                    <span className="text-xs text-white-700">
                      {channel.lastMessage?.senderName}:{' '}
                      {channel.lastMessage?.content}
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

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="mt-4 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-left text-sm font-semibold text-white hover:border-zinc-500 hover:bg-zinc-800"
      >
        + new channel
      </button>

      <NewChannelModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateChannel}
      />
    </div>
  );
}

export default GroupChannels;
