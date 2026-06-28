'use client';

import { useMemo, useState } from 'react';
import { useChatStore } from '@/modules/chat/store/chatStore';
import { NewChannelModal } from '../modals/NewChannelModal.jsx';
import { Users } from 'lucide-react';

export function GroupChannels() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setActiveChannel = useChatStore((s) => s.setActiveChannel);
  const channels = useChatStore((s) => s.channels);
  const newChannels = useChatStore((s) => s.newChannels);
  const channelAlerts = useChatStore((s) => s.channelAlerts);
  const createChannel = useChatStore((s) => s.createChannel);

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
    <>
      {publicChannels.map((channel) => {
        return (
          <button
            key={channel.id}
            onClick={() => {
              setActiveChannel(channel.id);
            }}
            className="py-4 text-left hover:bg-zinc-100 flex items-start justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-lg bg-zinc-300 overflow-hidden">
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
              <div className="flex flex-col">
                <span className="truncate max-w-[150px]">
                  {channel?.name || 'Unknown Channel'}
                </span>

                {channelAlerts[channel.id] && (
                  <span className="text-xs text-amber-700">
                    {channelAlerts[channel.id]}
                  </span>
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
    </>
  );
}

export default GroupChannels;
