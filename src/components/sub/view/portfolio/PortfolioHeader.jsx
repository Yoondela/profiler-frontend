import { useState, useEffect } from 'react';
import { Star, HeartIcon, BookmarkIcon, BadgeCheck } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import LogoUpload from './LogoUploader';
import BannerUpload from './BannerUpload';
import { updatePortfolio } from '@/api/sync/SyncPortfolio';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserContext } from '@/api/context/userContext';
import { getUserID } from '@/api/sync/SyncUser';
import { toast } from 'sonner';
import StarDisplay from '@/components/common/StartDisplay';
import axios from 'axios';

export default function PortfolioHeader({ provider }) {
  const { user, getAccessTokenSilently } = useAuth0();
  const { setBannerUrlCtx, setLogoUrlCtx, appUser_ID } = useUserContext();
  const [userBackendId, setUserBackendId] = useState(appUser_ID);

  // todo: why are these props undefine

  console.log('PortfolioHeader received provider:', provider);

  const bannerUrl = provider?.portfolio?.bannerUrl || '';
  const logoUrl = provider?.portfolio?.logoUrl || '';
  const providerName =
    provider?.company?.name || provider?.user?.name || 'Unknown Provider';
  const averageRating = provider?.portfolio?.rating || 0;
  const reviewCount = provider?.portfolio?.completedJobs || 0;

  useEffect(() => {
    const fetchUser = async () => {
      if (!appUser_ID && user) {
        const id = await getUserID(getAccessTokenSilently, user.email);
        setUserBackendId(id);
      }
    };
    fetchUser();
  }, [appUser_ID, user, getAccessTokenSilently]);

  const updateDisplayedListingBranding = async (changes) => {
    if (provider?.portfolio?.type !== 'company') {
      return updatePortfolio(userBackendId, changes, getAccessTokenSilently);
    }

    const companyId = provider.portfolio.id;
    if (!companyId) throw new Error('No company ID provided');

    const token = await getAccessTokenSilently();
    if (!token) throw new Error('Authentication is required');

    const response = await axios.patch(
      `${import.meta.env.VITE_API_URL}/company/${companyId}/edits`,
      changes,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  };

  const onLogoUploadSuccess = async (newImgUrl) => {
    try {
      await updateDisplayedListingBranding({ logoUrl: newImgUrl });
      setLogoUrlCtx(newImgUrl);
      console.log('Portfolio updated successfully');
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please sign in again before updating your logo.');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to edit this portfolio.');
      } else if (error.message === 'Authentication is required') {
        toast.error('Please sign in again before updating your logo.');
      } else {
        toast.error('Failed to update logo. Please try again.');
      }
    }
  };

  const onBannerUploadSuccess = async (newImgUrl) => {
    try {
      await updateDisplayedListingBranding({ bannerUrl: newImgUrl });
      setBannerUrlCtx(newImgUrl);
      console.log('Portfolio updated successfully');
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please sign in again before updating your banner.');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to edit this portfolio.');
      } else if (error.message === 'Authentication is required') {
        toast.error('Please sign in again before updating your banner.');
      } else {
        toast.error('Failed to update banner. Please try again.');
      }
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
      <div className="relative flex md:items-end flex-col sm:flex-row  gap-4 px-4 md:px-8 -mt-10">
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

          {/* {averageRating && (
            <div className="flex hidden md:flex items-center gap-1 text-sm text-muted-foreground">
              <StarDisplay rating={averageRating} />
              <span className="text-xs text-gray-500">
                {averageRating.toFixed(1)}
              </span>
            </div>
          )} */}
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}
