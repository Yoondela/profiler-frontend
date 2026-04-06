'use client';

import { useChatStore } from '@/modules/chat/store/chatStore';
import { useEffect } from 'react';

export function LiteChatView({ userId, onBack }) {
  const activeChannelId = useChatStore((s) => s.activeChannelId);
  const messages = useChatStore((s) => s.messages);
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-y-auto">
        {channelMessages.map((m) => (
          <div key={m.id}>{m.content}</div>
        ))}
      </div>
    </div>
  );
}
