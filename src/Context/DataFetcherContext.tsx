import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DataFetcherContextProps {
  actionPlanIds: Map<number, string>;
  setActionPlanIds: React.Dispatch<React.SetStateAction<Map<number, string>>>;
  actionStatuses: Map<number, string>;
  setActionStatuses: React.Dispatch<React.SetStateAction<Map<number, string>>>;
  costDescriptions: Map<number, string>;
  setCostDescriptions: React.Dispatch<React.SetStateAction<Map<number, string>>>;
  riskMeasurements: Map<number, string>;
  setRiskMeasurements: React.Dispatch<React.SetStateAction<Map<number, string>>>;
  resourceIds: Map<number, number>; 
  setResourceIds: React.Dispatch<React.SetStateAction<Map<number, number>>>;
  riskMeasurementsId: Map<number, string>; // Dodaj riskMeasurementsId
  setRiskMeasurementsId: React.Dispatch<React.SetStateAction<Map<number, string>>>; // Dodaj setRiskMeasurementsId
}

const DataFetcherContext = createContext<DataFetcherContextProps | undefined>(undefined);

export const useDataFetcherContext = () => {
  const context = useContext(DataFetcherContext);
  if (!context) {
    throw new Error('useDataFetcherContext must be used within a DataFetcherContextProvider');
  }
  return context;
};

export const DataFetcherContextProvider = ({ children }: { children: ReactNode }) => {
  const [actionPlanIds, setActionPlanIds] = useState<Map<number, string>>(new Map());
  const [actionStatuses, setActionStatuses] = useState<Map<number, string>>(new Map());
  const [costDescriptions, setCostDescriptions] = useState<Map<number, string>>(new Map());
  const [riskMeasurements, setRiskMeasurements] = useState<Map<number, string>>(new Map());
  const [resourceIds, setResourceIds] = useState<Map<number, number>>(new Map());
  const [riskMeasurementsId, setRiskMeasurementsId] = useState<Map<number, string>>(new Map()); // Dodaj state za riskMeasurementsId

  return (
    <DataFetcherContext.Provider
      value={{
        actionPlanIds,
        setActionPlanIds,
        actionStatuses,
        setActionStatuses,
        costDescriptions,
        setCostDescriptions,
        riskMeasurements,
        setRiskMeasurements,
        resourceIds,
        setResourceIds,
        riskMeasurementsId, // Dodaj riskMeasurementsId u value
        setRiskMeasurementsId, // Dodaj setRiskMeasurementsId u value
      }}
    >
      {children}
    </DataFetcherContext.Provider>
  );
};
