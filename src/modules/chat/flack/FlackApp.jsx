'use client';

import React, { useEffect } from 'react';

import { LeftNav } from './components/LeftNav.jsx';
import { InnerPanel } from './components/InnerPanel.jsx';
import { ChatView } from './components/ChatView.jsx';

import { useUserContext } from '@/api/context/userContext.jsx';
import { useChatStore } from '../store/chatStore.js';

export function FlackApp() {
  const { flackUser_ID } = useUserContext();

  const connect = useChatStore((s) => s.connect);

  useEffect(() => {
    if (!flackUser_ID) return;

    connect(flackUser_ID);
  }, [flackUser_ID, connect]);

  return (
    <div className="flex h-[calc(100vh-2.6rem)] w-full">
      <LeftNav />
      <InnerPanel />
      <ChatView />
    </div>
  );
}

export default FlackApp;
