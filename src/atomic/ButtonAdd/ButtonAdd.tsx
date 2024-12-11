import React from 'react';
import './ButtonAdd.css'; // Importuj CSS za stilove

interface ButtonAddProps {
  onAdd: () => void; // Callback za dodavanje
  disabled?: boolean;
}

const ButtonAdd: React.FC<ButtonAddProps> = ({ onAdd, disabled = false }) => {
  return (
    <button className="button-add" onClick={onAdd} disabled={disabled}>
      <i className="fa fa-plus" aria-hidden="true"></i> Dodaj
    </button>
  );
};

export default ButtonAdd;
