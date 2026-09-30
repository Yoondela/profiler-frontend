import { NavLink, Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar/app-sidebar';
import {
  BookmarkIcon,
  Calendar,
  GalleryVertical,
  LayoutDashboard,
} from 'lucide-react';

const mobileQuickLinks = [
  { to: '/provider-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/bookings', label: 'Bookings', icon: Calendar },
  { to: '/user-schedule', label: 'Calendar', icon: Calendar },
  { to: '/user-gallery', label: 'Gallery', icon: GalleryVertical },
  { to: '/marked-providers', label: 'Bookmarked', icon: BookmarkIcon },
];

export default function SidebarLayout() {
  return (
    // SidebarProvider must wrap ONLY the parts that use the ShadCN sidebar
    <SidebarProvider>
      <div className="flex min-h-screen w-full min-w-0">
        {/* Sidebar stays fixed width */}
        <AppSidebar />

        {/* Main content fills the rest */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-12 items-center justify-between border-b bg-white px-4 md:hidden">
            <nav
              aria-label="Mobile navigation shortcuts"
              className="flex min-w-0 items-center gap-1"
            >
              {mobileQuickLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  aria-label={label}
                  title={label}
                  className={({ isActive }) =>
                    `flex size-9 items-center justify-center rounded-md transition-colors ${
                      isActive
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="size-4" aria-hidden="true" />
                </NavLink>
              ))}
            </nav>
            <SidebarTrigger className="size-10 cursor-pointer" />
          </div>
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
