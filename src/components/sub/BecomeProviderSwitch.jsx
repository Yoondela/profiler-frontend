import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import toast from 'react-hot-toast';
import { Switch } from '@headlessui/react';
import BecomeProviderDialog from './view/BecomeProviderDialog';

export default function BecomeProviderSwitch({ userId, onSuccess }) {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [isProvider, setIsProvider] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleUpgrade = async (payload) => {
    try {
      setLoading(true);

      const token = await getAccessTokenSilently();

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userId}/upgrade-to-provider`,
        {
          method: 'PATCH',
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

      setIsProvider(true);
      toast.success('You are now a provider');
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || 'Upgrade failed');
    } finally {
      setLoading(false);
      setShowDialog(false);
    }
  };

  if (isProvider) {
    return <p className="text-green-600 font-medium">Pending..</p>;
  }

  return (
    <>
      <button
        disabled={loading}
        onClick={() => setShowDialog(true)}
        className="px-4 py-2 bg-green-600 text-white rounded-md"
      >
        Become a Provider
      </button>

      <BecomeProviderDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onSubmit={handleUpgrade}
      />
    </>
  );
}
