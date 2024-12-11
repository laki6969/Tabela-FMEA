// src/components/Tool.tsx
import UndoIcon from '../../atomic/UndoIcon/UndoIcon';
import RedoIcon from '../../atomic/RedoIcon/RedoIcon';
import BoldIcon from '../../atomic/BoldIcon/BoldIcon';
import ItalicIcon from '../../atomic/ItalicIcon/ItalicIcon';
import UnderlineIcon from '../../atomic/UnderlineIcon/UnderlineIcon';
import FontColorIcon from '../../atomic/FontColorIcon/FontColorIcon';
import BackgroundColorIcon from '../../atomic/BackgroundColorIcon/BackgroundColorIcon';
import AlignLeftIcon from '../../atomic/AlignLeftIcon/AlignLeftIcon';
import AlignCenterIcon from '../../atomic/AlignCenterIcon/AlignCenterIcon';
import AlignRightIcon from '../../atomic/AlignRightIcon/AlignRightIcon';
import AlignJustifyIcon from '../../atomic/AlignJustifyIcon/AlignJustifyIcon';
import './Tool.css';

const Tool: React.FC = () => {

    return (
        <>
            <UndoIcon />
            <RedoIcon />
            <div className="separator"></div>
            <BoldIcon />
            <ItalicIcon />
            <UnderlineIcon />
            <div className="separator"></div>
            <FontColorIcon />
            <BackgroundColorIcon />
            <div className="separator"></div>
            <AlignLeftIcon />
            <AlignCenterIcon />
            <AlignRightIcon />
            <AlignJustifyIcon />
            <div className="separator"></div>
        </>
    );
};

export default Tool;
