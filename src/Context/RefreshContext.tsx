import React, { createContext, useContext, useState } from 'react';

// Definišemo tipove konteksta
interface RefreshContextProps {
  localRefresh: number;
  setLocalRefresh: React.Dispatch<React.SetStateAction<number>>;
  rowCount: number;
  setRowCount: React.Dispatch<React.SetStateAction<number>>;
}

// Kreiramo kontekst
const RefreshContext = createContext<RefreshContextProps | undefined>(undefined);

// Provider za osiguravanje dostupnosti konteksta
export const RefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [localRefresh, setLocalRefresh] = useState<number>(0);
  const [rowCount, setRowCount] = useState<number>(0); // Dodaj rowCount u kontekst

  return (
    <RefreshContext.Provider value={{ localRefresh, setLocalRefresh, rowCount, setRowCount }}>
      {children}
    </RefreshContext.Provider>
  );
};

// Hook za korišćenje konteksta
export const useRefreshContext = () => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error('useRefreshContext must be used within a RefreshProvider');
  }
  return context;
};
