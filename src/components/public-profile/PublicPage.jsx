'use client';

import { useParams } from 'react-router-dom';
import { fetchPublicPage } from '@/api/lookup/publicPageApi';
import { useEffect, useState } from 'react';
import { PageLoadingSpinner } from '../loader/page-loader';
import { Reviews } from './Reviews';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

import PortfolioDetailsContainer from './PublicPortfolio';
import PublicProfile from './PublicProfile';
import PortfolioHeader from './PortfolioHeader';

export default function ProviderPublicPage() {
  const { id } = useParams();
  const [providerData, setProviderData] = useState(null);

  console.log('This is the object', providerData);

  useEffect(() => {
    async function loadData() {
      const data = await fetchPublicPage(id);
      console.log('SETTING object with', data);

      setProviderData(data);
    }
    loadData();
  }, [id]);

  if (!providerData) {
    return <PageLoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 py-6 px-4">
      <PortfolioHeader provider={providerData} />
      <div className="flex items-start w-full">
        <div className="w-3/4 space-x-6 p-6">
          <div className="">
            <PortfolioDetailsContainer data={providerData} />
            <Reviews
              providerId={
                providerData?.provider?._id || providerData?.provider?.id || id
              }
              providerName={providerData?.provider?.name || 'this provider'}
            />
          </div>
        </div>

        {/* <ResizableHandle withHandle className="bg-gray-400 w-px" /> */}

        <div className="w-1/4 border-s border-gray-200 p-6 sticky top-10">
          <div>
            <PublicProfile provider={providerData} className=" px-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
