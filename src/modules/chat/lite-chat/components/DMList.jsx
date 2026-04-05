'use client';

import { useChatStore } from '@/modules/chat/store/chatStore';

export function DMList({ onSelect }) {
  const startDM = useChatStore((s) => s.startDM);
  const getDMChannel = useChatStore((s) => s.getDMChannel);
  const setActiveChannel = useChatStore((s) => s.setActiveChannel);

  const users = ['amber', 'Yondela Sasayi', 'bonga@bones.com']; // temp until API

  return (
    <div className="flex flex-col">
      {users.map((id) => (
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

            onSelect(id);
          }}
          className="p-4 text-left hover:bg-zinc-100"
        >
          {id}
        </button>
      ))}
    </div>
  );
}
