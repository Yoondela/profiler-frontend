import React from 'react';
import { useUIStore } from '../store/uiStore';
import ChatView from './ChatView';
import CalendarView from '../calendar/CalendarView';

export function MainView() {
  const activeTab = useUIStore((s) => s.activeTab);

  console.log('MainView activeTab:', activeTab);

  return activeTab === 'calendar' ? <CalendarView /> : <ChatView />;
}

export default MainView;
