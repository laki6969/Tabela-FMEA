import React from 'react';

interface TableHeaderProps {
  columns: number;
  selectedColumn: number | null;
  handleColumnHeaderClick: (colIndex: number) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({ columns, selectedColumn, handleColumnHeaderClick }) => {
  return (
    <tr>
      <th></th>
      {Array.from({ length: columns }).map((_, i) => (
        <th
          key={i}
          className={selectedColumn === i ? 'selected-column' : ''}
          onClick={() => handleColumnHeaderClick(i)}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>{String.fromCharCode(65 + i)}</span>
          </div>
        </th>
      ))}
    </tr>
  );
};

export default TableHeader;
