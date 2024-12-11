import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold } from '@fortawesome/free-solid-svg-icons';
import { useToolContext } from '../../Context/ToolContext';

const BoldIcon: React.FC = () => {
    const { activeCell, toggleBold, isBoldActive, setCellContent, cellContent } = useToolContext();

    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();  
        toggleBold();
        if (activeCell) {
            const key = `${activeCell.row}-${activeCell.col}`;
            let content = cellContent.get(key) || [{
                text: '',
                isBold: false,
                isItalic: false,
                isUnderline: false,
                fontColor: '#000000',
                backgroundColor: '#FFFFFF',
                textAlign: 'left'  // Default alignment
            }];
            const isBold = !content.some(segment => segment.isBold);
            content = content.map(segment => ({
                ...segment,
                isBold,
                fontColor: segment.fontColor || '#000000',
                backgroundColor: segment.backgroundColor || '#FFFFFF',
                textAlign: segment.textAlign || 'left',  // Ensure textAlign is included
            }));
            setCellContent(activeCell.row, activeCell.col, content);  
        }
    };

    return (
        <FontAwesomeIcon 
            icon={faBold} 
            title="Bold" 
            className={`icon ${isBoldActive ? 'active' : ''}`}  
            onMouseDown={handleClick}
        />
    );
};

export default BoldIcon;
