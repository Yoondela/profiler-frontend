import { Children, createContext, useContext, useState } from 'react';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [portfolioDataCtx, setPortfolioDataCtx] = useState(null);

  console.log('Portfolio Context Data:', portfolioDataCtx);

  function hasCompany() {
    console.log('This is portfolioDataCtx in hasCompany:', portfolioDataCtx);
    return Boolean(portfolioDataCtx?.company);
  }

  const companyId = hasCompany() ? portfolioDataCtx.company._id : null;

  console.log('Company ID in Portfolio Context:', companyId);

  return (
    <PortfolioContext.Provider
      value={{
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
