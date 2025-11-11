import { useState, useEffect } from 'react';
import { Star, Pencil } from 'lucide-react';
import LogoUpload from './LogoUploader';
import BannerUpload from './BannerUpload';
import { updatePortfolio } from '@/api/sync/SyncPortfolio';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserContext } from '@/api/context/userContext';
import { getUserID } from '@/api/sync/SyncUser';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import toast from 'react-hot-toast';

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
      toast.error('Failed to update logo. Please try again.');
    }
  };

  return (
    <div className="w-full bg-background">
      {/* Banner Wrapper */}
      <BannerUpload
        currentBannerUrl={bannerUrl}
        onUploadSuccess={onBannerUploadSuccess}
      />
      {/* Avatar + Info */}
      <div className="relative flex items-end gap-4 px-4 md:px-8 -mt-10">
        <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
          <LogoUpload logoUrl={logoUrl} onUploadSuccess={onLogoUploadSuccess} />
          {/* {logoUrl && (
            <img
              src={logoUrl}
              alt={providerName}
              className="w-full h-full object-cover"
            />
          )} */}
        </div>

        <div className="flex flex-col pb-2">
          <h1 className="text-xl md:text-2xl font-semibold leading-tight">
            {providerName}
          </h1>

          {averageRating && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-current text-yellow-500" />
              <span>{averageRating.toFixed(1)}</span>
              {reviewCount && <span>({reviewCount})</span>}
            </div>
          )}
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}
