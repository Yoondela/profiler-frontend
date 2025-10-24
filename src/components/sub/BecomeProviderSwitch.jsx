import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import toast from 'react-hot-toast';

export default function BecomeProviderButton({ userId, onSuccess }) {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [isProvider, setIsProvider] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      setMessage('');

      const token = await getAccessTokenSilently();

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userId}/upgrade-to-provider`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to upgrade');

      setIsProvider(true);
      setMessage('You are now a provider ✅');
      toast.success('Successfully upgraded to provider!');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (isProvider)
    return <p className="text-green-600 font-medium">{message}</p>;

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
    >
      {loading ? 'Processing...' : 'Become a Provider'}
    </button>
  );
}
