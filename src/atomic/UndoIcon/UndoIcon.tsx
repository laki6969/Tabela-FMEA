// UndoIcon.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { useToolContext } from '../../Context/ToolContext'; // Ensure correct import

const UndoIcon: React.FC = () => {
  const { undo } = useToolContext();

  return (
    <FontAwesomeIcon
      icon={faUndo}
      title="Undo"
      className="icon"
      onClick={undo}
      style={{ cursor: 'pointer' }}
    />
  );
};

export default UndoIcon;
