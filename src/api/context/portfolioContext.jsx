import { Children, createContext, useContext, useState } from "react";

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
    const [portfolioDataCtx, setPortfolioDataCtx] = useState(null);

    return (
        <PortfolioContext.Provider
            value={{
                portfolioDataCtx,
                setPortfolioDataCtx
            }}
        >
            {children}
        </PortfolioContext.Provider>
    )
}

export const usePortfolioContext = () => {
    const context = useContext(PortfolioContext);
    if(!context) {
        throw new Error('usePortfolioContext must be used within a PortfolioContext');
    }
    return context;
}

export default PortfolioContext;
