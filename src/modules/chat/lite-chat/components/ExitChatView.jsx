'use client';

import { useFlackStore } from '@/modules/chat/store/flackStore';

export function ExitChatView({ channelId, onBack }) {
  const channels = useFlackStore((s) => s.channels);
  const userId = useFlackStore((s) => s.userId);
  const channel = channels.find((c) => c.id === channelId);
  const otherUser = channel?.members?.find((m) => m.userId !== userId);
  console.log('other user:', otherUser);
  const displayName = otherUser?.username || channelId;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 flex items-center gap-2">
        <button onClick={onBack}>←</button>
        <span className="font-semibold">{displayName}</span>
      </div>
    </div>
  );
}
