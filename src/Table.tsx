import React, { useEffect, useState } from 'react';
import { useToolContext, TextSegment } from './Context/ToolContext'; // Ensure correct import
import TableCell from './TableCell';
import Filters from './components/Filters/Filters'; // Import Filters component
import { HardcodedTexts } from './Header'; // Adjust path if necessary
import DeleteRow from './DeleteRow'; // Dodaj ovaj import na vrh
import DataFetcher from './DataFetcher'; // Import DataFetcher
import DataUpdater from './DataUpdater'; // Make sure to import your new component
import TableHeader from './TableHeader'; // Import the new component
import { useRowIdsContext } from './Context/RowIdsContext'; // Dodaj ovaj import
import { useColumnContext } from './Context/ColumnContext'; // Uvezi useColumnContext
import './Table.css';
import { useRefreshContext } from './Context/RefreshContext';
import { useNewRowsContext } from './Context/NewRowsContext'; // Import the context
import { useFmeaidContext } from './Context/FmeaidContext';
import InfiniteScroll from 'react-infinite-scroll-component';
import { usePaginationContext } from './Context/PaginationContext';
//import { useParams } from 'react-router-dom';

interface TableProps {
  columns: number;
  refresh: number;
  onAddRow: () => void; // Dodaj tačan tip funkcije
  addRowSignal: number; // Dodaj `addRowSignal` ovde
}

const Table: React.FC<TableProps> = ({ columns, refresh, addRowSignal}) => {
  //const { id } = useParams<{ id: string }>(); // Izvuci `id` iz URL-a
  const { activeCell,setActiveCell,cellContent,setCellContent,isBoldActive,isItalicActive,isUnderlineActive,activeFontColor,activeBackgroundColor,activeTextAlign,isCellBold,isCellItalic,isCellUnderline,getCellFontColor,getCellBackgroundColor,setToolbarBold,setToolbarItalic,setToolbarUnderline,setToolbarAlignLeft,setToolbarAlignRight,setToolbarAlignCenter,setToolbarAlignJustify,setToolbarFontColor } = useToolContext();
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState<number | null>(null);
  const [rowIds, setRowIds] = useState<Map<number, number>>(new Map()); // Mapa koja će čuvati ID za svaki red
  const { setColumns } = useRowIdsContext();  // Preuzmi setColumns iz konteksta
  const { colIndex, setIsSelected } = useColumnContext(); // Pristupi kontekstu
  const {setLocalRefresh, rowCount, setRowCount}= useRefreshContext();
  const {setNewRows } = useNewRowsContext(); // Use the newRows context
  const { setFmeaid } = useFmeaidContext();
  const { totalRows, setCurrentPage, pageSize, setTotalRows} = usePaginationContext();
  const fmeaid = 1;

  const handleNext = () => {
    setCurrentPage((prevPage) => prevPage + 1); // Prelazak na sledeću stranicu
  };
  
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
  
    // Pomeraj skrola za malo na vrhu
    if (target.scrollTop === 0) {
      console.log('Vratili ste se na vrh!');
    }
  
    // Pomeraj skrola za malo na dnu
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      console.log('Skrolovao/la si do kraja!');
      target.scrollTo({
        behavior: 'smooth', // Glatko skrolovanje
      });
    }
  };
  
  useEffect(() => {
    setFmeaid(fmeaid); // Set fmeaid in the context
  }, [fmeaid, setFmeaid]);

  useEffect(() => {
    if (activeCell) {
      const { row, col } = activeCell;
      console.log('Active cell changed:', activeCell);
      const key = `${row}-${col}`;
      const content = cellContent.get(key) as TextSegment[];
      console.log('Content of the active cell:', content);
      if (content) {
        setToolbarBold(content.some(segment => segment.isBold));
        setToolbarItalic(content.some(segment => segment.isItalic));
        setToolbarUnderline(content.some(segment => segment.isUnderline));
        setToolbarAlignLeft(content.some(segment => segment.textAlign === 'left'));
        setToolbarAlignRight(content.some(segment => segment.textAlign === 'right'));
        setToolbarAlignCenter(content.some(segment => segment.textAlign === 'center'));
        setToolbarAlignJustify(content.some(segment => segment.textAlign === 'justify'));
        setToolbarFontColor(content[0]?.fontColor || ''); // Ažurira samo boju fonta
      } else {
        setToolbarAlignLeft(true);
        //setToolbarFontColor(activeFontColor);
      }
    }
  }, [activeCell,cellContent,setToolbarBold,setToolbarItalic,setToolbarUnderline,setToolbarAlignLeft,setToolbarAlignRight,setToolbarAlignCenter,setToolbarAlignJustify,setToolbarFontColor,activeFontColor
  ]);

  if (!fmeaid) {
    console.error("ID nije dostupan u URL-u");
    return null;
  }

  useEffect(() => {
    setColumns(columns);  // Postavi vrednost `columns` u kontekst
  }, [columns, setColumns]);
  
  const handleFilterClick = (colIndex: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Sprečava širenje događaja klika
    // Uvek selektuje kolonu kada se klikne na ikonicu filtera
    setSelectedColumn(colIndex);
    // Prikazuje ili skriva filtere, ali ne utiče na selekciju kolone
    setShowFilters(colIndex === showFilters ? null : colIndex);
  };

  const applyStyleToSelectedColumn = (styleUpdater: (segment: TextSegment) => TextSegment) => {
  if (selectedColumn !== null) {
    const newCellContent = new Map(cellContent); // Napravi kopiju mape
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const key = `${rowIndex}-${selectedColumn}`;
      const content = cellContent.get(key) as TextSegment[] || [];
      
      if (content.length > 0) {
        // Proveri da li je stil već primenjen pre nego što ga ažuriraš
        const updatedContent = content.map(segment => styleUpdater(segment));

        // Ažuriraj sadržaj ćelije u kopiranoj mapi
        newCellContent.set(key, updatedContent);
      }
    }
  }
};

