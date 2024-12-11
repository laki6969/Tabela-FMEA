// Dropdown.tsx
import React, { useState } from 'react';
import { Select } from 'antd';
import { useTypeValueContext } from '../../Context/TypeValueContext';
import './DropdownStyles.css';

interface DropdownProps {
  onSelect: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ onSelect }) => {
  const { setTypeValue } = useTypeValueContext();
  const [value, setValue] = useState<string>('');

  const handleChange = (selectedValue: string) => {
    setValue(selectedValue);
    setTypeValue(selectedValue);
    onSelect(selectedValue); // Trigger onSelect when an option is selected
  };

  return (
    <Select
      value={value || undefined}
      onChange={handleChange}
      size="small"
      placeholder="Odaberi tip radnog elementa"
    >
      <Select.Option value="Man">Čovek</Select.Option>
      <Select.Option value="Machine">Mašina</Select.Option>
      <Select.Option value="Measurement">Merenja</Select.Option>
      <Select.Option value="Method">Metod</Select.Option>
      <Select.Option value="MotherNature">Priroda</Select.Option>
      <Select.Option value="Material">Materijal</Select.Option>

    </Select>
  );
};

export default Dropdown;
