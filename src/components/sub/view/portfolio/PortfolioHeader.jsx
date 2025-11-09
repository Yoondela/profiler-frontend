// components/portfolio/PortfolioHeader.tsx
import { useState, useEffect } from 'react';
import { Building2, Star } from 'lucide-react';
import LogoUpload from './LogoUploader';
import { updatePortfolio } from '@/api/sync/SyncPortfolio';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserContext } from '@/api/context/userContext';
import { getUserID } from '@/api/sync/SyncUser';
import toast from 'react-hot-toast';

export default function PortfolioHeader({
  bannerUrl,
  avatarUrl,
  providerName,
  averageRating,
  reviewCount,
}) {
  const { user, getAccessTokenSilently } = useAuth0();
  const { setLogoUrlCtx, isProviderCtx, setIsProviderCtx, appUser_ID } =
    useUserContext();
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

  const onUploadSuccess = async (newImgUrl) => {
    setLogoUrlCtx(newImgUrl);

    await updatePortfolio(userBackendId, { logoUrl: newImgUrl });
    console
      .log('we hereeeee')
      .then((res) => {
        console.log('Portfolio updated successfully:', res);
      })
      .catch((err) => {
        toast.error('Failed to update logo. Please try again.');
      });
  };

  return (
    <div className="w-full">
      {/* Banner */}
      <div
        className="w-full h-40 md:h-56 bg-center bg-cover rounded-b-3xl"
        style={{ backgroundImage: `url(${bannerUrl})` }}
      />

      {/* Avatar + Info */}
      <div className="relative flex items-end gap-4 px-4 -mt-12 md:px-8">
        {/* Avatar */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-background shadow-xl bg-pink-100">
          <LogoUpload logoUrl={true} onUploadSuccess={onUploadSuccess} />
          <img
            src={avatarUrl}
            alt={providerName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name + Rating */}
        <div className="flex flex-col pb-2">
          <h1 className="text-xl md:text-2xl font-semibold leading-tight">
            {providerName}
          </h1>

          {averageRating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-current" />
              <span>{averageRating.toFixed(1)}</span>
              {reviewCount && (
                <span className="text-muted-foreground">({reviewCount})</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}
