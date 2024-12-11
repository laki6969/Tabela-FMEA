import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faItalic } from '@fortawesome/free-solid-svg-icons';
import { useToolContext } from '../../Context/ToolContext';

const ItalicIcon: React.FC = () => {
    const { activeCell, toggleItalic, isItalicActive, setCellContent, cellContent } = useToolContext();

    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();  
        toggleItalic();
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
            const isItalic = !content.some(segment => segment.isItalic);
            content = content.map(segment => ({
                ...segment,
                isItalic,
                fontColor: segment.fontColor || '#000000',
                backgroundColor: segment.backgroundColor || '#FFFFFF',
                textAlign: segment.textAlign || 'left',
            }));
            setCellContent(activeCell.row, activeCell.col, content);  
        }
    };

    return (
        <FontAwesomeIcon 
            icon={faItalic} 
            title="Italic" 
            className={`icon ${isItalicActive ? 'active' : ''}`}  
            onMouseDown={handleClick}
        />
    );
};

export default ItalicIcon;
