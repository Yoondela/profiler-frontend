import { createContext, useContext, useState } from 'react';
import cities from '../data/za-cities.json';

const CityContext = createContext(null);

export function CityProvider({ children }) {
  const [city, setCity] = useState(cities[0]); // default

  return (
    <CityContext.Provider value={{ city, setCity, cities }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within CityProvider');
  }
  return context;
}
