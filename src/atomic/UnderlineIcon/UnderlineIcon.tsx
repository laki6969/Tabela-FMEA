import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnderline } from '@fortawesome/free-solid-svg-icons';
import { useToolContext } from '../../Context/ToolContext';

const UnderlineIcon: React.FC = () => {
    const { activeCell, toggleUnderline, isUnderlineActive, setCellContent, cellContent } = useToolContext();

    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();  
        toggleUnderline();
        if (activeCell) {
            const key = `${activeCell.row}-${activeCell.col}`;
            let content = cellContent.get(key) || [{
                text: '',
                isBold: false,
                isItalic: false,
                isUnderline: false,
                fontColor: '#000000',
                backgroundColor: '#FFFFFF',
                textAlign: 'left'
            }];
            const isUnderline = !content.some(segment => segment.isUnderline);
            content = content.map(segment => ({
                ...segment,
                isUnderline,
                fontColor: segment.fontColor || '#000000',
                backgroundColor: segment.backgroundColor || '#FFFFFF',
                textAlign: segment.textAlign || 'left'
            }));
            setCellContent(activeCell.row, activeCell.col, content);  
        }
    };

    return (
        <FontAwesomeIcon 
            icon={faUnderline} 
            title="Underline" 
            className={`icon ${isUnderlineActive ? 'active' : ''}`}  
            onMouseDown={handleClick}
        />
    );
};

export default UnderlineIcon;
