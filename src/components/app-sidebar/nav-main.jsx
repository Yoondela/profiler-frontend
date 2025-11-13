import { NavLink } from "react-router-dom"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function NavMain({ menuItems }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {menuItems.map(({ to, icon: Icon, label }) => (
          <SidebarMenuItem key={to}>
            <SidebarMenuButton asChild>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `global-child flex items-center gap-2 px-2 py-2 rounded-md transition ${
                    isActive ? "bg-muted text-primary" : ""
                  }`
                }
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{label}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
