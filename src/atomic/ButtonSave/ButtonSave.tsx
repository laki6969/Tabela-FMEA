import React from 'react';
import './ButtonSave.css'; // Importuj CSS za stilove
import { useNavigate } from 'react-router-dom';
import { TextSegment, useToolContext } from '../../Context/ToolContext';
import { insertFmeaInfo } from '../../requests/tabledata';
import { useRowIdsContext } from '../../Context/RowIdsContext';

interface ButtonSaveProps {
  disabled?: boolean;
}

const ButtonSave: React.FC<ButtonSaveProps> = ({ disabled = false }) => {
  const navigate = useNavigate();
  const { cellContent, activeCell } = useToolContext();
  const { columns } = useRowIdsContext();
  const row = activeCell ? activeCell.row : null;

  const sendCellData = async () => {
    if (row === null) {
      console.error("Greška: Nije izabrana ćelija za slanje podataka.");
      return;
    }
  
    try {
      const rowData: string[] = [];
      for (let i = 0; i < columns; i++) {
        const key = `${row}-${i}`;
        const cellSegments = cellContent.get(key) as TextSegment[];
        rowData.push(cellSegments ? cellSegments.map(segment => segment.text).join('') : '');
      }
  
      console.log("Prikupljeni podaci iz ćelija (rowData):", rowData);
  
      // Ekstrakcija vrednosti
      const type = rowData[17] || ''; // Type iz action_plans
      const mainS = isNaN(parseFloat(rowData[10])) ? 1 : parseFloat(rowData[10]);
      const mainO = isNaN(parseFloat(rowData[11])) ? 0 : parseFloat(rowData[11]);
      const mainD = isNaN(parseFloat(rowData[12])) ? 0 : parseFloat(rowData[12]);
  
      const actionS = isNaN(parseFloat(rowData[25])) ? 0 : parseFloat(rowData[25]);
      const actionO = isNaN(parseFloat(rowData[26])) ? 0 : parseFloat(rowData[26]);
      const actionD = isNaN(parseFloat(rowData[27])) ? 0 : parseFloat(rowData[27]);
  
      // Logovi za dijagnostiku
      console.log("Type:", type);
      console.log("mainS:", mainS, "mainD:", mainD, "actionS:", actionS, "actionD:", actionD);
  
      // Provera uslova za type 'p'
      if (type === 'p' && (mainS !== actionS || mainD !== actionD)) {
        alert("Greška: Ako je type 'p', vrednosti S i S moraju biti iste, kao i D i D!");
        console.error("Validacija nije prošla: S i S ili D i D nisu jednaki.");
        return;
      }
  
      // Provera uslova za type 'd'
      if (type === 'd' && (mainS !== actionS || mainO !== actionO)) {
        alert("Greška: Ako je type 'd', vrednosti S i S moraju biti iste, kao i O i O!");
        console.error("Validacija nije prošla: S i S ili O i O nisu jednaki.");
        return;
      }
  
      const createdFmeaInfo = {
        fmea_id: 1, // Hardkodovan fmea_id kao broj 1
        processItem: rowData[0] || '',
        processStep: rowData[1] || '',
        resource_type: rowData[2] || '',
        resource_id: rowData[3] || '',
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
        S: mainS,
        O: mainO,
        D: mainD,
        AP: rowData[13] || '',
        classification_id: rowData[14] || '',
        riskMeasurement: rowData[15]
          ? [{ type: rowData[15], description: rowData[16] || '' }]
          : [],
        action_plans: rowData[17]
          ? [{
              type,
              action: rowData[18] || '',
              inCharge: rowData[19] || '',
              verifier: rowData[20] || '',
              startDate: rowData[21] || null,
              endDate: rowData[22] || null,
              completed_date: rowData[23] || '',
              costOfAction: rowData[24] || '',
              S: actionS,
              O: actionO,
              D: actionD,
            }]
          : [],
        comment: rowData[28] || '',
      };
  
      console.log("Kreirani podaci (createdFmeaInfo):", createdFmeaInfo);
  
      console.log('Slanje podataka za FMEA:', createdFmeaInfo);
      const response = await insertFmeaInfo(navigate, createdFmeaInfo);
      console.log("Odgovor backend-a:", response);
      alert("Podaci su uspešno poslati.");      
  
    } catch (error) {
      console.error(`Greška pri ažuriranju podataka za red ${row}:`, error);
    }
  };  
  

  return (
    <button className="button-save" onClick={sendCellData} disabled={disabled}>
      <i className="fa fa-floppy-o" aria-hidden="true"></i> Sačuvaj
    </button>
  );
};

export default ButtonSave;
