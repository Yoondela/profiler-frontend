import UserAvatar from "../sub/common/UserAvatar"
import { useUserContext } from "@/api/context/userContext";
import { useAuth0 } from "@auth0/auth0-react"
import { NavLink } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export function AppUserAvatar() {
    const { avatarUrlCtx } = useUserContext();
    const { user } = useAuth0();
  return (
    <NavLink to="/user-profile">
      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm cursor-pointer">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={avatarUrlCtx} />
          <AvatarFallback className="rounded-lg"><UserAvatar menu="false" /></AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{user?.name}</span>
          <span className="truncate text-xs">{user?.email}</span>
        </div>
      </div>

    </NavLink>
  )
}
