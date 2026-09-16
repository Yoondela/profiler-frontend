'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFlackStore } from '../../store/flackStore.js';

function getSenderId(message) {
  return message.senderId ?? message.sender?.id ?? message.sender;
}

function getSenderName(message) {
  return message.sender?.username || message.sender?.displayName || getSenderId(message) || 'Unknown';
}

function formatMessageTime(date) {
  const value = new Date(date);
  if (!date || Number.isNaN(value.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(value);
}

function formatDateDivider(date) {
  const messageDate = new Date(date);
  if (Number.isNaN(messageDate.getTime())) return '';

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const isSameDate = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

  if (isSameDate(messageDate, today)) return 'Today';
  if (isSameDate(messageDate, yesterday)) return 'Yesterday';
  return new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(messageDate);
}

function isMessageGroupedWithPrevious(message, previousMessage) {
  if (!message || !previousMessage || getSenderId(message) !== getSenderId(previousMessage)) return false;
  const messageTime = new Date(message.createdAt).getTime();
  const previousTime = new Date(previousMessage.createdAt).getTime();
  if (Number.isNaN(messageTime) || Number.isNaN(previousTime)) return false;
  return (
    new Date(messageTime).toDateString() === new Date(previousTime).toDateString() &&
    messageTime - previousTime <= 5 * 60 * 1000
  );
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
    if (other) return other.username || other.displayName || other.userId || other.id || 'Direct message';
  }
  return channel.id || 'Direct message';
}

export function ChatView() {
  const activeChannelId = useFlackStore((s) => s.chat.activeChannelId);
  const channels = useFlackStore((s) => s.channels);
  const messages = useFlackStore((s) => s.messages);
  const userId = useFlackStore((s) => s.userId);
  const channelAlerts = useFlackStore((s) => s.channelAlerts);
  const setViewedChannel = useFlackStore((s) => s.setViewedChannel);
  const clearViewedChannel = useFlackStore((s) => s.clearViewedChannel);
  const sendMessage = useFlackStore((s) => s.sendMessage);
  const [draft, setDraft] = useState('');
  const messageEndRef = useRef(null);

  const activeChannel = useMemo(
    () => channels.find((channel) => channel.id === activeChannelId),
    [channels, activeChannelId]
  );
  const channelMessages = activeChannelId ? (messages[activeChannelId] ?? []) : [];
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

  function submitDraft() {
    const trimmed = draft.trim();
    if (!trimmed || !activeChannelId) return;
    sendMessage(activeChannelId, trimmed);
    setDraft('');
  }

  function handleSend(event) {
    event.preventDefault();
    submitDraft();
  }

  function handleComposerKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submitDraft();
    }
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col border-l border-zinc-800 bg-[#1a1d21] text-white">
      <div className="flex flex-col gap-3 border-b border-zinc-700/70 bg-[#1a1d21] px-5 py-3.5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="py-1 text-lg font-bold text-white!">{getChannelTitle(activeChannel, userId)}</h2>
        </div>
        {activeAlert ? <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-200">{activeAlert}</span> : null}
      </div>

      {!activeChannelId ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-10">
            <p className="mb-3 text-2xl font-semibold text-white">Select a chat to start messaging</p>
            <p className="max-w-md text-sm leading-6 text-zinc-400">The selected conversation will appear here. Use the channel list to pick a thread and start typing.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full flex-1 overflow-y-auto py-5">
            {channelMessages.length === 0 ? (
              <div className="mx-4 flex h-full min-h-[180px] items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 px-6 py-10 text-center text-sm text-zinc-400">No messages yet. Send the first message to begin the conversation.</div>
            ) : (
              channelMessages.map((message, index) => {
                const previousMessage = channelMessages[index - 1];
                const nextMessage = channelMessages[index + 1];
                const senderId = getSenderId(message);
                const senderName = getSenderName(message);
                const isMe = senderId === userId;
                const isGrouped = isMessageGroupedWithPrevious(message, previousMessage);
                const isLastInGroup = !isMessageGroupedWithPrevious(nextMessage, message);
                const showDateDivider = !previousMessage || new Date(message.createdAt).toDateString() !== new Date(previousMessage.createdAt).toDateString();
                const dateDivider = formatDateDivider(message.createdAt);

                return (
                  <React.Fragment key={message.id ?? `${message.channelId}-${message.createdAt}-${index}`}>
                    {showDateDivider && dateDivider ? (
                      <div className="my-5 flex items-center px-5" aria-label={dateDivider}>
                        <div className="h-px flex-1 bg-zinc-700/80" />
                        <span className="mx-3 rounded-full border border-zinc-700 bg-[#1a1d21] px-3 py-1 text-xs font-semibold text-zinc-300">{dateDivider}</span>
                        <div className="h-px flex-1 bg-zinc-700/80" />
                      </div>
                    ) : null}
                    <article
                      className={`group flex gap-3 px-5 hover:bg-white/[0.025] ${
                        isGrouped ? 'pt-0.5' : 'pt-2'
                      } ${isLastInGroup ? 'pb-3' : 'pb-0.5'}`}
                    >
                      <div className="w-9 shrink-0 pt-0.5 text-right text-[10px] text-zinc-600">
                        {isGrouped ? (
                          <time dateTime={message.createdAt} className="invisible group-hover:visible">{formatMessageTime(message.createdAt)}</time>
                        ) : (
                          <div className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold ${isMe ? 'bg-sky-700 text-sky-100' : 'bg-violet-800 text-violet-100'}`} aria-hidden="true">{senderName.charAt(0).toUpperCase()}</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        {!isGrouped && (
                          <div className="flex items-baseline gap-2">
                            <span className="truncate text-sm font-semibold text-zinc-200">{isMe ? 'You' : senderName}</span>
                            <time dateTime={message.createdAt} className="text-[11px] text-zinc-600">{formatMessageTime(message.createdAt)}</time>
                          </div>
                        )}
                        <p className={`break-words text-sm font-normal leading-[1.45rem] text-zinc-300 ${isGrouped ? '' : 'mt-0.5'}`}>{message.content}</p>
                      </div>
                    </article>
                  </React.Fragment>
                );
              })
            )}
            <div ref={messageEndRef} />
          </div>

          <div className="bg-[#1a1d21] px-4 pb-5 pt-3 sm:px-5">
            <form
              onSubmit={handleSend}
              className="overflow-hidden rounded-lg border border-zinc-600 bg-[#222529] shadow-sm transition focus-within:border-zinc-400 focus-within:ring-1 focus-within:ring-zinc-400/30"
            >
              <label className="sr-only" htmlFor="flack-message-input">
                Type a message
              </label>
              <textarea
                id="flack-message-input"
                rows={2}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleComposerKeyDown}
                placeholder={`Message ${getChannelTitle(activeChannel, userId)}`}
                className="block min-h-[76px] max-h-40 w-full resize-y bg-transparent px-4 pb-2 pt-3 text-[15px] leading-6 text-white outline-none placeholder:text-zinc-500"
              />
              <div className="flex items-center justify-between border-t border-zinc-700/60 bg-[#1f2226] px-2 py-1.5">
                <span className="hidden px-2 text-xs text-zinc-500 sm:inline">
                  Shift + Enter for a new line
                </span>
                <span className="px-2 text-xs text-zinc-500 sm:hidden">
                  Enter to send
                </span>
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  aria-label="Send message"
                  title="Send message"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-sky-600 text-white transition hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                    className="h-4 w-4"
                  >
                    <path
                      d="M3.25 9.25 16 3.5l-5.75 12.75-1.4-5.1-5.6-1.9Z"
                      fill="currentColor"
                    />
                    <path
                      d="m8.85 11.15 3.1-3.1"
                      stroke="#fff"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatView;
