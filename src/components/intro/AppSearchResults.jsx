'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSearchContext } from './context/context';
import { searchProviders } from '@/api/lookup/searchApi';
import { fetchPublicPage } from '@/api/lookup/publicPageApi';

import SearchResultCard from './SearchResultsCard';
import SearchResultSkeleton from './SearchResultSkeleton';
import ResultsEmpty from './ResultsEmpty';
import SearchEmpty from './EmptySearch';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { Button } from '@/components/ui/button';

export default function AppSearchResults() {
  const {
    searchField,
    results,
    setResults,
    page,
    setPage,
    totalPages,
    setTotalPages,
    setIsLoading,
    setHoveredProviderId,
  } = useSearchContext();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Clear map hover when results change
  useEffect(() => {
    setHoveredProviderId(null);
  }, [results, setHoveredProviderId]);

  function pickRelevantService(provider, query) {
    const q = query.toLowerCase();
    return (
      provider.servicesOffered?.find((s) => s.toLowerCase().includes(q)) ||
      provider.servicesOffered?.[0] ||
      ''
    );
  }

  async function getPublicPage(providerId) {
    try {
      const providerInfo = await fetchPublicPage(providerId);
      if (providerInfo) {
        navigate(`/providers/${providerId}/public`);
      }
    } catch (err) {
      console.error('Public page error:', err);
    }
  }

  useEffect(() => {
    if (!searchField) {
      setResults([]);
      setTotalPages(0);
      setLoading(false);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    setLoading(true);
    setIsLoading(true);

    const delay = setTimeout(async () => {
      try {
        const res = await searchProviders(searchField, page);

        if (!cancelled) {
          setResults(res.data || []);
          setTotalPages(res.totalPages || 1);
        }
      } catch (err) {
        console.error('Search error:', err);
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setIsLoading(false);
        }
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(delay);
    };
  }, [searchField, page, setResults, setIsLoading, setTotalPages]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* Results */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-2">
        {/* Skeleton */}
        {loading && (
          <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
            {Array.from({ length: 6 }).map((_, i) => (
              <SearchResultSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && results.length === 0 && searchField && (
          <div className="h-full flex justify-center items-center">
            <ResultsEmpty />
          </div>
        )}

        {!searchField && (
          <div className="h-full flex justify-center items-center">
            <SearchEmpty />
          </div>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center p-0 my-3">
          <Pagination className="">
            <PaginationContent className="bg-gray-100 rounded-xl p-0 !m-0 list-none">
              <PaginationItem className="cursor-pointer">
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <PaginationItem className="cursor-pointer" key={pageNum}>
                    <PaginationLink
                      isActive={page === pageNum}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem className="cursor-pointer">
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={
                    page === totalPages ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
