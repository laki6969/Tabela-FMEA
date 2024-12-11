import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons';
import { useToolContext } from '../../Context/ToolContext';

const AlignLeftIcon: React.FC = () => {
    const { activeCell, setCellContent, cellContent, toggleAlignLeft, isAlignLeftActive } = useToolContext();

    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();
        toggleAlignLeft();
        if (activeCell) {
            const key = `${activeCell.row}-${activeCell.col}`;
            let content = cellContent.get(key) || [{
                text: '',
                isBold: false,
                isItalic: false,
                isUnderline: false,
                fontColor: '#000000',
                backgroundColor: '#FFFFFF',
                textAlign: 'left',
            }];
            content = content.map(segment => ({
                ...segment,
                textAlign: 'left',
            }));
            setCellContent(activeCell.row, activeCell.col, content);
        }
    };

    return (
        <FontAwesomeIcon 
            icon={faAlignLeft} 
            title="Align Left" 
            className={`icon ${isAlignLeftActive ? 'active' : ''}`}  
            onMouseDown={handleClick}
        />
    );
};

export default AlignLeftIcon;
