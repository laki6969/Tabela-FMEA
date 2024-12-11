import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definiši tip za context 
interface UpdateContextType {
    updateDataBase: { rowIndex: number | null };
    setUpdateDataBase: React.Dispatch<React.SetStateAction<{ rowIndex: number | null }>>;
  }
  
  // Kreiraj context sa podrazumevanom vrednošću
  const UpdateContext = createContext<UpdateContextType | undefined>(undefined);
  
  // Provider komponenta
  export const UpdateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [updateDataBase, setUpdateDataBase] = useState<{ rowIndex: number | null }>({ rowIndex: null });
  
    return (
      <UpdateContext.Provider value={{ updateDataBase, setUpdateDataBase }}>
        {children}
      </UpdateContext.Provider>
    );
  };
  
  // Hook za korišćenje context-a
  export const useUpdateContext = (): UpdateContextType => {
    const context = useContext(UpdateContext);
    if (!context) {
      throw new Error('useUpdateContext mora biti korišćen unutar UpdateProvider-a');
    }
    return context;
  };
