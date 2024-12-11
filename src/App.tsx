import React, { useState, useEffect } from 'react';
import Table from './Table';
import ToolBar from './components/ToolBar/ToolBar';
import ButtonRefresh from './atomic/ButtonRefresh/ButtonRefresh';
import ButtonAdd from './atomic/ButtonAdd/ButtonAdd';
import ButtonSave from './atomic/ButtonSave/ButtonSave';
import DataInsert from './DataInsert';
import './App.css';
//import { useRowIdsContext } from './Context/RowIdsContext';

const App: React.FC = () => {
    const [refresh, setRefreshCount] = useState(0);
    const [addRowSignal, setAddRowSignal] = useState(0); 
    const [newRowIndex, setNewRowIndex] = useState<number | null>(null); 
    //const [, setTriggerSave] = useState(0); 
    const [cellContent] = useState<Map<string, any>>(new Map());  
    const [newRows, setNewRows] = useState<Record<number, boolean>>({});
    //const { rowIds } = useRowIdsContext(); // Use the context's setRowIds
    //const newRowId = rowIds.size;

    const handleAddRow = () => {
        const nextRowIndex = addRowSignal + 1;
        setAddRowSignal((prev) => prev + 1);  
        setNewRowIndex(nextRowIndex);  
        setNewRows((prev) => ({ ...prev, [nextRowIndex]: true }));  
    };
    
    const handleRefresh = (count: number) => {
        setRefreshCount(count);
    };

    // const handleSave = () => {
    //     if (newRowId !== null && newRowIndex !== null && newRows[newRowIndex]) {  
    //         const newRowData = Array.from(cellContent.entries()).filter(([key]) => key.startsWith(`${newRowId}-`));
      
    //         if (newRowData.length > 0) {
    //             setTriggerSave(prev => prev + 1);  
    //         } else {
    //             console.error("Nema podataka za novi red.");
    //         }
    //     } else {
    //         console.log("Nema novog reda za čuvanje ili red nije označen kao nov");
    //     }
    // };
        
    useEffect(() => {
        if (cellContent.size > 0) {
            Array.from(cellContent.entries()).forEach(([key, value]) => {
                const [rowIndex, colIndex] = key.split('-').map(Number);
                console.log(`Red: ${rowIndex}, Kolona: ${colIndex}, Sadržaj:`, value);
            });
        } else {
            console.log("cellContent je trenutno prazan");
        }
    }, [cellContent]);
    
    return (
        <div style={{ padding: '20px' }}>
            <div className="button-container">
                <ButtonRefresh onRefresh={handleRefresh} />
                <ButtonAdd onAdd={handleAddRow} /> 
                <ButtonSave  />
            </div>
            <ToolBar />
            <Table
                columns={29}
                refresh={refresh}
                addRowSignal={addRowSignal}
                onAddRow={handleAddRow}
            />
            {newRowIndex !== null && newRows[newRowIndex] && (
                <DataInsert 
                    rowIndex={newRowIndex} 
                    columns={29} 
                    newRows={newRows}
                    setNewRows={setNewRows} 
                />
            )}
        </div>
    );
};

export default App;
