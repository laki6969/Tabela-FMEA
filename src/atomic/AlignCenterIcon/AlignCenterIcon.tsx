import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignCenter } from '@fortawesome/free-solid-svg-icons';
import { useToolContext } from '../../Context/ToolContext';

const AlignCenterIcon: React.FC = () => {
    const { activeCell, setCellContent, cellContent, toggleAlignCenter, isAlignCenterActive } = useToolContext();

    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();
        toggleAlignCenter();
        if (activeCell) {
            const key = `${activeCell.row}-${activeCell.col}`;
            let content = cellContent.get(key) || [{
                text: '',
                isBold: false,
                isItalic: false,
                isUnderline: false,
                fontColor: '#000000',
                backgroundColor: '#FFFFFF',
                textAlign: 'center'
            }];
            content = content.map(segment => ({
                ...segment,
                textAlign: 'center',
            }));
            setCellContent(activeCell.row, activeCell.col, content);
        }
    };

    return (
        <FontAwesomeIcon 
            icon={faAlignCenter} 
            title="Align Center" 
            className={`icon ${isAlignCenterActive ? 'active' : ''}`}  
            onMouseDown={handleClick}
        />
    );
};

export default AlignCenterIcon;
