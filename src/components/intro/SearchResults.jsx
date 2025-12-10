import { useSearchContext } from './context/context';
import { useState, useEffect } from 'react';
import { searchProviders } from '@/api/lookup/searchApi';

export default function SearchResults() {
  const { searchfield } = useSearchContext();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce timer
  useEffect(() => {
    if (!searchfield.trim()) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await searchProviders(searchfield);
        console.log('in the component data : ', data);

        setResults(data || []);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(delay);
  }, [searchfield]);

  console.log('in the component: ', results);

  return (
    <div className="search-results mt-4">
      {loading && <p>Searching…</p>}

      {!loading && results.length === 0 && searchfield && (
        <p>No results found.</p>
      )}

      {!loading &&
        results.map((item) => (
          <div key={item._id} className="result-item">
            <p>{item.name}</p>
            <span className="label">{item.serviceType}</span>
          </div>
        ))}
    </div>
  );
}
