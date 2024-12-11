// filterFunctions.ts
import { TextSegment } from '../../Context/ToolContext';

export interface FilterFunctionsParams {
  rows: number;
  columns: number;
  originalContent: Map<string, TextSegment[]>;
  setCellContent: (row: number, col: number, content: TextSegment[]) => void;
}

export const filterColumnByValues = (
  params: FilterFunctionsParams,
  colIndex: number | null,
  values: Set<string>
) => {
  const { rows, columns, originalContent, setCellContent } = params;

  if (colIndex === null) return;

  let nextAvailableRowIndex = 0;

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const originalRowContent: (TextSegment[] | undefined)[] = Array.from(
      { length: columns },
      (_, col) => originalContent.get(`${rowIndex}-${col}`)
    );

    const cellText = originalRowContent[colIndex]?.map((segment: TextSegment) => segment.text).join('') || '';

    if (values.size === 0 || values.has(cellText)) {
      originalRowContent.forEach((content, index) => {
        if (content) {
          setCellContent(nextAvailableRowIndex, index, content);
        }
      });
      nextAvailableRowIndex++;
    }
  }

  // Clear the remaining table
  for (let rowIndex = nextAvailableRowIndex; rowIndex < rows; rowIndex++) {
    for (let col = 0; col < columns; col++) {
      setCellContent(rowIndex, col, [
        {
          text: '',
          isBold: false,
          isItalic: false,
          isUnderline: false,
          fontColor: '',
          backgroundColor: '',
          textAlign: 'left',
        },
      ]);
    }
  }
};

export const filterColumnByBackgroundColors = (
  params: FilterFunctionsParams,
  colIndex: number,
  colors: Set<string>
) => {
  const { rows, columns, originalContent, setCellContent } = params;

  let nextAvailableRowIndex = 0;

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const originalRowContent: (TextSegment[] | undefined)[] = Array.from(
      { length: columns },
      (_, col) => originalContent.get(`${rowIndex}-${col}`)
    );

    const cellBackgroundColor = originalRowContent[colIndex]?.[0]?.backgroundColor || '';

    if (colors.size === 0 || colors.has(cellBackgroundColor)) {
      originalRowContent.forEach((content, index) => {
        if (content) {
          setCellContent(nextAvailableRowIndex, index, content);
        }
      });
      nextAvailableRowIndex++;
    }
  }

  // Clear the remaining table
  for (let rowIndex = nextAvailableRowIndex; rowIndex < rows; rowIndex++) {
    for (let col = 0; col < columns; col++) {
      setCellContent(rowIndex, col, [
        {
          text: '',
          isBold: false,
          isItalic: false,
          isUnderline: false,
          fontColor: '',
          backgroundColor: '',
          textAlign: 'left',
        },
      ]);
    }
  }
};

export const filterColumnByFontColors = (
  params: FilterFunctionsParams,
  colIndex: number,
  colors: Set<string>
) => {
  const { rows, columns, originalContent, setCellContent } = params;

  let nextAvailableRowIndex = 0;

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const originalRowContent: (TextSegment[] | undefined)[] = Array.from(
      { length: columns },
      (_, col) => originalContent.get(`${rowIndex}-${col}`)
    );

    const cellFontColor = originalRowContent[colIndex]?.[0]?.fontColor || '';

    if (colors.size === 0 || colors.has(cellFontColor)) {
        originalRowContent.forEach((content, index) => {
            if (content) {
                // Koristite originalni sadržaj bez izmene fontColor
                setCellContent(nextAvailableRowIndex, index, content);
            }
        });
        nextAvailableRowIndex++;
    }
  }

  // Clear the remaining table
  for (let rowIndex = nextAvailableRowIndex; rowIndex < rows; rowIndex++) {
    for (let col = 0; col < columns; col++) {
      setCellContent(rowIndex, col, [
        {
          text: '',
          isBold: false,
          isItalic: false,
          isUnderline: false,
          fontColor: '',
          backgroundColor: '',
          textAlign: 'left',
        },
      ]);
    }
  }
};

export const clearFilters = (params: FilterFunctionsParams) => {
  const { rows, columns, originalContent, setCellContent } = params;

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    for (let colIndex = 0; colIndex < columns; colIndex++) {
      const originalContentForCell = originalContent.get(`${rowIndex}-${colIndex}`);
      if (originalContentForCell) {
        setCellContent(rowIndex, colIndex, originalContentForCell);
      } else {
        setCellContent(rowIndex, colIndex, [
          {
            text: '',
            isBold: false,
            isItalic: false,
            isUnderline: false,
            fontColor: '',
            backgroundColor: '',
            textAlign: 'left',
          },
        ]);
      }
    }
  }
};

export const sortColumn = (
    params: FilterFunctionsParams,
    colIndex: number,
    order: 'asc' | 'desc'
  ) => {
    const { rows, originalContent, setCellContent } = params;
  
    // Kreiraj niz redova sa vrednostima iz kolone za sortiranje
    const rowsData = Array.from({ length: rows }, (_, rowIndex) => {
      const cellKey = `${rowIndex}-${colIndex}`;
      const cellContent = originalContent.get(cellKey) || [];
      const cellText = cellContent.map(segment => segment.text).join('').trim();
      return { rowIndex, cellText };
    });
  
    // Sortiraj redove na osnovu vrednosti u koloni, vodeći računa o praznim poljima
    rowsData.sort((a, b) => {
      // Ako su obe vrednosti prazne, zadrži njihov redosled
      if (a.cellText === '' && b.cellText === '') return 0;
  
      // Ako je `a.cellText` prazno, u zavisnosti od reda (asc/desc), stavi ga na vrh ili dno
      if (a.cellText === '') return order === 'asc' ? -1 : 1;
      
      // Ako je `b.cellText` prazno, u zavisnosti od reda (asc/desc), stavi ga na vrh ili dno
      if (b.cellText === '') return order === 'asc' ? 1 : -1;
  
      // Normalno sortiranje kada nisu prazne
      return order === 'asc' 
        ? a.cellText.localeCompare(b.cellText) 
        : b.cellText.localeCompare(a.cellText);
    });
  
    // Kreiraj mapu za novo sortirane redove
    const sortedRowIndices = rowsData.map(row => row.rowIndex);
  
    // Kreiraj novu mapu sa sortiranom sadržinom
    const sortedContent = new Map<string, TextSegment[]>();
    sortedRowIndices.forEach((originalRowIndex, newRowIndex) => {
      for (let c = 0; c < params.columns; c++) { // Pretpostavljam da postoji 'columns' u params
        const originalKey = `${originalRowIndex}-${c}`;
        const newKey = `${newRowIndex}-${c}`;
        const content = originalContent.get(originalKey) || [
          {
            text: '',
            isBold: false,
            isItalic: false,
            isUnderline: false,
            fontColor: '',
            backgroundColor: '',
            textAlign: 'left',
          },
        ];
        sortedContent.set(newKey, content);
      }
    });
  
    // Ažuriraj sve ćelije sa praznim sadržajem
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      for (let col = 0; col < params.columns; col++) { // Pretpostavljam da postoji 'columns' u params
        setCellContent(rowIndex, col, [
          {
            text: '',
            isBold: false,
            isItalic: false,
            isUnderline: false,
            fontColor: '',
            backgroundColor: '',
            textAlign: 'left',
          },
        ]);
      }
    }
  
    // Postavi sortirani sadržaj nazad u originalContent
    sortedContent.forEach((content, key) => {
      const [rowIndex, col] = key.split('-').map(Number);
      setCellContent(rowIndex, col, content);
    });
  };
  
