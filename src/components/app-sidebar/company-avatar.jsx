import useProviderPortfolio from "@/hooks/useProviderPortfolio";
import StarDisplay from "../common/StartDisplay";
import { NavLink } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export function CompanyAvatar() {
  const { portfolio, loading, error, refetch } = useProviderPortfolio();

  if (loading) return <div className="p-4">Loading portfolio...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading portfolio.</div>;
  if (!portfolio) return <div className="p-4 text-muted-foreground">No portfolio found.</div>;

  return (
    <NavLink
      to="/provider-page"
     >
      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={portfolio.logoUrl} />
          <AvatarFallback className="rounded-lg">Ex</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{portfolio.company}</span>
          <div className=" truncate flex items-center gap-1">
            <StarDisplay rating={portfolio.rating} />
            <span className="text-xs text-gray-500">{portfolio.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

    </NavLink>
  )
}
