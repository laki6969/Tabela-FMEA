import React, { useState, useEffect } from 'react';
import './Loader.css'; // Importujemo CSS za stilove

interface LoaderProps {
  delay?: number; // Broj sekundi za kašnjenje (podrazumevano 0)
}

const Loader: React.FC<LoaderProps> = ({ delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(delay === 0); // Prikaz loader-a odmah ako je delay 0

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setIsVisible(true); // Prikazuje loader nakon kašnjenja
      }, delay * 1000); // Konvertujemo sekunde u milisekunde

      return () => clearTimeout(timer); // Čistimo timeout pri demontaži komponente
    }
  }, [delay]);

  if (!isVisible) {
    return null; // Ne prikazujemo ništa dok delay ne istekne
  }

  return (
    <div className="loader-backdrop">
      <div className="loader-spinner"></div>
    </div>
  );
};

export default Loader;
