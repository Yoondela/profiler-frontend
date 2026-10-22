import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useUserContext } from './userContext';
import { fetchVisibility } from '../sync/SyncPortfolio';

const PortfolioContext = createContext();
const VISIBILITY_LOAD_ERROR =
  'Visibility could not be loaded. Please refresh and try again.';
const VISIBILITY_TARGET_NOT_FOUND =
  'No visibility target is available for this account.';

export const PortfolioProvider = ({ children }) => {
  const [portfolioDataCtx, setPortfolioDataCtx] = useState(null);
  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const [visibilityError, setVisibilityError] = useState(null);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [companyError, setCompanyError] = useState(null);
  const { getAccessTokenSilently } = useAuth0();
  const { appUser_ID, bootstrapStatus } = useUserContext();

  useEffect(() => {
    if (bootstrapStatus !== 'ready' || !appUser_ID) {
      setPortfolioDataCtx(null);
      setVisibilityLoading(false);
      setVisibilityError(null);
      setCompanyLoading(false);
      setCompanyError(null);
      return undefined;
    }

    let active = true;
    setPortfolioDataCtx(null);
    setVisibilityLoading(true);
    setVisibilityError(null);
    setCompanyLoading(true);
    setCompanyError(null);

    const loadCompanyIdentity = async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        });

        const [companyResult, visibilityResult] = await Promise.allSettled([
          axios.get(`${import.meta.env.VITE_API_URL}/company/${appUser_ID}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetchVisibility(token),
        ]);
        if (!active) return;

        const company =
          companyResult.status === 'fulfilled'
            ? companyResult.value.data?.company
            : null;
        const nextCompanyError =
          companyResult.status === 'rejected' &&
          companyResult.reason?.response?.status !== 404
            ? 'Company information could not be loaded. Please refresh and try again.'
            : null;
        let visibility = null;
        let nextVisibilityError = null;

        if (
          companyResult.status === 'rejected' &&
          companyResult.reason?.response?.status !== 404
        ) {
          console.error(
            'Failed to load company identity',
            companyResult.reason
          );
        }

        if (visibilityResult.status === 'fulfilled') {
          const loadedVisibility = visibilityResult.value?.visibility;
          const hiddenUntil = loadedVisibility?.hiddenUntil;
          const validVisibility =
            loadedVisibility &&
            typeof loadedVisibility === 'object' &&
            !Array.isArray(loadedVisibility) &&
            Object.prototype.hasOwnProperty.call(
              loadedVisibility,
              'hiddenUntil'
            ) &&
            (hiddenUntil === null ||
              (typeof hiddenUntil === 'string' &&
                Number.isFinite(Date.parse(hiddenUntil))));

          if (validVisibility) {
            visibility = loadedVisibility;
          } else {
            nextVisibilityError = VISIBILITY_LOAD_ERROR;
          }
        } else if (visibilityResult.reason?.response?.status === 404) {
          nextVisibilityError = VISIBILITY_TARGET_NOT_FOUND;
        } else {
          console.error('Failed to load visibility', visibilityResult.reason);
          nextVisibilityError = VISIBILITY_LOAD_ERROR;
        }

        setPortfolioDataCtx(
          company
            ? {
                company: { _id: company._id, name: company.name },
                portfolio: {
                  type: 'company',
                  id: company._id,
                  workingHours: company.workingHours,
                },
                visibility,
              }
            : { company: null, portfolio: null, visibility }
        );
        setVisibilityError(nextVisibilityError);
        setVisibilityLoading(false);
        setCompanyError(nextCompanyError);
        setCompanyLoading(false);
      } catch (error) {
        if (!active) return;
        console.error('Failed to load company identity', error);
        setVisibilityError(VISIBILITY_LOAD_ERROR);
        setVisibilityLoading(false);
        setCompanyError(
          'Company information could not be loaded. Please refresh and try again.'
        );
        setCompanyLoading(false);
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
        visibilityLoading,
        visibilityError,
        companyLoading,
        companyError,
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
