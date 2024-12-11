// Filters.tsx
import React, { useState, useEffect, useRef } from "react";
import FilterOptions from "./FilterOptions";
import {
  filterColumnByValues,
  filterColumnByBackgroundColors,
  filterColumnByFontColors,
  clearFilters as clearAllFilters,
  sortColumn,
  FilterFunctionsParams,
} from "./FilterFunctions"; // Importujemo funkcije iz filterFunctions.ts
import { TextSegment, useToolContext } from "../../Context/ToolContext";
import "./Filters.css";
import { useRowIdsContext } from "../../Context/RowIdsContext";
import { useNavigate } from "react-router-dom";
import { useColumnNameContext } from "../../Context/ColumnNameContext";

interface FiltersProps {
  onClose: () => void;
  selectedColumn: number | null;
  rows: number;
}


const Filters: React.FC<FiltersProps> = ({ onClose, selectedColumn, rows }) => {
  const navigate = useNavigate(); // Dodaj useNavigate
  const { columns } = useRowIdsContext();
  const { cellContent, setCellContent } = useToolContext();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const originalContent = useRef(new Map(cellContent)); // Koristimo useRef da sačuvamo originalni sadržaj
  const [savedSelectedValues, setSavedSelectedValues] = useState<Set<string>>(
    new Set()
  );
  const [selectedBackgroundColors, setSelectedBackgroundColors] = useState<
    Set<string>
  >(new Set());
  const [selectedFontColors, setSelectedFontColors] = useState<Set<string>>(
    new Set()
  );
  const { refetch: refetchDataFetcher, clear } = useColumnNameContext();
  const prevContentRef = useRef<Map<string, TextSegment[]>>(new Map());

  useEffect(() => {
    console.log(
      "Initial load or updates happening. Current prevContentRef:",
      Array.from(prevContentRef.current.entries())
    );
  }, []);

  const handleFiltersClose = () => {
    onClose();
  };

  const applyFilters = () => {
    if (selectedColumn !== null) {
      // Refetch data to fetch only filtered results
      refetchDataFetcher();
  
      // Clear the table content before applying filters
      //setCellContent(new Map());
  
      // Save current content state for reset functionality
      const currentContent = new Map(cellContent);
      prevContentRef.current = currentContent;
  
      sessionStorage.setItem(
        "prevContent",
        JSON.stringify(Array.from(currentContent.entries()))
      );
  
      const params: FilterFunctionsParams = {
        rows,
        columns,
        originalContent: originalContent.current,
        setCellContent,
      };
  
      if (sortOrder) {
        sortColumn(params, selectedColumn, sortOrder);
      }
  
      if (savedSelectedValues.size > 0) {
        filterColumnByValues(params, selectedColumn, savedSelectedValues);
      }
  
      if (selectedBackgroundColors.size > 0) {
        filterColumnByBackgroundColors(
          params,
          selectedColumn,
          selectedBackgroundColors
        );
      }
  
      if (selectedFontColors.size > 0) {
        filterColumnByFontColors(params, selectedColumn, selectedFontColors);
      }
    }
  
    handleFiltersClose();
  };
  

  const resetToOriginal = () => {
    console.log(
      "Reset button clicked. Starting to revert to original values..."
    );
  
    // Reset all filters in the context
    setSortOrder(null);
    setSelectedBackgroundColors(new Set());
    setSelectedFontColors(new Set());
  
    clear();
  
    console.log("Reset completed. All filters cleared and data refetched.");
    handleFiltersClose();
  };
  

  // Nova funkcija za "Clear" dugme
  const handleClearFilters = () => {
    // Resetovanje svih filtera
    setSortOrder(null);
    setSavedSelectedValues(new Set());
    setSelectedBackgroundColors(new Set());
    setSelectedFontColors(new Set());

    // Očistiti primenjene filtere na tabeli
    const params: FilterFunctionsParams = {
      rows,
      columns,
      originalContent: originalContent.current,
      setCellContent,
    };
    clearAllFilters(params);
  };

  const handleCheckboxFilterChange = (selectedValues: Set<string>) => {
    setSavedSelectedValues(new Set(selectedValues));
  };

  const handleBackgroundColorFilterChange = (selectedColors: Set<string>) => {
    setSelectedBackgroundColors(new Set(selectedColors));
  };

  const handleFontColorFilterChange = (selectedColors: Set<string>) => {
    setSelectedFontColors(new Set(selectedColors));
  };

  return (
    <div className="filter-menu">
      <div className="filter-header">Filter Options</div>
      <FilterOptions
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        selectedColumn={selectedColumn}
        originalContent={originalContent.current}
        savedSelectedValues={savedSelectedValues}
        selectedBackgroundColors={selectedBackgroundColors}
        selectedFontColors={selectedFontColors}
        handleCheckboxFilterChange={handleCheckboxFilterChange}
        handleBackgroundColorFilterChange={handleBackgroundColorFilterChange}
        handleFontColorFilterChange={handleFontColorFilterChange}
        navigate={navigate} // Prosleđivanje navigate
      />

      <div className="filter-separator"></div>
      <div
        className={`filter-option ${
          sortOrder === null &&
          savedSelectedValues.size === 0 &&
          selectedBackgroundColors.size === 0 &&
          selectedFontColors.size === 0
            ? "disabled"
            : ""
        }`}
        onClick={
          sortOrder === null &&
          savedSelectedValues.size === 0 &&
          selectedBackgroundColors.size === 0 &&
          selectedFontColors.size === 0
            ? undefined
            : handleClearFilters // Poziva handleClearFilters umesto applyFilters
        }
      >
        <i className="fas fa-times"></i> Clear
      </div>
      <div className="filter-actions">
        <button onClick={applyFilters}>Apply</button>
        <button onClick={resetToOriginal}>Reset</button>
      </div>
    </div>
  );
};

export default Filters;
