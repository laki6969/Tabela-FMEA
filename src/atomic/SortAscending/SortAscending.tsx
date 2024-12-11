import React from 'react';

interface SortAscendingProps {
  isActive: boolean;
  onSort: () => void;
}

const SortAscending: React.FC<SortAscendingProps> = ({ isActive, onSort }) => {
  return (
    <div className={`filter-option ${isActive ? 'active' : ''}`} onClick={onSort}>
      <i className="fas fa-sort-alpha-down"></i> Sort A to Z
    </div>
  );
};

export default SortAscending;
