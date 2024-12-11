import React, { createContext, useContext, useState, useEffect } from 'react';

interface PaginationContextType {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>; // Ovaj tip je ispravan
    totalRows: number;
    setTotalRows: React.Dispatch<React.SetStateAction<number>>;
    pageSize: number;
    rowCount: number;
    setRowCount: React.Dispatch<React.SetStateAction<number>>;
  }

const PaginationContext = createContext<PaginationContextType | undefined>(undefined);

export const PaginationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [rowCount, setRowCount] = useState<number>(0);
    const pageSize = 20;
  
    useEffect(() => {
      console.log(`Stranica promenjena: ${currentPage}`);
    }, [currentPage]);
  
    return (
      <PaginationContext.Provider
        value={{
          currentPage,
          setCurrentPage,
          totalRows,
          setTotalRows,
          pageSize,
          rowCount,
          setRowCount,
        }}
      >
        {children}
      </PaginationContext.Provider>
    );
  };
  
  

export const usePaginationContext = () => {
  const context = useContext(PaginationContext);
  if (!context) {
    throw new Error('usePaginationContext must be used within a PaginationProvider');
  }
  return context;
};
