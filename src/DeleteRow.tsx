import React, { useState } from 'react';
import { deleteFmeaInfo } from './requests/tabledata'; // Importuj funkciju za brisanje
import { useNavigate } from 'react-router-dom';
import ButtonDelete from './atomic/ButtonDelete/ButtonDelete'; // Koristi dugme za brisanje

interface DeleteRowProps {
  rowIndex: number;
  rowIds: Map<number, number>; // Mapa sa ID-jevima redova
  onDeleteSuccess: () => void; // Callback koji se zove kad se red uspešno obriše
}

const DeleteRow: React.FC<DeleteRowProps> = ({ rowIndex, rowIds, onDeleteSuccess }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false); // Stanje za prikazivanje loadera
  const navigate = useNavigate(); // Navigacija za poziv API-ja

  const handleDeleteRow = async () => {
    setIsLoading(true); // Početak učitavanja
    try {
      // Dohvati ID iz rowIds mape
      const id = rowIds.get(rowIndex);

      // Provera da li je ID validan broj
      if (typeof id !== 'number' || isNaN(id)) {
        console.error('Nevalidan ID:', id);
        return;
      }

      // Pozovi funkciju za brisanje iz backend-a
      await deleteFmeaInfo(navigate, id);
      console.log(`Red sa ID-jem ${id} je uspešno obrisan.`);

      // Zovi callback kako bi osvežio tabelu ili pokrenuo neki drugi mehanizam
      onDeleteSuccess();
    } catch (error) {
      console.error(`Greška prilikom brisanja reda sa indeksom ${rowIndex}:`, error);
    } finally {
      setIsLoading(false); // Završetak učitavanja
    }
  };

  return (
    <ButtonDelete onDelete={handleDeleteRow} isLoading={isLoading} />
  );
};

export default DeleteRow;
