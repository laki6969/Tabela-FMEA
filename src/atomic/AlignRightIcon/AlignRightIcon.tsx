import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignRight } from '@fortawesome/free-solid-svg-icons';
import { useToolContext } from '../../Context/ToolContext';

const AlignRightIcon: React.FC = () => {
    const { activeCell, setCellContent, cellContent, toggleAlignRight, isAlignRightActive } = useToolContext();

    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();
        toggleAlignRight();
        if (activeCell) {
            const key = `${activeCell.row}-${activeCell.col}`;
            let content = cellContent.get(key) || [{
                text: '',
                isBold: false,
                isItalic: false,
                isUnderline: false,
                fontColor: '#000000',
                backgroundColor: '#FFFFFF',
                textAlign: 'right',
            }];
            content = content.map(segment => ({
                ...segment,
                textAlign: 'right',
            }));
            setCellContent(activeCell.row, activeCell.col, content);
        }
    };

    return (
        <FontAwesomeIcon 
            icon={faAlignRight} 
            title="Align Right" 
            className={`icon ${isAlignRightActive ? 'active' : ''}`}  
            onMouseDown={handleClick}
        />
    );
};

export default AlignRightIcon;
