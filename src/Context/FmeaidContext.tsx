// src/Context/FmeaidContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FmeaidContextType {
  fmeaid: number | null;
  setFmeaid: (id: number) => void;
}

const FmeaidContext = createContext<FmeaidContextType | undefined>(undefined);

export const FmeaidProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fmeaid, setFmeaid] = useState<number | null>(null);

  return (
    <FmeaidContext.Provider value={{ fmeaid, setFmeaid }}>
      {children}
    </FmeaidContext.Provider>
  );
};

export const useFmeaidContext = () => {
  const context = useContext(FmeaidContext);
  if (!context) {
    throw new Error("useFmeaidContext must be used within a FmeaidProvider");
  }
  return context;
};
