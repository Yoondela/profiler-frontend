import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useUserContext } from './userContext';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [portfolioDataCtx, setPortfolioDataCtx] = useState(null);
  const { getAccessTokenSilently } = useAuth0();
  const { appUser_ID, bootstrapStatus } = useUserContext();

  useEffect(() => {
    if (bootstrapStatus !== 'ready' || !appUser_ID) {
      setPortfolioDataCtx(null);
      return undefined;
    }

    let active = true;
    const loadCompanyIdentity = async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        });
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/company/${appUser_ID}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!active) return;

        const company = response.data?.company;
        setPortfolioDataCtx(
          company
            ? {
                company: { _id: company._id, name: company.name },
                portfolio: {
                  type: 'company',
                  id: company._id,
                  workingHours: company.workingHours,
                },
              }
            : { company: null, portfolio: null }
        );
      } catch (error) {
        if (!active) return;
        if (error.response?.status === 404) {
          setPortfolioDataCtx({ company: null, portfolio: null });
          return;
        }
        console.error('Failed to load company identity', error);
      }
    };

    loadCompanyIdentity();
    return () => {
      active = false;
    };
  }, [appUser_ID, bootstrapStatus, getAccessTokenSilently]);

  console.log('Portfolio Context Data:', portfolioDataCtx);

  function hasCompany() {
    console.log('This is portfolioDataCtx in hasCompany:', portfolioDataCtx);
    return Boolean(portfolioDataCtx?.company);
  }

  function getWorkingHours() {
    return portfolioDataCtx?.portfolio?.workingHours || null;
  }

  const companyId = portfolioDataCtx?.company?._id || null;

  console.log('Company ID in Portfolio Context:', companyId);

  return (
    <PortfolioContext.Provider
      value={{
        getWorkingHours,
        portfolioDataCtx,
        setPortfolioDataCtx,
        hasCompany,
        companyId,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolioContext = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error(
      'usePortfolioContext must be used within a PortfolioContext'
    );
  }
  return context;
};

export default PortfolioContext;
