import React from 'react';

interface SortDescendingProps {
  isActive: boolean;
  onSort: () => void;
}

const SortDescending: React.FC<SortDescendingProps> = ({ isActive, onSort }) => {
  return (
    <div className={`filter-option ${isActive ? 'active' : ''}`} onClick={onSort}>
      <i className="fas fa-sort-alpha-up"></i> Sort Z to A
    </div>
  );
};

export default SortDescending;
