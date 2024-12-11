import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

// Defining TextSegment interface
export interface TextSegment {
    text: string;
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    fontColor: string;
    backgroundColor: string; 
    textAlign: 'left' | 'center' | 'right' | 'justify';
}

// ToolContextProps interface
export interface ToolContextProps {
    activeCell: { row: number; col: number } | null;
    setActiveCell: (cell: { row: number; col: number } | null) => void;
    cellContent: Map<string, TextSegment[]>;
    setCellContent: (row: number, col: number, content: TextSegment[]) => void;
    undo: () => void; // Undo function
    redo: () => void; // Redo function
    toggleBold: () => void;
    toggleItalic: () => void;
    toggleUnderline: () => void;
    toggleAlignLeft: () => void;
    toggleAlignRight: () => void;
    toggleAlignCenter: () => void;
    toggleAlignJustify: () => void;
    changeFontColor: (color: string) => void;
    changeBackgroundColor: (color: string) => void;
    isCellBold: (row: number, col: number) => boolean;
    isCellItalic: (row: number, col: number) => boolean;
    isCellUnderline: (row: number, col: number) => boolean;
    getCellFontColor: (row: number, col: number) => string;
    getCellBackgroundColor: (row: number, col: number) => string;
    isBoldActive: boolean;
    isItalicActive: boolean;
    isUnderlineActive: boolean;
    isAlignLeftActive: boolean;
    isAlignRightActive: boolean;
    isAlignCenterActive: boolean;
    isAlignJustifyActive: boolean;
    activeTextAlign: 'left' | 'center' | 'right' | 'justify';
    activeFontColor: string;
    activeBackgroundColor: string;
    setToolbarBold: (value: boolean) => void;
    setToolbarItalic: (value: boolean) => void;
    setToolbarUnderline: (value: boolean) => void;
    setToolbarAlignLeft: (value: boolean) => void;
    setToolbarAlignRight: (value: boolean) => void;
    setToolbarAlignCenter: (value: boolean) => void;
    setToolbarAlignJustify: (value: boolean) => void;
    setToolbarFontColor: (color: string) => void;
}

// Creating ToolContext
const ToolContext = createContext<ToolContextProps | undefined>(undefined); 

