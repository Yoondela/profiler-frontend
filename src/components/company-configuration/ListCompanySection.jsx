import { useState } from 'react';
import { LayersPlus } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import toast from 'react-hot-toast';

import BecomeCompanyDialog from './BecomeCompanyDialog';
import { getUserID } from '@/api/sync/SyncUser';
import { usePortfolioContext } from '@/api/context/portfolioContext';

export default function ListCompanySection() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { listingSuccessful, setListingSuccessful } = useState(false);

  const { hasCompany } = usePortfolioContext();

  const isCompany = hasCompany();

  console.log('isCompany:', isCompany);

  function handleToggle() {
    if (!isCompany) {
      // user is trying to enable company mode
      setShowModal(true);
      return;
    }

    // user is turning it off
    // setIsCompany(false);
  }

  const handleUpgrade = async (payload) => {
    console.log('Listing as company');
    console.log(payload);
    try {
      setLoading(true);

      const userId = await getUserID(getAccessTokenSilently, user.email);

      const token = await getAccessTokenSilently();

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/company/create/${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      console.log('Upgrade response:', data);

      setListingSuccessful(true);
      // setIsCompany(true);

      toast.success('Successful!');
    } catch (err) {
      toast.error(err.message || 'Upgrade failed');
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  function handleConfirmCompany() {
    // setIsCompany(true);
    setShowModal(false);
  }

  function handleCancelCompany() {
    setShowModal(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold text-gray-900">Service type</h1>

      <p className="mt-1 text-sm text-gray-500">
        Control how your service appears to clients on the platform.
      </p>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <LayersPlus className="h-5 w-5 text-gray-700" />
              <p className="text-sm font-medium text-gray-900">
                List this service as a company
              </p>
            </div>

            <p className="mt-4 text-sm text-gray-500 max-w-md">
              Your service will appear as a company instead of an individual.
              Company name, branding, and team details can be shown.
            </p>
          </div>

          {/* Toggle */}
          <button
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 ${
              isCompany || listingSuccessful ? 'bg-blue-200' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                isCompany || listingSuccessful
                  ? 'translate-x-5'
                  : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
          Current status:{' '}
          <span className="font-medium text-gray-900">
            {isCompany || listingSuccessful
              ? 'Company profile'
              : 'Individual profile'}
          </span>
        </div>
      </div>

      {/* Dialog */}
      {showModal && (
        <BecomeCompanyDialog
          open={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleUpgrade}
        />
      )}
    </div>
  );
}
