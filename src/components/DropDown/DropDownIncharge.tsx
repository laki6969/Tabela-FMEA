// DropDownIncharge.tsx
import React, { useState, useCallback } from 'react';
import { Select } from 'antd';
import { fetchCausesForActionVerifierItem } from '../../requests/tabledata';
import { useNavigate } from 'react-router-dom';
import './DropdownStyles.css';

interface DropDownInchargeProps {
  onSelect: (value: string) => void;
}

const DropDownIncharge: React.FC<DropDownInchargeProps> = ({ onSelect }) => {
  const [options, setOptions] = useState<{ name: string; id: number }[]>([]);
  const [value, setValue] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadOptions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCausesForActionVerifierItem(navigate, "");
      setOptions(data || []);
    } catch (error) {
      console.error("Error loading incharge options:", error);
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
      placeholder="Odaberi odgovorno lice"
      loading={loading}
    >
      {options.map(option => (
        <Select.Option key={option.id} value={option.id}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  );
};

export default DropDownIncharge;
