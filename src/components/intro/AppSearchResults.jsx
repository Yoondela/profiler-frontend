'use client';

import { useSearchContext } from './context/context';
import { useState, useEffect } from 'react';
import { searchProviders } from '@/api/lookup/searchApi';
import SearchResultCard from './SearchResultsCard';
import { Button } from '@/components/ui/button';

export default function AppSearchResults() {
  const { searchfield } = useSearchContext();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  function pickRelevantService(provider, query) {
    const q = query.toLowerCase();
    const match = provider.servicesOffered.find((s) =>
      s.toLowerCase().includes(q)
    );
    return match || provider.servicesOffered?.[0] || '';
  }

  useEffect(() => {
    if (!searchfield.trim()) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await searchProviders(searchfield);
        setResults(data || []);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(delay);
  }, [searchfield]);

  return (
    <div className="h-full w-full overflow-y-auto p-2">
      {loading && <p>Searching…</p>}
      {!loading && results.length === 0 && searchfield && (
        <p>No results found.</p>
      )}

      <div
        className="
        grid gap-3 
        grid-cols-[repeat(auto-fill,minmax(180px,1fr))]
      "
      >
        {!loading &&
          results.map((provider) => {
            const serviceLabel = pickRelevantService(provider, searchfield);

            return (
              <SearchResultCard
                key={provider._id}
                provider={provider}
                serviceLabel={serviceLabel}
                actions={
                  <Button variant="secondary" size="sm">
                    View
                  </Button>
                }
              />
            );
          })}
      </div>
    </div>
  );
}
