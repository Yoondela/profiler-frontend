import { useEffect, useState } from 'react';
import axios from 'axios';
import { usePortfolioContext } from '@/api/context/portfolioContext';
import { useFlackStore } from '@/modules/chat/store/flackStore';
import { useUIStore } from '../store/uiStore.js';

export default function SearchFlackUser() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingDmId, setPendingDmId] = useState(null);
  const { companyId } = usePortfolioContext();

  const startDM = useFlackStore((s) => s.startDM);
  const getDMChannel = useFlackStore((s) => s.getDMChannel);
  const setActiveChannel = useFlackStore((s) => s.setActiveChannel);
  const channels = useFlackStore((s) => s.channels);
  const openConversation = useUIStore((s) => s.openConversation);

  useEffect(() => {
    if (!pendingDmId) return;

    const channel = getDMChannel(pendingDmId);
    if (!channel) return;

    setActiveChannel(channel.id);
    openConversation(channel.id);
    setPendingDmId(null);
  }, [channels, getDMChannel, openConversation, pendingDmId, setActiveChannel]);

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
          <button
            type="button"
            key={person._id}
            className="flex min-h-11 w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-left transition-colors hover:bg-gray-100"
            onClick={() => {
              const existing = getDMChannel(person.flackId);

              if (existing) {
                setActiveChannel(existing.id);
                openConversation(existing.id);
              } else {
                setPendingDmId(person.flackId);
                startDM(person.flackId);
              }
            }}
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <img
                src={person.avatarUrl || '/avatar-placeholder.png'}
                alt={person.name}
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />

              <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-gray-900">
                  {person.name}
                </span>
                {person.email && (
                  <span className="block truncate text-xs text-gray-500">
                    {person.email}
                  </span>
                )}
              </div>
            </div>
            <ShowRole role={person.role} />
          </button>
        ))}
      </div>
    </div>
  );
}
