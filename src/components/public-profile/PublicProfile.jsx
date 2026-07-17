import React from 'react';
import { Button } from '@/components/ui/button';
import { usePublicPageStore } from './publicPageStore';

const PublicProfile = ({ onBookService, provider }) => {
  const selectedMember = usePublicPageStore((state) => state.selectedMember);

  console.log('selectedMember', selectedMember);

  const isCompany = !!provider.company;

  const displayUser = selectedMember || provider.user;

  const displayProfile = selectedMember?.user.profile || provider.profile;

  const displayPortfolio = selectedMember?.user.portfolio || provider.portfolio;

  const showingCompanySummary = isCompany && !selectedMember;

  const handleBookServiceClick = () => {
    if (onBookService) {
      onBookService(true);
      document
        .getElementById('get-service-panel')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-col justify-center provider-profile py-6 max-h-[600px] sticky top-10">
      {showingCompanySummary ? (
        <>
          <div className="flex justify-center profile-photo border border-gray-200">
            <img
              src={provider.provider.logoUrl}
              alt={provider.provider.name}
              className="w-62 h-62 object-contain"
            />
          </div>
          <p className="text-md font-bold pt-4">{provider.provider.name}</p>

          <p className="text-gray-600">
            {provider.company.members.length} team members
          </p>

          <p className="text-gray-600 mt-2">
            Booking is managed by this company.
          </p>

          <div className="profile-actions flex justify-center mt-6">
            <Button
              variant="primary"
              className="w-full border bg-[black] text-[white] cursor-pointer hover:bg-[var(--sidebar-primary)]"
              onClick={handleBookServiceClick}
            >
              Get service
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center profile-photo border border-gray-200">
            <img
              src={displayProfile.avatarUrl}
              alt={displayUser.displayName}
              className="w-62 h-62 object-contain"
            />
          </div>

          <p className="text-md font-bold pt-4">{displayUser.displayName}</p>

          <p className="text-gray-600">{displayProfile.bio}</p>

          <p className="text-sm text-gray-500 mt-2">
            Works at {provider.provider.name}
          </p>

          <ul className="m-0 p-0 list-none flex flex-wrap gap-1">
            {displayPortfolio?.servicesOffered.map((item, index) => (
              <li key={index} className="flex items-center">
                {index > 0 ? (
                  <span className="mr-1 text-xl" aria-hidden="true">
                    ,
                  </span>
                ) : null}
                <span>{item?.name}</span>
              </li>
            ))}
          </ul>

          <div className="profile-actions flex justify-center mt-6">
            <Button
              variant="primary"
              className="w-full border bg-[black] text-[white] cursor-pointer hover:bg-[var(--sidebar-primary)]"
              onClick={handleBookServiceClick}
            >
              Prefer
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PublicProfile;