useEffect(() => {
  if (selectedColumn !== null) {
    // Funkcija koja ažurira sve stilove za izabranu kolonu
    const styleUpdater = (segment: TextSegment) => ({
      ...segment,
      isBold: isBoldActive || segment.isBold, // Ažurira bold stil
      isItalic: isItalicActive || segment.isItalic, // Ažurira italic stil
      isUnderline: isUnderlineActive || segment.isUnderline, // Ažurira underline stil
      fontColor: activeFontColor || segment.fontColor, // Ažurira boju fonta
      backgroundColor: activeBackgroundColor || segment.backgroundColor, // Ažurira boju pozadine
      textAlign: activeTextAlign || segment.textAlign, // Ažurira poravnanje teksta
    });

    applyStyleToSelectedColumn(styleUpdater); // Primeni stilove na izabranu kolonu
  }
}, [isBoldActive, isItalicActive, isUnderlineActive, activeFontColor, activeBackgroundColor, activeTextAlign, selectedColumn,rowCount, cellContent, 
]);

  const handleFiltersClose = () => {
    setShowFilters(null); // Handle closing of filters
  };

  const createEmptyRow = (rowIndex: number, columns: number): Record<string, TextSegment[]> => {
    const newRow: Record<string, TextSegment[]> = {};
    for (let colIndex = 0; colIndex < columns; colIndex++) {
        const key = `${rowIndex}-${colIndex}`;
        newRow[key] = [
            {
                text: '',  // Inicijalni prazan tekst
                isBold: false,
                isItalic: false,
                isUnderline: false,
                fontColor: '',
                backgroundColor: '',
                textAlign: 'left',
            },
        ];
    }
    return newRow;
};

const handleAddNewRow = () => {
  const lastPage = Math.ceil((totalRows + 1) / pageSize);
  setCurrentPage(lastPage);
  setRowIds(new Map());
  setTimeout(() => {
    const newRowIndex = totalRows + 1; // Novi red ima indeks za jedan veći od ukupnog broja redova
    const newRowContent = createEmptyRow(newRowIndex, columns);
    Object.entries(newRowContent).forEach(([key, value]) => {
      const [rowIndex, colIndex] = key.split('-').map(Number);
      setCellContent(rowIndex, colIndex, value); // Ažuriraj cellContent sa novim vrednostima
    });

    setRowIds((prev) => new Map(prev).set(newRowIndex, newRowIndex)); // Dodaj novi red u `rowIds`
    setNewRows((prev) => ({ ...prev, [newRowIndex]: true }));
    setTotalRows(totalRows + 1);
    setRowCount((prevCount) => prevCount + 1);
    setActiveCell({ row: newRowIndex, col: 0 });
    console.log(`Dodavanje novog reda na indeksu ${newRowIndex}`);
  }, 1500); // Daj vremena za učitavanje poslednje stranice
};

