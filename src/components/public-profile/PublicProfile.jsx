import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const PublicProfile = ({ provider }) => {
  return (
    <div className="flex flex-col justify-center provider-profile py-6 max-h-[600px] sticky top-10">
      <div className="flex justify-center profile-photo border border-gray-200">
        <img
          src={provider.profile.avatarUrl}
          alt={`${provider.user.name} photo`}
          className="w-62 h-62 object-contain"
        />
      </div>
      <div className="profile-details px-2">
        <p className="text-md text-gray-700 capitalize font-bold pt-4">
          {provider.user.name}
        </p>
        <p className="text-gray-600 capitalize">{provider.profile.bio}</p>
        <p className="text-gray-600 pt-3">{provider.profile.address}</p>
        <div className="profile-stats mt-4">
          <span className="mr-4">Rating: {provider.portfolio.rating} / 5</span>
          <span>Completed Jobs: {provider.portfolio.completedJobs}</span>
        </div>
      </div>
      <div className="profile-actions flex justify-center mt-6">
        <Button
          variant="primary"
          className="w-full border bg-[black] text-[white] cursor-pointer hover:bg-[var(--sidebar-primary)]"
        >
          Book
        </Button>
      </div>
    </div>
  );
};

export default PublicProfile;
