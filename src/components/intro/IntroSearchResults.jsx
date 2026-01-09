import { useSearchContext } from './context/context';
import { useEffect } from 'react';
import { searchProviders } from '@/api/lookup/searchApi';

export default function IntroSearchResults() {
  const {
    searchField,
    results,
    setResults,
    page,
    setPage,
    totalPages,
    setTotalPages,
    isLoading,
    setIsLoading,
  } = useSearchContext();

  useEffect(() => {
    if (!searchField) {
      setResults([]);
      setTotalPages(0);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setIsLoading(true);

        const res = await searchProviders(searchField, page);

        setResults(res.data);
        setTotalPages(res.totalPages);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(delay);
  }, [searchField, page]);

  if (isLoading) return <p>Searching…</p>;

  if (!isLoading && results.length === 0 && searchField) {
    return <p>No results found.</p>;
  }

  return (
    <>
      {results.map((item) => (
        <div key={item._id}>
          <p>{item.name}</p>
        </div>
      ))}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex gap-2">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
