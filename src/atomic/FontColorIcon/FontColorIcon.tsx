import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFillDrip } from '@fortawesome/free-solid-svg-icons';
import { useToolContext } from '../../Context/ToolContext';

const colors = [
    "#000000", // Black
    "#FFFFFF", // White
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FFA500", // Orange
    "#800080", // Purple
    "#00FFFF", // Cyan
    "#FFC0CB", // Pink
    "#808080", // Gray
    "#D3D3D3", // Light Gray
    "#8B0000", // Dark Red
    "#FFD700", // Gold
    "#008080"  // Teal
];

const FontColorIcon: React.FC = () => {
    const { activeCell, changeFontColor, setCellContent, cellContent } = useToolContext();
    const [showPalette, setShowPalette] = useState(false);

    const handleColorSelect = (color: string) => {
        changeFontColor(color);
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
            content = content.map(segment => ({
                ...segment,
                fontColor: color,
                backgroundColor: segment.backgroundColor || '#FFFFFF',
                textAlign: segment.textAlign || 'left',
            }));
            setCellContent(activeCell.row, activeCell.col, content);  
        }
        setShowPalette(false);  // Sakrij paletu nakon izbora boje
    };

    return (
        <div style={{ display: 'inline-block', position: 'relative' }}>
            <FontAwesomeIcon 
                icon={faFillDrip} 
                title="Font Color" 
                className="icon"
                onClick={() => setShowPalette(!showPalette)}
                style={{ cursor: 'pointer' }}
            />
            {showPalette && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 20px)',
                    gap: '5px',
                    padding: '5px',
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    zIndex: 100
                }}>
                    {colors.map((color) => (
                        <div
                            key={color}
                            onClick={() => handleColorSelect(color)}
                            style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: color,
                                cursor: 'pointer'
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FontColorIcon;
