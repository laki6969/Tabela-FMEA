import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ColumnContextType {
  colIndex: number | null;
  setColIndex: (index: number | null) => void;
  isSelected: boolean;
  setIsSelected: (selected: boolean) => void;
  onCellClick: () => void;
}

const ColumnContext = createContext<ColumnContextType | undefined>(undefined);

export const useColumnContext = () => {
  const context = useContext(ColumnContext);
  if (!context) {
    throw new Error('useColumnContext must be used within a ColumnProvider');
  }
  return context;
};

interface ColumnProviderProps {
  children: ReactNode;
}

export const ColumnProvider: React.FC<ColumnProviderProps> = ({ children }) => {
  const [colIndex, setColIndex] = useState<number | null>(null);
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const onCellClick = () => {
    setIsSelected(false);
  };

  return (
    <ColumnContext.Provider value={{ colIndex, setColIndex, isSelected, setIsSelected, onCellClick }}>
      {children}
    </ColumnContext.Provider>
  );
};
