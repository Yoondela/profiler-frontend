import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { NavMain } from './nav-main';
import {
  LayoutDashboard,
  Calendar,
  History,
  Clock,
  BookmarkIcon,
} from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import UserAvatar from '../sub/common/UserAvatar';
import { AppUserAvatar } from './app-user-avatar';
import { CompanyAvatar } from './company-avatar';
import { useSidebar } from '@/components/ui/sidebar';
import useProviderPortfolio from '@/hooks/useProviderPortfolio';
import { useState } from 'react';

export function AppSidebar() {
  const { user } = useAuth0();
  const { state } = useSidebar();
  const { portfolio, loading, error } = useProviderPortfolio();

  const menuItems = [
    { to: '/provider-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/history', icon: History, label: 'History' },
    { to: '/user-schedule', icon: Calendar, label: 'Calendar' },
    { to: '/upcoming', icon: Clock, label: 'Upcoming' },
    { to: '/marked-providers', icon: BookmarkIcon, label: 'Bookmarked' },
  ];

  return (
    <Sidebar
      collapsible="icon"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!
        bg-[var(--sidebar)] text-[var(--sidebar-foreground)] border-r border-[var(--sidebar-border)]"
    >
      <div
        className={`flex justify-center transition-all duration-900 w-full p-1 ${state == 'expanded' ? 'justify-end' : ''}`}
      >
        <SidebarTrigger className="cursor-pointer" />
      </div>
      {portfolio && !error && (
        <SidebarHeader className="p-1">
          <CompanyAvatar />
        </SidebarHeader>
      )}

      <SidebarContent>
        <NavMain menuItems={menuItems} />
      </SidebarContent>

      <SidebarFooter className="p-1">
        <AppUserAvatar />
      </SidebarFooter>
    </Sidebar>
  );
}
