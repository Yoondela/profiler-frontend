import { useState, useEffect } from 'react';
import { Star, HeartIcon, BookmarkIcon,BadgeCheck} from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import LogoUpload from './LogoUploader';
import BannerUpload from './BannerUpload';
import { updatePortfolio } from '@/api/sync/SyncPortfolio';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserContext } from '@/api/context/userContext';
import { getUserID } from '@/api/sync/SyncUser';
import { toast } from 'sonner';

export default function PortfolioHeader({
  bannerUrl,
  logoUrl,
  providerName,
  averageRating,
  reviewCount,
}) {
  const { user, getAccessTokenSilently } = useAuth0();
  const { setBannerUrlCtx, setLogoUrlCtx, appUser_ID } = useUserContext();
  const [userBackendId, setUserBackendId] = useState(appUser_ID);

  useEffect(() => {
    const fetchUser = async () => {
      if (!appUser_ID && user) {
        const id = await getUserID(getAccessTokenSilently, user.email);
        setUserBackendId(id);
      }
    };
    fetchUser();
  }, [appUser_ID, user]);

  const onLogoUploadSuccess = async (newImgUrl) => {
    setLogoUrlCtx(newImgUrl);
    try {
      await updatePortfolio(userBackendId, { logoUrl: newImgUrl });
      console.log('Portfolio updated successfully');
    } catch {
      toast.error('Failed to update logo. Please try again.');
    }
  };

  const onBannerUploadSuccess = async (newImgUrl) => {
    setBannerUrlCtx(newImgUrl);
    try {
      await updatePortfolio(userBackendId, { bannerUrl: newImgUrl });
      console.log('Portfolio updated successfully');
    } catch {
      toast.error('Failed to update banner. Please try again.');
    }
  };

  return (
    <div className="relative w-full bg-background">
      {/* Banner Section */}
      <BannerUpload
        currentBannerUrl={bannerUrl}
        onUploadSuccess={onBannerUploadSuccess}
      />

      {/* Avatar + Info Section */}
      <div className="relative flex items-end gap-4 px-4 md:px-8 -mt-10">
        {/* Avatar */}
        <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
          <LogoUpload logoUrl={logoUrl} onUploadSuccess={onLogoUploadSuccess} />
        </div>

        {/* Name + Rating */}
        <div className="flex flex-col pb-2">
          <div className="flex gap-1">
            <h1 className="text-xl font-extrabold md:text-2xl leading-tight text-gray-500">
              {providerName}
            </h1>
            <BadgeCheck className="text-blue-300" />
          </div>

          {averageRating && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-current text-gray-400" />
              <span>{averageRating.toFixed(1)}</span>
              {reviewCount && <span>({reviewCount})</span>}
            </div>
          )}
        </div>

        {/* Toggle Group pinned to right */}
        <div className="absolute right-4 top-13">
          <ToggleGroup type="multiple" variant="outline" spacing={2} size="lg">
            <ToggleGroupItem
              value="like"
              aria-label="Like"
              className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500 cursor-pointer"
              >
              <HeartIcon className="w-10 h-10" />
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="save" 
              aria-label="Save"
              className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500 cursor-pointer"
            >
              <BookmarkIcon className="w-10 h-10" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}
