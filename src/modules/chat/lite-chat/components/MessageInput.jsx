import { useState, useEffect, use } from 'react';
import { useChatStore } from '@/modules/chat/store/chatStore';

export function MessageInput({ userId }) {
  const [input, setInput] = useState('');
  const sendMessage = useChatStore((s) => s.sendMessage);
  const trimmedInput = input.trim();
  const canSend = trimmedInput.length > 0;

  const activeChannelId = useChatStore((s) => s.activeChannelId);

  useEffect(() => {
    if (activeChannelId) {
      console.log('Active channel changed:', activeChannelId);
    }
  }, [activeChannelId]);

  useEffect(() => {
    console.log(
      'canSend:',
      canSend,
      'input:',
      input,
      'activeChannelId:',
      activeChannelId
    );
  }, [canSend, input, activeChannelId]);

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSend) return;
        if (!activeChannelId) return;
        sendMessage(activeChannelId, trimmedInput);
        setInput('');
      }}
    >
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 border rounded w-12 px-3 py-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="border rounded px-3 py-2 text-sm"
        disabled={!canSend}
      >
        Send
      </button>
    </form>
  );
}
