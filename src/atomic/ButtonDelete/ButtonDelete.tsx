import React from 'react';
import './ButtonDelete.css'; // Importujte CSS za stilove

interface ButtonDeleteProps {
  onDelete: () => void; // Callback za brisanje
  disabled?: boolean;
  isLoading?: boolean;
}

const ButtonDelete: React.FC<ButtonDeleteProps> = ({ onDelete, disabled = false, isLoading = false }) => {
  return (
    <button className="button-delete" onClick={onDelete} disabled={disabled}>
      {isLoading ? (
        <>
          <i className="fa fa-spinner fa-spin" aria-hidden="true"></i> Brisanje...
        </>
      ) : (
        <>
          <i className="fa fa-trash" aria-hidden="true"></i>
        </>
      )}
    </button>
  );
};

export default ButtonDelete;