const handleColumnHeaderClick = (colIndex: number) => {
  if (colIndex === colIndex) {
    //setColIndex(null); // Deselect column if clicked again
    setIsSelected(false); // Deselect column
  } else {
    //setColIndex(colIndex); // Postavi novi izabrani `colIndex`
    setIsSelected(true); // Set column as selected
  }
  setShowFilters(null); // Zatvori filtere
};

useEffect(() => {
  if (addRowSignal > 0) {
    handleAddNewRow(); // Dodaj novi red samo kada se klikne na dugme "Dodaj"
  }
}, [addRowSignal]); // Aktivira se samo kada signal za dodavanje poraste

return (
  <div
    className="table-container"
    id="scrollableDiv" // ID za povezivanje sa InfiniteScroll
    style={{ position: 'relative', overflow: 'auto', height: '80vh' }} // Scrollable container
    onScroll={handleScroll} // Dodavanje funkcije za detekciju skrola
  >
    <DataFetcher columns={columns} setRowIds={setRowIds} refresh={refresh} />
    <InfiniteScroll
      dataLength={rowCount} // Dužina trenutnih podataka
      next={handleNext}
      hasMore={true} // Testno omogućava beskonačno skrolovanje
      loader={<h4></h4>} // Poruka za učitavanje
      scrollableTarget="scrollableDiv" // Scrollable div kao target
      scrollThreshold={0.95} // Kada korisnik dođe na 90% liste, kreće učitavanje
    >
      <table className="excel-table" style={{position: "relative"}}>
        <thead>
          <TableHeader
            columns={columns}
            selectedColumn={colIndex}
            handleColumnHeaderClick={handleColumnHeaderClick}
          />
          <tr className="filter-row">
            <th></th>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="filter-cell" >
                <div className="header-content" >
                  <span>{HardcodedTexts[i]}</span>
                  <button
                    className="filter-icon"
                    onClick={(event) => handleFilterClick(i, event)}
                  >
                    <i className="fa fa-filter" aria-hidden="true"></i>
                  </button>
                </div>
                {showFilters === i && (
                  <Filters
                    onClose={handleFiltersClose}
                    selectedColumn={selectedColumn}
                    rows={rowCount}
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
  {Array.from(rowIds.keys()).map((rowIndex) => {
    const firstCellKey = `${rowIndex}-0`; // Ključ za prvu kolonu u redu
    const firstCellContent = cellContent.get(firstCellKey); // Proveravamo da li ima podataka

    if (!firstCellContent) return null; // Ako nema podataka, ne prikazuj red

    return (
      <tr key={rowIndex}>
        <td style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span>{rowIds.get(rowIndex)}</span> {/* Prikaz rednog broja iz mape rowIds */}
          <DeleteRow
            rowIndex={rowIndex}
            rowIds={rowIds}
            onDeleteSuccess={() => setLocalRefresh((prev) => prev + 1)}
          />
        </td>
        {Array.from({ length: columns }).map((_, colIndex) => {
          const key = `${rowIndex}-${colIndex}`;
          const content =
            cellContent.get(key) || [
              {
                text: '',
                isBold: isCellBold(rowIndex, colIndex) || false,
                isItalic: isCellItalic(rowIndex, colIndex) || false,
                isUnderline: isCellUnderline(rowIndex, colIndex) || false,
                fontColor:
                  getCellFontColor(rowIndex, colIndex) || activeFontColor || '',
                backgroundColor:
                  getCellBackgroundColor(rowIndex, colIndex) ||
                  activeBackgroundColor ||
                  '',
                textAlign:
                  (activeTextAlign as 'left' | 'center' | 'right' | 'justify') ||
                  'left',
              },
            ];

          return (
            <TableCell
              row={rowIndex}
              content={content}
              key={colIndex}
              col={colIndex}
            />
          );
        })}
        <DataUpdater rowIndex={rowIndex} />
      </tr>
    );
  })}
</tbody>
      </table>
    </InfiniteScroll>
  </div>
);
}
export default Table;
