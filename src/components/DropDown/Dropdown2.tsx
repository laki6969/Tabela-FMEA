// Dropdown2.tsx
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { fetchCausesForMItem } from '../../requests/tabledata';
import { useNavigate } from 'react-router-dom';
import { useTypeValueContext } from '../../Context/TypeValueContext';
import './DropdownStyles.css';

interface Dropdown2Props {
  onSelect: (value: string) => void;
}

const Dropdown2: React.FC<Dropdown2Props> = ({ onSelect }) => {
  const [options, setOptions] = useState<{ name: string; id: number }[]>([]);
  const [value, setValue] = useState<string>('');
  const navigate = useNavigate();
  const { typeValue: type } = useTypeValueContext();

  useEffect(() => {
    if (type) {
      const fetchOptions = async () => {
        try {
          const data = await fetchCausesForMItem(navigate, type);
          setOptions(data);
        } catch (error) {
          console.error("Error fetching options for Dropdown2:", error);
        }
      };
      fetchOptions();
    }
  }, [type, navigate]);

  const handleChange = (selectedValue: string) => {
    setValue(selectedValue);
    onSelect(selectedValue); // Trigger onSelect when an option is selected
  };

  return (
    <Select
      value={value || undefined}
      onChange={handleChange}
      size="small"
      placeholder="Odaberi radni element"
    >
      {options.map(option => (
        <Select.Option key={option.id} value={option.id}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  );
};

export default Dropdown2;
