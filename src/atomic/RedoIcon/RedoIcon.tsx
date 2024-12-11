// Redo.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { useToolContext } from '../../Context/ToolContext'; // Ensure correct import

const RedoIcon: React.FC = () => {
  const { redo } = useToolContext(); // Get redo function from context

  return (
    <FontAwesomeIcon
      icon={faRedo}
      title="Redo"
      className="icon"
      onClick={redo} // Call redo function on click
      style={{ cursor: 'pointer' }}
    />
  );
};

export default RedoIcon;
