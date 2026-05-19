import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import StaffInviteAction from './StaffInviteAction';
import { usePortfolioContext } from '@/api/context/portfolioContext';

export default function InviteStaffSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { companyId } = usePortfolioContext();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    let cancelled = false;

    const searchStaff = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/invites/${companyId}/staff/search`, {
          params: { q: query },
        });

        if (!cancelled) setResults(res.data);
      } catch (err) {
        console.error('Staff invite search failed', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    searchStaff();

    return () => {
      cancelled = true;
    };
  }, [query, companyId]);

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by staff name…"
          className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-gray-900 focus:outline-none"
        />
      </div>

      <div className="mt-4 space-y-2">
        {loading && <p className="text-sm text-gray-500">Searching…</p>}

        {!loading && results.length === 0 && query.length >= 2 && (
          <p className="text-sm text-gray-500">No staff found.</p>
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

            <StaffInviteAction
              status={user.inviteStatus}
              targetUserId={user._id}
              companyId={companyId}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
