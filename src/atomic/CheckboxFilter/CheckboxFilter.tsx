import React, { useState, useEffect } from 'react';
import { useColumnNameContext } from '../../Context/ColumnNameContext';

interface CheckboxFilterProps {
  columnData: string[];
  onFilterChange: (selectedValues: Set<string>) => void; // Dodaj onFilterChange
  selectedValues: Set<string>; // Dodaj selectedValues
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({ columnData }) => {
  const [uniqueValues, setUniqueValues] = useState<Set<string>>(new Set());
  const { selectedValues, setSelectedValues } = useColumnNameContext(); // Pristup kontekstu

  useEffect(() => {
    const values = new Set(columnData);
    setUniqueValues(values); // Postavljamo jedinstvene vrednosti
  }, [columnData]);

  const handleCheckboxChange = (value: string) => {
    const updatedSelectedValues = new Set(selectedValues);
    if (updatedSelectedValues.has(value)) {
      updatedSelectedValues.delete(value);
      console.log(`Odčekirana vrednost: ${value}`);
    } else {
      updatedSelectedValues.add(value);
      console.log(`Čekirana vrednost: ${value}`);
    }
    setSelectedValues(updatedSelectedValues); // Ažuriramo vrednosti u kontekstu
  };

  return (
    <div>
      {[...uniqueValues].map(value => (
        <div key={value}>
          <input
            type="checkbox"
            checked={selectedValues.has(value)}
            onChange={() => handleCheckboxChange(value)}
          />
          {value}
        </div>
      ))}
    </div>
  );
};

export default CheckboxFilter;
