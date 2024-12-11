import React, { useState, useEffect } from 'react';
import { TextSegment } from '../../Context/ToolContext';

interface ColorFilterProps {
  columnData: TextSegment[];
  onColorSelect: (selectedColors: Set<string>) => void;
  selectedColors: Set<string>;
  filterTitle: string; // Title for the filter
}

const ColorFilter: React.FC<ColorFilterProps> = ({ columnData, onColorSelect, selectedColors, filterTitle }) => {
  const [displayColors, setDisplayColors] = useState<Set<string>>(new Set());

  useEffect(() => {
    const foundColors = new Set<string>();
    columnData.forEach(segment => {
      if (segment.backgroundColor && !foundColors.has(segment.backgroundColor)) {
        foundColors.add(segment.backgroundColor);
      }
    });
    setDisplayColors(foundColors);
  }, [columnData]);

  const toggleColorSelection = (color: string) => {
    const newSelectedColors = new Set(selectedColors);
    if (newSelectedColors.has(color)) {
      newSelectedColors.delete(color);
    } else {
      newSelectedColors.add(color);
    }
    onColorSelect(newSelectedColors);
  };

  return (
    <div className="color-filter-container">
      <div className="filter-title">{filterTitle}</div>
      {[...displayColors].map(color => (
        <div
          key={color}
          className={`color-option ${selectedColors.has(color) ? 'selected' : ''}`}
          style={{ backgroundColor: color, width: '20px', height: '20px', cursor: 'pointer', margin: '5px', border: '1px solid #ccc' }}
          onClick={() => toggleColorSelection(color)}
        >
          {selectedColors.has(color) ? '✓' : ''}
        </div>
      ))}
    </div>
  );
};

export default ColorFilter;
