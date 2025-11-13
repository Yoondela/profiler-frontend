import { Outlet } from "react-router-dom";
import { SidebarProvider} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";

export default function SidebarLayout() {
  return (
    // SidebarProvider must wrap ONLY the parts that use the ShadCN sidebar
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar stays fixed width */}
        <AppSidebar />

        {/* Main content fills the rest */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 pt-12">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
