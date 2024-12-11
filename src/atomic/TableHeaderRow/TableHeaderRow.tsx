// src/atomic/TableHeaderRow/TableHeaderRow.tsx

import React from 'react';

interface TableHeaderRowProps {
    columns: number;
}

const TableHeaderRow: React.FC<TableHeaderRowProps> = ({ columns }) => {
    // Function to convert a number to a corresponding letter, like Excel (A, B, C, ... Z, AA, AB, etc.)
    const columnToLetter = (column: number): string => {
        let letter = '';
        let temp = column;

        while (temp >= 0) {
            letter = String.fromCharCode((temp % 26) + 65) + letter;
            temp = Math.floor(temp / 26) - 1;
        }

        return letter;
    };

    // Predefined texts for each column in the second row
    const hardcodedTexts = ['Title', 'Author', 'Year', 'Publisher', 'ISBN', 'Language', 'Pages', 'Genre', 'Rating', 'Summary'];

    return (
        <>
            {/* Header row with letters A, B, C, etc. */}
            <tr>
                <th></th> {/* Empty header cell for row numbers */}
                {Array.from({ length: columns }).map((_, index) => (
                    <th key={index}>{columnToLetter(index)}</th>
                ))}
            </tr>
            
            {/* Hardcoded text row below the header letters */}
            <tr>
                <td></td> {/* Empty cell to align with row numbers */}
                {Array.from({ length: columns }).map((_, index) => (
                    <td key={index}>{hardcodedTexts[index] || ''}</td>
                ))}
            </tr>
        </>
    );
};

export default TableHeaderRow;
