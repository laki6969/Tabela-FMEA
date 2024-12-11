// DropdownAction.tsx
import React, { useState } from 'react';
import { Select } from 'antd';
import './DropdownStyles.css';

interface DropdownActionProps {
  onSelect: (value: string) => void;
}

const DropdownAction: React.FC<DropdownActionProps> = ({ onSelect }) => {
  const [value, setValue] = useState<string>('');

  const handleChange = (selectedValue: string) => {
    setValue(selectedValue);
    onSelect(selectedValue); // Trigger onSelect when an option is selected
  };

  return (
    <Select
      value={value || undefined}
      onChange={handleChange}
      size="small"
      placeholder="Odaberi tip"
    >
      <Select.Option value="P">P</Select.Option>
      <Select.Option value="D">D</Select.Option>
    </Select>
  );
};

export default DropdownAction;
