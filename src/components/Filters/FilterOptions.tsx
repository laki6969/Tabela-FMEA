import React, { useEffect, useState } from 'react';
import SortAscending from '../../atomic/SortAscending/SortAscending';
import SortDescending from '../../atomic/SortDescending/SortDescending';
import CheckboxFilter from '../../atomic/CheckboxFilter/CheckboxFilter';
import ColorFilter from '../../atomic/ColorFilter/ColorFilter';
import FontColorFilter from '../../atomic/FontColorFilter/FontColorFilter';
import { TextSegment } from '../../Context/ToolContext';
import { fetchCausesForColumnValuesItem } from '../../requests/tabledata';
import { NavigateFunction } from 'react-router-dom';
import { getColumnName } from '../../utils/getColumnName'; // Prilagodite putanju
import { useColumnNameContext } from '../../Context/ColumnNameContext'; // Import konteksta

interface FilterOptionsProps {
  sortOrder: 'asc' | 'desc' | null;
  setSortOrder: (order: 'asc' | 'desc' | null) => void;
  selectedColumn: number | null;
  originalContent: Map<string, TextSegment[]>;
  savedSelectedValues: Set<string>;
  selectedBackgroundColors: Set<string>;
  selectedFontColors: Set<string>;
  handleCheckboxFilterChange: (selectedValues: Set<string>) => void;
  handleBackgroundColorFilterChange: (selectedColors: Set<string>) => void;
  handleFontColorFilterChange: (selectedColors: Set<string>) => void;
  navigate: NavigateFunction;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({
  sortOrder,
  setSortOrder,
  selectedColumn,
  savedSelectedValues,
  selectedBackgroundColors,
  selectedFontColors,
  handleCheckboxFilterChange,
  handleBackgroundColorFilterChange,
  handleFontColorFilterChange,
  navigate,
}) => {
  const [columnValues, setColumnValues] = useState<string[]>([]);
  const { setColumnName } = useColumnNameContext(); // Pristup kontekstu

  const handleSortAscending = () => {
    setSortOrder('asc');
  };

  const handleSortDescending = () => {
    setSortOrder('desc');
  };

  // Fetch podataka za izabranu kolonu
  useEffect(() => {
    const fetchColumnValues = async () => {
      if (selectedColumn !== null) {
        const columnName = getColumnName(selectedColumn); // Generiši naziv kolone
        setColumnName(columnName); // Sačuvaj u kontekstu
        try {
          const values = await fetchCausesForColumnValuesItem(navigate, columnName); // Prosledi naziv kolone API-ju
          setColumnValues(values); // Postavi dobijene vrednosti iz API-ja
        } catch (error) {
          console.error('Greška pri preuzimanju vrednosti za kolonu:', error);
        }
      }
    };

    fetchColumnValues();
  }, [selectedColumn, navigate, setColumnName]);

  return (
    <>
      <SortAscending isActive={sortOrder === 'asc'} onSort={handleSortAscending} />
      <SortDescending isActive={sortOrder === 'desc'} onSort={handleSortDescending} />
      {selectedColumn !== null && (
        <>
          <CheckboxFilter
            columnData={columnValues}
            onFilterChange={handleCheckboxFilterChange}
            selectedValues={savedSelectedValues}
          />
          <ColorFilter
            columnData={[]}
            onColorSelect={handleBackgroundColorFilterChange}
            selectedColors={selectedBackgroundColors}
            filterTitle="Filter by Background Color"
          />
          <FontColorFilter
            columnData={[]}
            onColorSelect={handleFontColorFilterChange}
            selectedColors={selectedFontColors}
            filterTitle="Filter by Font Color"
          />
        </>
      )}
    </>
  );
};

export default FilterOptions;
