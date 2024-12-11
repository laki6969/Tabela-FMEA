// DropDownVerifier.tsx
import React, { useState, useCallback } from 'react';
import { Select } from 'antd';
import { fetchCausesForProcessItem } from '../../requests/tabledata';
import { useNavigate } from 'react-router-dom';
import './DropdownStyles.css';

interface DropDownVerifierProps {
  onSelect: (value: string) => void;
}

const DropDownVerifier: React.FC<DropDownVerifierProps> = ({ onSelect }) => {
  const [options, setOptions] = useState<{ processItem: string; id: number }[]>([]);
  const [value, setValue] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadOptions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCausesForProcessItem(navigate, "");
      setOptions(data || []);
    } catch (error) {
      console.error("Error loading verifier options:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleChange = (selectedValue: string) => {
    setValue(selectedValue);
    onSelect(selectedValue); // Trigger onSelect when an option is selected
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      onDropdownVisibleChange={(open) => open && loadOptions()}
      size="small"
      placeholder="Odaberi procesnu stavku"
      loading={loading}
    >
      {options.map(option => (
        <Select.Option key={option.id} value={option.id}>
          {option.processItem}
        </Select.Option>
      ))}
    </Select>
  );
};

export default DropDownVerifier;