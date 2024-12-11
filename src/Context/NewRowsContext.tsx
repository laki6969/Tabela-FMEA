// Context/NewRowsContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface NewRowsContextType {
  newRows: Record<number, boolean>;
  setNewRows: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}

const NewRowsContext = createContext<NewRowsContextType | undefined>(undefined);

export const NewRowsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [newRows, setNewRows] = useState<Record<number, boolean>>({});

  return (
    <NewRowsContext.Provider value={{ newRows, setNewRows }}>
      {children}
    </NewRowsContext.Provider>
  );
};

export const useNewRowsContext = () => {
  const context = useContext(NewRowsContext);
  if (!context) {
    throw new Error('useNewRowsContext must be used within a NewRowsProvider');
  }
  return context;
};
