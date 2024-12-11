// In Context/TypeValueContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TypeValueContextType {
  typeValue: string;
  setTypeValue: (value: string) => void;
}

const TypeValueContext = createContext<TypeValueContextType | undefined>(undefined);

export const TypeValueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [typeValue, setTypeValue] = useState<string>('');

  return (
    <TypeValueContext.Provider value={{ typeValue, setTypeValue }}>
      {children}
    </TypeValueContext.Provider>
  );
};

export const useTypeValueContext = () => {
  const context = useContext(TypeValueContext);
  if (!context) {
    throw new Error("useTypeValueContext must be used within a TypeValueProvider");
  }
  return context;
};
