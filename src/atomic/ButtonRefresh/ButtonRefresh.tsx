// src/components/atomic/ButtonRefresh/ButtonRefresh.tsx
import React, { useState, useEffect } from 'react';
import './ButtonRefresh.css'; // Importujte CSS za stilove

interface ButtonRefreshProps {
  onRefresh: (count: number) => void; // Callback za slanje refreshCount nazad
  disabled?: boolean;
  isLoading?: boolean;
}

const ButtonRefresh: React.FC<ButtonRefreshProps> = ({ onRefresh, disabled = false, isLoading = false }) => {
  const [refreshCount, setRefreshCount] = useState(0);

  const handleClick = () => {
    setRefreshCount(prevCount => prevCount + 1);
    console.log('Osveži dugme kliknuto');
  };

  useEffect(() => {
    // Svaki put kada se refreshCount promeni, obavesti App komponentu
    onRefresh(refreshCount);
  }, [refreshCount, onRefresh]);

  return (
    <button className="button-refresh" onClick={handleClick} disabled={disabled}>
      {isLoading ? (
        <>
          <i className="fa fa-spinner fa-spin" aria-hidden="true"></i> Učitavanje...
        </>
      ) : (
        <>
          <i className="fa fa-refresh" aria-hidden="true"></i> Osveži
        </>
      )}
    </button>
  );
};

export default ButtonRefresh;
