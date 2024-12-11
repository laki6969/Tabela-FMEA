import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RowIdsContextType { 
  rowIds: Map<number, number>;
  setRowIds: React.Dispatch<React.SetStateAction<Map<number, number>>>;
  row: number | null;
  setRow: React.Dispatch<React.SetStateAction<number | null>>;
  columns: number;
  setColumns: React.Dispatch<React.SetStateAction<number>>;
  rowIndex: number | null;
  setRowIndex: React.Dispatch<React.SetStateAction<number | null>>;
  triggerSave: number;  // Dodaj triggerSave
  setTriggerSave: React.Dispatch<React.SetStateAction<number>>;  // Setter za triggerSave
}

const RowIdsContext = createContext<RowIdsContextType | undefined>(undefined);

export const useRowIdsContext = () => {
  const context = useContext(RowIdsContext);
  if (!context) {
    throw new Error('useRowIdsContext mora biti korišćen unutar RowIdsProvider-a');
  }

  return context;
};

interface RowIdsProviderProps {
  children: ReactNode;
}

export const RowIdsProvider: React.FC<RowIdsProviderProps> = ({ children }) => {
  const [rowIds, setRowIds] = useState<Map<number, number>>(new Map());
  const [row, setRow] = useState<number | null>(null);
  const [columns, setColumns] = useState<number>(0);
  const [rowIndex, setRowIndex] = useState<number | null>(null);
  const [triggerSave, setTriggerSave] = useState<number>(0);  // Dodaj stanje za triggerSave

  return (
    <RowIdsContext.Provider value={{ rowIds, setRowIds, row, setRow, columns, setColumns, rowIndex, setRowIndex, triggerSave, setTriggerSave }}>
      {children}
    </RowIdsContext.Provider>
  );
};
