import { createContext, useContext, useState } from 'react';

const SearchContext = createContext({
  searchfield: '',
  setSearchfield: () => {
    throw new Error('setSearchfield called outside SearchContextProvider');
  },
});

export const SearchContextProvider = ({ children }) => {
  const [searchfield, setSearchfield] = useState('');

  return (
    <SearchContext.Provider value={{ searchfield, setSearchfield }}>
      {children}
    </SearchContext.Provider>
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
