import { createContext, useContext, useState } from 'react';

const SearchContext = createContext(null);

export const SearchContextProvider = ({ children }) => {
  const [searchField, setSearchField] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredProviderId, setHoveredProviderId] = useState(null);

  const value = {
    searchField,
    setSearchField,

    results,
    setResults,

    page,
    setPage,

    totalPages,
    setTotalPages,

    isLoading,
    setIsLoading,

    error,
    setError,

    hoveredProviderId,
    setHoveredProviderId,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error(
      'useSearchContext must be used inside <SearchContextProvider>'
    );
  }

  return context;
};
