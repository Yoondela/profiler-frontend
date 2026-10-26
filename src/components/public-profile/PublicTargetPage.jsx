import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchPublicTargetAvailability,
  fetchPublicTargetPage,
} from '@/api/lookup/publicPageApi';
import { useApiClient } from '@/api/useApiClient';
import { PageLoadingSpinner } from '../loader/page-loader';
import { Reviews } from './Reviews';
import PortfolioDetailsContainer from './PublicPortfolio';
import PublicProfile from './PublicProfile';
import PortfolioHeader from './PortfolioHeader';
import GetServicePanel from './GetServicePanel';

const toPublicPageViewModel = ({ target, page, viewer }) => ({
  user: { name: page.displayName, displayName: page.displayName },
  profile: {
    avatarUrl: page.avatarUrl,
    bio: page.about,
  },
  portfolio: {
    servicesOffered: page.services,
  },
  provider: {
    _id: target.id,
    id: target.id,
    name: page.displayName,
    isLiked: viewer.isLiked,
    isBookmarked: viewer.isBookmarked,
    servicesOffered: page.services,
    otherSkills: page.otherSkills,
    logoUrl: page.logoUrl,
    bannerUrl: page.bannerUrl,
    workingHours: page.workingHours,
    galleryPhotos: page.gallery,
    reviews: page.reviews,
    address: page.address,
    about: page.about,
    rating: page.rating,
    completedJobs: page.completedJobs,
    becameProviderAt: page.becameProviderAt,
  },
  ...(page.type === 'company' && {
    company: { name: page.displayName, members: page.members },
  }),
});

export default function PublicTargetPage() {
  const api = useApiClient();
  const { publicSlug } = useParams();
  const [publicTarget, setPublicTarget] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [availabilityError, setAvailabilityError] = useState(null);
  const [error, setError] = useState(null);
  const [openBookPanel, setOpenBookPanel] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    const loadPublicTarget = async () => {
      setPublicTarget(null);
      setAvailability(null);
      setAvailabilityError(null);
      setError(null);

      try {
        const data = await fetchPublicTargetPage(api, publicSlug);
        if (isCurrent) setPublicTarget(data);

        if (data.visibility?.state === 'hiddenByOwner') return;

        try {
          const availabilityData = await fetchPublicTargetAvailability(
            api,
            publicSlug
          );
          if (isCurrent) setAvailability(availabilityData.availability);
        } catch (availabilityRequestError) {
          console.error(
            'Public target availability error:',
            availabilityRequestError
          );
          if (isCurrent)
            setAvailabilityError('Availability is currently unavailable.');
        }
      } catch (requestError) {
        if (isCurrent) setError(requestError);
      }
    };

    loadPublicTarget();
    return () => {
      isCurrent = false;
    };
  }, [api, publicSlug]);

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6">
        <section className="mx-auto mt-20 max-w-lg rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">
            Public page unavailable
          </h1>
          <p className="mt-2 text-slate-600">
            This public page could not be loaded.
          </p>
        </section>
      </main>
    );
  }

  if (!publicTarget) return <PageLoadingSpinner />;

  if (publicTarget.visibility?.state === 'hiddenByOwner') {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6">
        <section className="mx-auto mt-20 max-w-lg rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">
            This provider is currently hidden
          </h1>
          <p className="mt-2 text-slate-600">
            The owner has temporarily hidden this provider from the public page.
          </p>
        </section>
      </main>
    );
  }

  const providerData = toPublicPageViewModel(publicTarget);
  const { target, page } = publicTarget;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 py-6 px-4">
      <PortfolioHeader provider={providerData} availability={availability} />
      {availabilityError && (
        <p className="px-6 pt-2 text-sm text-slate-600">{availabilityError}</p>
      )}
      <div className="flex items-start w-full">
        <div className="w-3/4 space-x-6 p-6">
          <div className="left-side">
            {openBookPanel ? (
              <GetServicePanel
                providerId={target.id}
                providerName={page.displayName}
              />
            ) : (
              <div>
                <PortfolioDetailsContainer
                  data={providerData}
                  availability={availability}
                />
                <Reviews
                  providerId={target.id}
                  providerName={page.displayName}
                  reviews={page.reviews}
                />
              </div>
            )}
          </div>
        </div>

        <div className="w-1/4 border-s border-gray-200 p-6 sticky top-10">
          <PublicProfile
            onBookService={setOpenBookPanel}
            provider={providerData}
          />
        </div>
      </div>
    </div>
  );
}
