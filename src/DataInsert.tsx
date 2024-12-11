
import React, { useState, useEffect } from 'react';
import { insertFmeaInfo } from './requests/tabledata';
import {useToolContext } from './Context/ToolContext';
import { useNavigate } from 'react-router-dom';
import Loader from './components/Loader/Loader'; // Importujemo Loader komponentu
import { useRowIdsContext } from './Context/RowIdsContext';
import { useDataFetcherContext } from './Context/DataFetcherContext';

interface DataInsertProps {
  rowIndex: number;
  columns: number;
  newRows: Record<number, boolean>;
  setNewRows: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}

const DataInsert: React.FC<DataInsertProps> = ({
  rowIndex,
  columns,
  newRows,
  setNewRows
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Lokalno stanje za loader
  const { rowIds, triggerSave } = useRowIdsContext(); // Use the context's setRowIds
  const {actionPlanIds, actionStatuses, resourceIds} = useDataFetcherContext();
  const {cellContent} = useToolContext();
  const newRowId = rowIds.size;

  const sendRowToBackend = async () => {
    setIsLoading(true);  // Pokrećemo globalno stanje za loader
    console.log("Počinjemo slanje reda na backend...");
    
    try {
      const rowData: string[] = [];

      // Iteriraj kroz sve kolone i prikupi podatke za svaku kolonu novog reda
      for (let i = 0; i < columns; i++) {
        const key = `${newRowId}-${i}`; // Pristupi svakoj koloni u novom redu
        console.log(`Dohvatanje sadržaja za ključ ${key}`);

        // Prikupi sve segmente iz ćelije
        const cellSegments = cellContent.get(key) || [];  
        console.log(`Segmenti ćelije (${key}):`, cellSegments);

        // Prikupi tekst iz svih segmenata u ćeliji
        const cellText = cellSegments.map(segment => segment.text).join('') || '';  
        console.log(`Tekst iz ćelije ${key}:`, cellText);

        rowData.push(cellText);  // Dodaj prikupljeni tekst u podatke novog reda
      }

      // Prikupljanje svih troškova
      const costs: { cost: string; description: string }[] = [];
      const startCostIndex = 25; // Indeks gde počinju costs (nakon action_plans koje koriste rowData[24])
      console.log(`Podaci za insert za red ${rowIndex}:`, rowData);

      for (let i = startCostIndex; i < rowData.length; i += 2) {
        const costValue = parseFloat(rowData[i]);
        const description = rowData[i + 1] || '';

        if (!isNaN(costValue) && costValue > 0) {
          costs.push({
            cost: costValue.toString(), // Pretvori broj u string ako je potrebno
            description: description
          });
        }
      }

      // Prikupljanje riskMeasurements
      const riskMeasurementsArray = rowData[15] ? [{
        name: rowData[15],
        description: rowData[16] || ''
      }] : [];
      console.log(`Risk Measurements Array:`, riskMeasurementsArray);

      // Kreiranje action_plans
      const actionPlanArray = rowData[17] ? [{
        type: rowData[17] || 'N/A',
        name: rowData[18] || 'N/A',
        inCharge: rowData[19] || 'N/A',
        verifier: rowData[20] || '',
        endDate: rowData[21] ? new Date(rowData[21]) : null,
        completed_date: rowData[22] ? new Date(rowData[22]) : null,
        costOfAction: parseFloat(rowData[24]) || 0,
        status: actionStatuses.get(rowIndex) || 'N/A',
        id: actionPlanIds.get(rowIndex) || '',
        action: rowData[17] || 'N/A'
      }] : [];
      console.log(`Action Plans Array:`, actionPlanArray);

      // Pripremi sve podatke za slanje na backend
      const newFmeaInfo = {
        processItem: rowData[0] || '',
        processStep: rowData[1] || '',
        resource_type: rowData[2] || '',
        resource_name: rowData[3] || '',
        resource_id: resourceIds.get(rowIndex) || 0,
        FEYourPlant: rowData[4]?.split('\n')[0] || 'N/A',
        FEShipToPlant: rowData[4]?.split('\n')[1] || 'N/A',
        FEEndUser: rowData[4]?.split('\n')[2] || 'N/A',
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
        sumCosts: parseFloat(rowData[14]) || 0,
        riskMeasurements: riskMeasurementsArray,
        action_plans: actionPlanArray,
        comment: rowData[23] || '',
        costs: costs
      };

      // Console log svih podataka koji se šalju
      console.log(`Pripremamo podatke za insert za red ${rowIndex}:`, newFmeaInfo);

      // Pozivaj insert funkciju sa navigacijom
      await insertFmeaInfo(navigate, newFmeaInfo);
      console.log(`Novi red uspešno dodat za red ${rowIndex}.`);

      // Postavi newRow na false nakon uspešnog slanja
      setNewRows(prev => ({ ...prev, [rowIndex]: false }));
    } catch (error) {
      console.error(`Greška pri dodavanju novog reda ${rowIndex}:`, error);
    } finally {
      setIsLoading(false); // Skidamo lokalni loader
      console.log(`Završeno slanje podataka za red ${rowIndex}`);
    }
  };

  useEffect(() => {
    if (triggerSave > 0 && newRows[rowIndex]) {  // Proveri da li je red nov
      console.log(`Slanje podataka za novi red ${rowIndex}`);
      sendRowToBackend();  // Šalji podatke na backend samo za novododati red
    }
  }, [triggerSave, newRows, rowIndex]);  // Aktivira se kada se klikne na dugme Save

  return (
    <>
      {isLoading && <Loader />} {/* Prikazujemo Loader kad je isLoading true */}
    </>
  );
};

export default DataInsert;
