'use client';

import { useChatStore } from '@/modules/chat/store/chatStore';
import { useEffect } from 'react';

export function LiteChatView({ userId, onBack }) {
  const activeChannelId = useChatStore((s) => s.activeChannelId);
  const messages = useChatStore((s) => s.messages);
  const channelAlerts = useChatStore((s) => s.channelAlerts);
  const setViewedChannel = useChatStore((s) => s.setViewedChannel);
  const clearViewedChannel = useChatStore((s) => s.clearViewedChannel);

  function timeAgo(date) {
  const now = new Date();
  const then = new Date(date);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}


  // const messages = messagesMap[userId] ?? []

  useEffect(() => {
    if (activeChannelId) {
      setViewedChannel(activeChannelId);
      return () => clearViewedChannel();
    }
    clearViewedChannel();
  }, [activeChannelId, setViewedChannel, clearViewedChannel]);

  const channelMessages = activeChannelId
    ? (messages[activeChannelId] ?? [])
    : [];
  const activeChannelAlert = activeChannelId
    ? channelAlerts[activeChannelId]
    : null;

return (
  <div className="flex flex-col h-full">
    {activeChannelAlert && (
      <div className="px-4 py-2 text-sm text-amber-800 bg-amber-100 border-b border-amber-200">
        {activeChannelAlert}
      </div>
    )}

    <div className="flex-1 p-4 overflow-y-auto space-y-3">
      {channelMessages.map((m) => {
        const isMe = m.sender === userId;

        return (
          <div
            key={m.id}
            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex flex-col max-w-[70%]">
              {/* Username (only for others) */}
              {!isMe && (
                <span className="text-xs text-zinc-500 mb-1">
                  {m.sender?.username}
                </span>
              )}

              {/* Message bubble */}
              <div
                className={`px-3 py-2 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-zinc-200 text-zinc-900 rounded-bl-none'
                }`}
              >
                {m.content}
              </div>

              {/* Time */}
              <span
                className={`text-[10px] mt-1 ${
                  isMe ? 'text-right text-zinc-400' : 'text-left text-zinc-400'
                }`}
              >
                {timeAgo(m.createdAt)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

}
