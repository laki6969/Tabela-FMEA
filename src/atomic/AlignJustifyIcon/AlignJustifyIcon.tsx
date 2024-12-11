import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignJustify } from '@fortawesome/free-solid-svg-icons';
import { useToolContext } from '../../Context/ToolContext';

const AlignJustifyIcon: React.FC = () => {
    const { activeCell, setCellContent, cellContent, toggleAlignJustify, isAlignJustifyActive } = useToolContext();

    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();
        toggleAlignJustify();
        if (activeCell) {
            const key = `${activeCell.row}-${activeCell.col}`;
            let content = cellContent.get(key) || [{
                text: '',
                isBold: false,
                isItalic: false,
                isUnderline: false,
                fontColor: '#000000',
                backgroundColor: '#FFFFFF',
                textAlign: 'justify'
            }];
            content = content.map(segment => ({
                ...segment,
                textAlign: 'justify',
            }));
            setCellContent(activeCell.row, activeCell.col, content);
        }
    };

    return (
        <FontAwesomeIcon 
            icon={faAlignJustify} 
            title="Align Justify" 
            className={`icon ${isAlignJustifyActive ? 'active' : ''}`}  
            onMouseDown={handleClick}
        />
    );
};

export default AlignJustifyIcon;
