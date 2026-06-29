import { useEffect, useState } from 'react';
import axios from 'axios';
import { usePortfolioContext } from '@/api/context/portfolioContext';
import { useFlackStore } from '@/modules/chat/store/flackStore';

export default function SearchFlackUser() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { companyId } = usePortfolioContext();

  const startDM = useFlackStore((s) => s.startDM);
  const getDMChannel = useFlackStore((s) => s.getDMChannel);
  const setActiveChannel = useFlackStore((s) => s.setActiveChannel);
  const channels = useFlackStore((s) => s.channels);
  const newChannels = useFlackStore((s) => s.newChannels);
  const channelAlerts = useFlackStore((s) => s.channelAlerts);
  const userId = useFlackStore((s) => s.userId);

  useEffect(() => {
    if (!companyId || !searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/search/flack/${companyId}/staff`, {
          params: { q: searchQuery },
        });
        setSearchResults(res.data);
        console.log('Search Results', res.data);
      } catch (err) {
        console.error('Failed to search staff', err);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(timer);
  }, [companyId, searchQuery]);

  function ShowRole({ role }) {
    if (role === 'owner') {
      return (
        <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
          admin
        </span>
      );
    }

    if (role === 'admin') {
      return (
        <span className="flex items-center gap-1 text-xs font-medium text-green-600">
          admin
        </span>
      );
    }

    if (role === 'manager') {
      return (
        <span className="flex items-center gap-1 text-xs font-medium text-green-600">
          Manager
        </span>
      );
    }

    if (role === 'member') {
      return (
        <span className="text-xs font-medium text-yellow-600">member</span>
      );
    }
  }

  return (
    <div className=" p-0">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search staff members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Results */}
      <div className="space-y-2">
        {loading && <p className="text-sm text-gray-500">Searching…</p>}

        {!loading && searchQuery && searchResults.length === 0 && (
          <p className="text-sm text-gray-500">No staff members found.</p>
        )}

        {searchResults.map((person) => (
          <div
            key={person._id}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <div
              className="flex items-center gap-3"
              onClick={() => {
                const existing = getDMChannel(person.flackId);

                if (existing) {
                  setActiveChannel(existing.id);
                } else {
                  startDM(person.flackId);
                }
              }}
            >
              <img
                src={person.avatarUrl || '/avatar-placeholder.png'}
                alt={person.name}
                className="h-8 w-8 rounded-full object-cover"
              />

              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {person.name}
                </span>
                {person.email && (
                  <span className="text-xs text-gray-500">{person.email}</span>
                )}
              </div>
            </div>
            <ShowRole role={person.role} />
          </div>
        ))}
      </div>
    </div>
  );
}
