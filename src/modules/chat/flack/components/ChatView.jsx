'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useChatStore } from '../../store/chatStore.js';

function timeAgo(date) {
  if (!date) return '';
  const now = new Date();
  const then = new Date(date);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function getChannelTitle(channel, userId) {
  if (!channel) return 'No chat selected';

  if (channel.name) return channel.name;

  if (Array.isArray(channel.members)) {
    const other = channel.members.find((member) => {
      if (!member) return false;
      if (typeof member === 'string') return member !== userId;
      return member.userId !== userId && member.id !== userId;
    });

    if (other) {
      return other.username || other.displayName || other.userId || other.id || 'Direct message';
    }
  }

  return channel.id || 'Direct message';
}

export function ChatView() {
  const activeChannelId = useChatStore((s) => s.activeChannelId);
  const channels = useChatStore((s) => s.channels);
  const messages = useChatStore((s) => s.messages);
  const userId = useChatStore((s) => s.userId);
  const channelAlerts = useChatStore((s) => s.channelAlerts);
  const setViewedChannel = useChatStore((s) => s.setViewedChannel);
  const clearViewedChannel = useChatStore((s) => s.clearViewedChannel);
  const sendMessage = useChatStore((s) => s.sendMessage);

  const [draft, setDraft] = useState('');
  const messageEndRef = useRef(null);

  const activeChannel = useMemo(
    () => channels.find((channel) => channel.id === activeChannelId),
    [channels, activeChannelId]
  );

  const channelMessages = activeChannelId ? messages[activeChannelId] ?? [] : [];
  const activeAlert = activeChannelId ? channelAlerts[activeChannelId] : null;

  useEffect(() => {
    if (activeChannelId) {
      setViewedChannel(activeChannelId);
      return () => clearViewedChannel();
    }
    clearViewedChannel();
  }, [activeChannelId, setViewedChannel, clearViewedChannel]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages.length]);

  const handleSend = (event) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || !activeChannelId) return;
    sendMessage(activeChannelId, trimmed);
    setDraft('');
  };

  return (
    <div className="flex-1 flex flex-col border-l border-zinc-900 bg-zinc-950 text-white">
      <div className="border-b border-zinc-900 bg-zinc-900 px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.15em] text-zinc-400">Chat</p>
          <h2 className="mt-1 text-lg font-semibold text-white">
            {getChannelTitle(activeChannel, userId)}
          </h2>
        </div>
        {activeAlert ? (
          <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-200">
            {activeAlert}
          </span>
        ) : null}
      </div>

      {!activeChannelId ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-10">
            <p className="text-2xl font-semibold text-white mb-3">Select a chat to start messaging</p>
            <p className="text-sm leading-6 text-zinc-400 max-w-md">
              The selected conversation will appear here. Use the channel list to pick a thread and start typing.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
            {channelMessages.length === 0 ? (
              <div className="flex h-full min-h-[180px] items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/80 px-6 py-10 text-center text-sm text-zinc-400">
                No messages yet. Send the first message to begin the conversation.
              </div>
            ) : (
              channelMessages.map((message) => {
                const senderId =
                  message.senderId ?? message.sender?.id ?? message.sender;
                const isMe = senderId === userId;
                const senderName =
                  message.sender?.username ||
                  message.sender?.displayName ||
                  senderId ||
                  'Unknown';

                return (
                  <div
                    key={message.id ?? `${message.channelId}-${message.createdAt}-${Math.random()}`}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-[75%]">
                      {!isMe && (
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 mb-2">
                          {senderName}
                        </div>
                      )}
                      <div
                        className={`rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm ${
                          isMe
                            ? 'bg-sky-600 text-white rounded-br-none'
                            : 'bg-zinc-800 text-zinc-100 rounded-bl-none'
                        }`}
                      >
                        {message.content}
                      </div>
                      <div
                        className={`mt-2 text-[11px] text-zinc-500 ${
                          isMe ? 'text-right' : 'text-left'
                        }`}
                      >
                        {timeAgo(message.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messageEndRef} />
          </div>

          <div className="border-t border-zinc-900 bg-zinc-900 px-4 py-4">
            <form onSubmit={handleSend} className="flex items-end gap-3">
              <label className="sr-only" htmlFor="flack-message-input">
                Type a message
              </label>
              <textarea
                id="flack-message-input"
                rows={1}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Write a message..."
                className="min-h-[44px] flex-1 resize-none rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                className="inline-flex h-11 items-center rounded-2xl bg-sky-600 px-5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatView;
