'use client';

import React from 'react';

import { LeftNav } from './components/LeftNav.jsx';
import { InnerPanel } from './components/InnerPanel.jsx';
import { ChatView } from './components/ChatView.jsx';

export function FlackApp() {
  return (
    <div className="flex h-screen w-full">
      <LeftNav />
      <InnerPanel />
      <ChatView />
    </div>
  );
}

export default FlackApp;