// ToolProvider component
export const ToolProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
    const [cellContent, setCellContentState] = useState<Map<string, TextSegment[]>>(new Map());
    const [isBoldActive, setBoldActive] = useState<boolean>(false);
    const [isItalicActive, setItalicActive] = useState<boolean>(false);
    const [isUnderlineActive, setUnderlineActive] = useState<boolean>(false);
    const [isAlignLeftActive, setAlignLeftActive] = useState<boolean>(true); // Default is Align Left active
    const [isAlignRightActive, setAlignRightActive] = useState<boolean>(false);
    const [isAlignCenterActive, setAlignCenterActive] = useState<boolean>(false);
    const [isAlignJustifyActive, setAlignJustifyActive] = useState<boolean>(false);
    const [activeTextAlign, setActiveTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left'); // Default align left
    const [activeFontColor, setActiveFontColor] = useState<string>('#000000');
    const [activeBackgroundColor, setActiveBackgroundColor] = useState<string>('#FFFFFF');
    const [history, setHistory] = useState<Map<string, TextSegment[]>[]>([]);
    const [redoStack, setRedoStack] = useState<Map<string, TextSegment[]>[]>([]); // Add redo stack state

    const setCellContent = (row: number, col: number, content: TextSegment[]) => {
        const key = `${row}-${col}`;
        setHistory((prevHistory) => [...prevHistory, new Map(cellContent)]); // Save current state to history
        setRedoStack([]); // Clear redo stack on new action
        setCellContentState((prevState) => {
            const newState = new Map(prevState);
            newState.set(key, content);
            return newState;
        });
    };

    const undo = useCallback(() => {
        if (history.length > 0) {
            const lastState = history[history.length - 1];
            setRedoStack((prevRedoStack) => [...prevRedoStack, new Map(cellContent)]); // Save current state to redo stack
            setHistory((prevHistory) => prevHistory.slice(0, -1));
            setCellContentState(lastState);
            console.log("Undo");
        }
    }, [history, cellContent]);

    const redo = useCallback(() => {
        if (redoStack.length > 0) {
            const nextState = redoStack[redoStack.length - 1];
            setHistory((prevHistory) => [...prevHistory, new Map(cellContent)]); // Save current state to history
            setRedoStack((prevRedoStack) => prevRedoStack.slice(0, -1));
            setCellContentState(nextState);
            console.log("Redo");
        }
    }, [redoStack, cellContent]);

    const toggleBold = () => {
        setBoldActive(prev => !prev);
    };

    const toggleItalic = () => {
        setItalicActive(prev => !prev);
    };

    const toggleUnderline = () => {
        setUnderlineActive(prev => !prev);
    };

    const toggleAlignLeft = () => {
        setAlignLeftActive(true);
        setAlignRightActive(false);
        setAlignCenterActive(false);
        setAlignJustifyActive(false);
        setActiveTextAlign('left');
    };

    const toggleAlignRight = () => {
        setAlignRightActive(true);
        setAlignLeftActive(false);
        setAlignCenterActive(false);
        setAlignJustifyActive(false);
        setActiveTextAlign('right');
    };

    const toggleAlignCenter = () => {
        setAlignCenterActive(true);
        setAlignLeftActive(false);
        setAlignRightActive(false);
        setAlignJustifyActive(false);
        setActiveTextAlign('center');
    };

    const toggleAlignJustify = () => {
        setAlignJustifyActive(true);
        setAlignLeftActive(false);
        setAlignRightActive(false);
        setAlignCenterActive(false);
        setActiveTextAlign('justify');
    };

    const changeFontColor = (color: string) => {
        setActiveFontColor(color);
    };

    const changeBackgroundColor = (color: string) => {
        setActiveBackgroundColor(color);
    };

    const isCellBold = (row: number, col: number) => {
        const key = `${row}-${col}`;
        const content = cellContent.get(key) || [{
            text: '',
            isBold: false,
            isItalic: false,
            isUnderline: false,
            fontColor: '#000000',
            backgroundColor: '#FFFFFF',
            textAlign: 'left'
        }];
        return content.some(segment => segment.isBold);
    };

    const isCellItalic = (row: number, col: number) => {
        const key = `${row}-${col}`;
        const content = cellContent.get(key) || [{
            text: '',
            isBold: false,
            isItalic: false,
            isUnderline: false,
            fontColor: '#000000',
            backgroundColor: '#FFFFFF',
            textAlign: 'left'
        }];
        return content.some(segment => segment.isItalic);
    };

    const isCellUnderline = (row: number, col: number) => {
        const key = `${row}-${col}`;
        const content = cellContent.get(key) || [{
            text: '',
            isBold: false,
            isItalic: false,
            isUnderline: false,
            fontColor: '#000000',
            backgroundColor: '#FFFFFF',
            textAlign: 'left'
        }];
        return content.some(segment => segment.isUnderline);
    };

    const getCellFontColor = (row: number, col: number) => {
        const key = `${row}-${col}`;
        const content = cellContent.get(key);
        return content ? content[0].fontColor : '#000000';
    };

    const getCellBackgroundColor = (row: number, col: number) => {
        const key = `${row}-${col}`;
        const content = cellContent.get(key);
        return content ? content[0].backgroundColor : '#FFFFFF';
    };

    const setToolbarBold = (value: boolean) => {
        setBoldActive(value);
    };

    const setToolbarItalic = (value: boolean) => {
        setItalicActive(value);
    };

    const setToolbarUnderline = (value: boolean) => {
        setUnderlineActive(value);
    };

    const setToolbarAlignLeft = (value: boolean) => {
        setAlignLeftActive(value);
        if (value) {
            setAlignRightActive(false);
            setAlignCenterActive(false);
            setAlignJustifyActive(false);
            setActiveTextAlign('left');
        }
    };

    const setToolbarAlignRight = (value: boolean) => {
        setAlignRightActive(value);
        if (value) {
            setAlignLeftActive(false);
            setAlignCenterActive(false);
            setAlignJustifyActive(false);
            setActiveTextAlign('right');
        }
    };

    const setToolbarAlignCenter = (value: boolean) => {
        setAlignCenterActive(value);
        if (value) {
            setAlignLeftActive(false);
            setAlignRightActive(false);
            setAlignJustifyActive(false);
            setActiveTextAlign('center');
        }
    };

    const setToolbarAlignJustify = (value: boolean) => {
        setAlignJustifyActive(value);
        if (value) {
            setAlignLeftActive(false);
            setAlignRightActive(false);
            setAlignCenterActive(false);
            setActiveTextAlign('justify');
        }
    };

    const setToolbarFontColor = (color: string) => {
        setActiveFontColor(color);
    };

    return (
        <ToolContext.Provider value={{
            activeCell, setActiveCell, cellContent, setCellContent,
            undo, // Provide undo function
            redo, // Provide redo function
            toggleBold, toggleItalic, toggleUnderline,
            toggleAlignLeft, toggleAlignRight, toggleAlignCenter, toggleAlignJustify,
            changeFontColor, changeBackgroundColor,
            isCellBold, isCellItalic, isCellUnderline,
            getCellFontColor, getCellBackgroundColor,
            isBoldActive, isItalicActive, isUnderlineActive,
            isAlignLeftActive, isAlignRightActive, isAlignCenterActive, isAlignJustifyActive,
            activeTextAlign, activeFontColor, activeBackgroundColor,
            setToolbarBold, setToolbarItalic, setToolbarUnderline,
            setToolbarAlignLeft, setToolbarAlignRight, setToolbarAlignCenter, setToolbarAlignJustify,
            setToolbarFontColor
        }}>
            {children}
        </ToolContext.Provider>
    );
};

// Hook for using ToolContext
export const useToolContext = (): ToolContextProps => {
    const context = useContext(ToolContext);
    if (!context) {
        throw new Error('useToolContext must be used within a ToolProvider');
    }
    return context;
};
