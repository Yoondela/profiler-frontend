'use client';

import { useSearchContext } from './context/context';
import { useState, useEffect } from 'react';
import { searchProviders } from '@/api/lookup/searchApi';
import SearchResultCard from './SearchResultsCard';
import SearchResultSkeleton from './SearchResultSkeleton';
import { fetchPublicPage } from '@/api/lookup/publicPageApi';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { set } from 'date-fns';

export default function AppSearchResults() {
  const {
    searchField,
    setResults,
    results,
    setIsLoading,
    setError,
    setHoveredProviderId,
  } = useSearchContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setHoveredProviderId(null);
  }, [results]);

  function pickRelevantService(provider, query) {
    const q = query.toLowerCase();
    const match = provider.servicesOffered.find((s) =>
      s.toLowerCase().includes(q)
    );
    return match || provider.servicesOffered?.[0] || '';
  }

  async function getPublicPage(providerId) {
    try {
      const providerInfo = await fetchPublicPage(providerId);

      if (providerInfo) {
        navigate(`/providers/${providerId}/public`);
      }

      console.log('Fetched public page:', providerInfo);
    } catch (error) {
      console.error('Error fetching public page:', error);
    }
  }

  useEffect(() => {
    if (!searchField) {
      setResults([]);
      return;
    }
  
    let cancelled = false;
  
    const delay = setTimeout(async () => {
      try {
        setIsLoading(true);
        setLoading(true);
      
          const data = await searchProviders(searchField);
      
          if (!cancelled) {
          setResults(Array.isArray(data) ? data : []);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setLoading(false);
        }
      }
    }, 350);
  
    return () => {
      cancelled = true;
      clearTimeout(delay);
    };
  }, [searchField]);


  return (
    <div className="h-full w-full overflow-y-auto p-2">
      {/* Skeleton Loader */}
      {loading && (
        <div
          className="
            grid gap-3 
            grid-cols-[repeat(auto-fill,minmax(180px,1fr))]
          "
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <SearchResultSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && results.length === 0 && searchField && (
        <p>No results found.</p>
      )}

      {/* Results Grid */}
      {!loading && (
        <div
          className="
            grid gap-3 
            grid-cols-[repeat(auto-fill,minmax(180px,1fr))]
          "
        >
          {results.map((provider) => {
            const serviceLabel = pickRelevantService(provider, searchField);

            return (
              <SearchResultCard
                key={provider._id}
                provider={provider}
                serviceLabel={serviceLabel}
                onMouseEnter={() => setHoveredProviderId(provider._id)}
                onMouseLeave={() => setHoveredProviderId(null)}
                onClick={() => getPublicPage(provider._id)}
                actions={
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => getPublicPage(provider._id)}
                  >
                    View
                  </Button>
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
