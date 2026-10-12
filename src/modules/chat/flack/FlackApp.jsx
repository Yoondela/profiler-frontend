'use client';

import React, { useEffect, useLayoutEffect } from 'react';

import { LeftNav } from './components/LeftNav.jsx';
import { InnerPanel } from './components/InnerPanel.jsx';
import { MainView } from './components/MainView.jsx';
import ChatView from './components/ChatView.jsx';
import CalendarView from './calendar/CalendarView.jsx';

import { useUserContext } from '@/api/context/userContext.jsx';
import { useFlackStore } from '../store/flackStore.js';
import { CalendarProvider } from './calendar/CalendarContext.jsx';
import { useUIStore } from './store/uiStore.js';
import { useIsMobile } from '@/hooks/use-mobile.js';

export function FlackApp() {
  const { flackUser_ID } = useUserContext();

  const connect = useFlackStore((s) => s.connect);
  const activeTab = useUIStore((s) => s.activeTab);
  const mobilePane = useUIStore((s) => s.mobilePane);
  const showConversationList = useUIStore((s) => s.showConversationList);
  const resetForUser = useUIStore((s) => s.resetForUser);
  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    resetForUser(flackUser_ID);

    return () => resetForUser(null);
  }, [flackUser_ID, resetForUser]);

  useEffect(() => {
    if (!flackUser_ID) return;

    connect(flackUser_ID);
  }, [flackUser_ID, connect]);

  useEffect(() => {
    if (isMobile) {
      showConversationList();
    }
  }, [isMobile, showConversationList]);

  return (
    <div className="mt-[calc(3.5rem-2.6rem)] flex h-[calc(100dvh-3.5rem)] min-h-0 w-full overflow-hidden bg-[#1a1d21] md:mt-0 md:h-[calc(100dvh-2.6rem)]">
      <CalendarProvider>
        {isMobile ? (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <main className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
              {activeTab === 'calendar' ? (
                <CalendarView />
              ) : mobilePane === 'conversation' ? (
                <ChatView isMobile onBack={showConversationList} />
              ) : (
                <InnerPanel />
              )}
            </main>
            <LeftNav />
          </div>
        ) : (
          <>
            <LeftNav />
            <InnerPanel />
            <MainView />
          </>
        )}
      </CalendarProvider>
    </div>
  );
}

export default FlackApp;
