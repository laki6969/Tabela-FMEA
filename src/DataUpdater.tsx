import React, { useState, useEffect } from 'react';
import { updateFmeaInfo } from './requests/tabledata';
import { TextSegment, useToolContext } from './Context/ToolContext'; // Prilagodi putanju import-a po potrebi
import { useNavigate } from 'react-router-dom';
import { useUpdateContext } from './Context/UpdateContext';
import Loader from './components/Loader/Loader'; 
import { useDataFetcherContext } from './Context/DataFetcherContext'; // Preuzimamo podatke iz konteksta
import { useRowIdsContext } from './Context/RowIdsContext';


interface DataUpdaterProps {
  rowIndex: number;
}

const DataUpdater: React.FC<DataUpdaterProps> = ({
  rowIndex,
}) => {
  const navigate = useNavigate();
  const {cellContent} = useToolContext();
  const { updateDataBase } = useUpdateContext();
  const { columns, rowIds} = useRowIdsContext(); 

  // Preuzimamo podatke iz DataFetcherContext-a
  const { actionPlanIds, actionStatuses, resourceIds, riskMeasurementsId} = useDataFetcherContext();
  
  const [isLoading, setIsLoading] = useState(false); // Lokalno stanje za loader 

  const updateCellData = async () => {
    setIsLoading(true);
    try {
      const rowData: string[] = [];
      for (let i = 0; i < columns; i++) {
        const key = `${rowIndex}-${i}`;
        const cellSegments = cellContent.get(key) as TextSegment[];
        console.log(cellSegments);
        rowData.push(cellSegments ? cellSegments.map(segment => segment.text).join('') : '');
      }
  
      const updatedFmeaInfo = {
        processItem: rowData[0] || '',
        processStep: rowData[1] || '',
        resource_type: rowData[2] || '',
        resource_name: rowData[3] || '',
        resource_id: resourceIds.get(rowIndex) || 0,
        FEYourPlant: rowData[4]?.split('\n')[0] || '',
        FEShipToPlant: rowData[4]?.split('\n')[1] || '',
        FEEndUser: rowData[4]?.split('\n')[2] || '',
        FM: rowData[5] || '',
        cause: rowData[6] || '',
        processStepFunctionYourPlant: rowData[7]?.split('\n')[0] || '',
        processStepFunctionShipToPlant: rowData[7]?.split('\n')[1] || '',
        processStepFunctionEndUser: rowData[7]?.split('\n')[2] || '',
        processStepFunction: rowData[8]?.split('\n')[0] || '',
        processCharacteristicsFunction: rowData[8]?.split('\n')[1] || '',
        processWorkElementFunction: rowData[9] || '',
        S: isNaN(parseFloat(rowData[10])) ? 1 : parseFloat(rowData[10]),
        O: isNaN(parseFloat(rowData[11])) ? 0 : parseFloat(rowData[11]),
        D: isNaN(parseFloat(rowData[12])) ? 0 : parseFloat(rowData[12]),
        AP: rowData[13] || '',
      
        // Konvertujemo classification_id u broj
        classification_id: isNaN(parseInt(rowData[14])) ? 0 : parseInt(rowData[14]),
      
        riskMeasurement: rowData[15]
          ? [{
              type: rowData[15],
              description: rowData[16] || '',
              id: riskMeasurementsId.get(rowIndex) || '',
            }]
          : [],
      
        action_plans: rowData[17]
          ? [{
              type: rowData[17] || 'N/A',
              action: rowData[18] || 'N/A',
              inCharge: rowData[19] || null, // Koristimo `null` umesto 'N/A'
              verifier: rowData[20] || null, // Koristimo `null` umesto praznog stringa
              startDate: rowData[21] || null,
              endDate: rowData[22] || null,
              completed_date: rowData[23] || null,
              costOfAction: rowData[24] || '',
              S: isNaN(parseFloat(rowData[25])) ? 0 : parseFloat(rowData[25]),
              O: isNaN(parseFloat(rowData[26])) ? 0 : parseFloat(rowData[26]),
              D: isNaN(parseFloat(rowData[27])) ? 0 : parseFloat(rowData[27]),
              status: actionStatuses.get(rowIndex) || 'N/A',
              id: actionPlanIds.get(rowIndex) || '',
            }]
          : [],
      
        comment: rowData[28] || '',
      };      
  
      const id = rowIds.get(rowIndex);
      if (typeof id === 'number' && !isNaN(id)) {
        console.log('Updating FMEA row with ID:', id, updatedFmeaInfo);
        await updateFmeaInfo(navigate, id, updatedFmeaInfo);
      }
    } catch (error) {
      console.error(`Error while updating data for row ${rowIndex}:`, error);
    } finally {
      setIsLoading(false); // Isključujemo loader kad se završi proces
    }
  };

  useEffect(() => {
    if (updateDataBase.rowIndex === rowIndex) {
      console.log(`Triggering data update for row: ${rowIndex}`);
      updateCellData();
    }
  }, [updateDataBase]);

  return (
    <>
      {isLoading && <Loader />} {/* Prikazujemo Loader kad je isLoading true */}
    </>
  );
};

export default DataUpdater;
