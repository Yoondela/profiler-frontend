import { HeartIcon, BookmarkIcon, BadgeCheck } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function PortfolioHeader({ provider }) {
  console.log('PortfolioHeader received provider:', provider);

  const bannerUrl = provider?.provider?.bannerUrl || '';
  const logoUrl = provider?.provider?.logoUrl || '';
  const providerName =
    provider?.company?.name || provider?.user?.name || 'Unknown Provider';

  return (
    <div className="relative w-full bg-background">
      {/* Banner Section */}
      <div className="relative w-full h-40 md:h-56 bg-gray-100 overflow-hidden rounded-lg">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt={`${providerName} banner`}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200" />
        )}
      </div>

      {/* Avatar + Info Section */}
      <div className="relative flex md:items-end flex-col sm:flex-row  gap-4 px-4 md:px-8 -mt-10">
        {/* Avatar */}
        <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${providerName} logo`}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
              {String(providerName).trim().charAt(0).toUpperCase() || '?'}
            </div>
          )}
        </div>

        {/* Name + Rating */}
        <div className="flex flex-col pb-2">
          <div className="flex gap-1">
            <h1 className="text-xl font-extrabold md:text-2xl leading-tight text-gray-500">
              {providerName}
            </h1>
            <BadgeCheck className="text-blue-300" />
          </div>

          {/* {averageRating && (
            <div className="flex hidden md:flex items-center gap-1 text-sm text-muted-foreground">
              <StarDisplay rating={averageRating} />
              <span className="text-xs text-gray-500">
                {averageRating.toFixed(1)}
              </span>
            </div>
          )} */}
        </div>

        {/* Toggle Group pinned to right */}
        <div className="absolute right-4 top-13">
          <ToggleGroup type="multiple" variant="" spacing={0} size="">
            <ToggleGroupItem
              value="like"
              aria-label="Like"
              className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500 cursor-pointer"
            >
              <HeartIcon />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="save"
              aria-label="Save"
              className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500 cursor-pointer"
            >
              <BookmarkIcon className="w-15 h-15" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}
