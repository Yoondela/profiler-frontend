import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar/app-sidebar';

export default function SidebarLayout() {
  return (
    // SidebarProvider must wrap ONLY the parts that use the ShadCN sidebar
    <SidebarProvider>
      <div className="flex min-h-screen w-full min-w-0">
        {/* Sidebar stays fixed width */}
        <AppSidebar />

        {/* Main content fills the rest */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-12 items-center border-b bg-white px-4 md:hidden">
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
