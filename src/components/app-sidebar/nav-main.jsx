import { NavLink } from 'react-router-dom';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useSidebar } from '@/components/ui/sidebar';
import { useBookings } from '@/api/context/bookingsContext';

export function NavMain({ menuItems }) {
  const { state } = useSidebar();
  let hasBookingNew = false;
  try {
    const b = useBookings();
    hasBookingNew = !!b?.hasNew;
  } catch (e) {
    // provider not present
  }
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[var(--sidebar-foreground)]/70">
        Menu
      </SidebarGroupLabel>

      <SidebarMenu>
        {menuItems.map(({ to, icon: Icon, label }) => (
          <SidebarMenuItem key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                ` w-full
                flex items-center gap-2 rounded-lg 
                transition-all duration-200! 
                text-[var(--sidebar-foreground)]! 
                hover:bg-[var(--sidebar-accent)]! 
                hover:text-[var(--sidebar-accent-foreground)]!
                ${state == 'expanded' ? 'py-2' : ''}
                ${
                  isActive
                    ? 'bg-[var(--sidebar-accent)]! text-[var(--sidebar-primary-foreground)]'
                    : ''
                }
                `
              }
            >
              <SidebarMenuButton asChild>
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{label}</span>
                  {to === '/bookings' && hasBookingNew && (
                    <span className="ml-2 inline-block h-2 w-2 rounded-full bg-red-600" />
                  )}
                </div>
              </SidebarMenuButton>
            </NavLink>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
