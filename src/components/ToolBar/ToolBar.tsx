import React from 'react';
import Tool from '../Tool/Tool'; // Pravilna putanja do Tool komponente
import './ToolBar.css';

const ToolBar: React.FC = () => {
    return (
        <div className="tools-bar">
            <Tool />
        </div>
    );
};

export default ToolBar;
