import { useEffect, useState } from 'react';
import axios from 'axios';
import InviteAction from './InviteAction';
import { Search, UserCheck, UserPlus, Lock } from 'lucide-react';
import { usePortfolioContext } from '@/api/context/portfolioContext';
import { useAuth0 } from '@auth0/auth0-react';

export default function InviteProvidersSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { companyId } = usePortfolioContext();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    let cancelled = false;

    const searchProviders = async () => {
      setLoading(true);
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get(`/api/invites/${companyId}/search`, {
          params: { q: query },
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Search results:', res.data);

        if (!cancelled) {
          setResults(res.data);
        }
      } catch (err) {
        console.error('Invite search failed', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    searchProviders();

    return () => {
      cancelled = true;
    };
  }, [companyId, getAccessTokenSilently, query]);

  return (
    <div>
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by provider name…"
          className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-gray-900 focus:outline-none"
        />
      </div>

      {/* Results */}
      <div className="mt-4 space-y-2">
        {loading && <p className="text-sm text-gray-500">Searching…</p>}

        {!loading && results.length === 0 && query.length >= 2 && (
          <p className="text-sm text-gray-500">No providers found.</p>
        )}

        {results.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <img
                src={user.avatarUrl || '/avatar-placeholder.png'}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-gray-900">
                {user.name}
              </span>
            </div>

            <InviteAction
              status={user.inviteStatus}
              providerId={user.portfolioId}
              companyId={companyId}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
