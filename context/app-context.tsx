'use client';
import { createContext, useContext } from 'react';
import { IConfig } from '@/interfaces/config.interface';

type ContextType = { config: IConfig }

const AppContext = createContext<ContextType | null>(null);

export const AppContextProvider = ({
                                     children,
                                     config,
                                   }: {
  children: React.ReactNode
  config: IConfig
}) => {
  return (
    <AppContext.Provider value={{ config }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppContextProvider');
  return ctx;
};
