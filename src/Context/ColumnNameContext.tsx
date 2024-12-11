import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definišemo tipove za kontekst
interface ColumnNameContextProps {
  columnName: string;
  setColumnName: (name: string) => void;
  selectedValues: Set<string>;
  setSelectedValues: (values: Set<string>) => void;
  refetch: () => void; // Funkcija za refetch
  refetchTrigger: boolean; // Boolean koji se menja
  clear: () => void; // Dodajemo funkciju za reset
}

// Kreiramo kontekst
const ColumnNameContext = createContext<ColumnNameContextProps | undefined>(undefined);

// Hook za pristup kontekstu
export const useColumnNameContext = () => {
  const context = useContext(ColumnNameContext);
  if (!context) {
    throw new Error('useColumnNameContext mora biti korišćen unutar ColumnNameProvider-a.');
  }
  return context;
};

// Provider komponenta
export const ColumnNameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [columnName, setColumnName] = useState<string>(''); // Trenutno ime kolone
  const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set()); // Selektovane vrednosti
  const [refetchTrigger, setRefetchTrigger] = useState<boolean>(false); // Boolean za osvežavanje

  // Funkcija koja menja refetchTrigger
  const refetch = () => {
    setRefetchTrigger((prev) => !prev); // Menja boolean na suprotnu vrednost
  };

  // Funkcija za resetovanje svih vrednosti u kontekstu
  const clear = () => {
    setColumnName(''); // Resetuje ime kolone
    setSelectedValues(new Set()); // Resetuje selektovane vrednosti
    setRefetchTrigger(false); // Resetuje boolean na početnu vrednost
  };

  console.log('Niz elemenata:', selectedValues);

  return (
    <ColumnNameContext.Provider
      value={{
        columnName,
        setColumnName,
        selectedValues,
        setSelectedValues,
        refetch,
        refetchTrigger,
        clear, // Prosleđujemo funkciju `clear` kao deo vrednosti konteksta
      }}
    >
      {children}
    </ColumnNameContext.Provider>
  );
};
