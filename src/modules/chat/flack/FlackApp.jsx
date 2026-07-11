'use client';

import React, { useEffect } from 'react';

import { LeftNav } from './components/LeftNav.jsx';
import { InnerPanel } from './components/InnerPanel.jsx';
import { MainView } from './components/MainView.jsx';

import { useUserContext } from '@/api/context/userContext.jsx';
import { useFlackStore } from '../store/flackStore.js';
import { CalendarProvider } from './calendar/CalendarContext.jsx';

export function FlackApp() {
  const { flackUser_ID } = useUserContext();

  const connect = useFlackStore((s) => s.connect);

  useEffect(() => {
    if (!flackUser_ID) return;

    connect(flackUser_ID);
  }, [flackUser_ID, connect]);

  return (
    <div className="flex h-[calc(100vh-2.6rem)] w-full">
      <CalendarProvider>
        <LeftNav />
        <InnerPanel />
        <MainView />
      </CalendarProvider>
    </div>
  );
}

export default FlackApp;
