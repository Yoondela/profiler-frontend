'use client';

import { useChatStore } from '@/modules/chat/store/chatStore';
import { useEffect } from 'react';

export function LiteChatView({ userId, onBack }) {
  const activeChannelId = useChatStore((s) => s.activeChannelId);
  const messages = useChatStore((s) => s.messages);
  const channelAlerts = useChatStore((s) => s.channelAlerts);
  const setViewedChannel = useChatStore((s) => s.setViewedChannel);
  const clearViewedChannel = useChatStore((s) => s.clearViewedChannel);

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
      <div className="flex-1 p-4 overflow-y-auto">
        {channelMessages.map((m) => (
          <div key={m.id}>{m.content}</div>
        ))}
      </div>
    </div>
  );
}
