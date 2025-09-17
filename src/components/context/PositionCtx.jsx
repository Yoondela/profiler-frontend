import { createContext, useContext } from 'react';

export const NavHeightCtx = createContext(0);
export const useNavHeight = () => useContext(NavHeightCtx);

export const HeaderHeightCtx = createContext(0);
export const useHeadHeightCtx = () => useContext(HeaderHeightCtx);
