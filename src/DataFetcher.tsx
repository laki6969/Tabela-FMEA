import React, { useState, useEffect, useRef } from 'react';
import { getFmeaInfo } from './requests/tabledata';
import { useNavigate } from 'react-router-dom';
import { useRowIdsContext } from './Context/RowIdsContext';
import { useToolContext } from './Context/ToolContext';
import Loader from './components/Loader/Loader';
import { useRefreshContext } from './Context/RefreshContext';
import { usePaginationContext } from './Context/PaginationContext';
import { useColumnNameContext } from './Context/ColumnNameContext';
import { useDataFetcherContext } from './Context/DataFetcherContext';

interface DataFetcherProps {
  columns: number;
  setRowIds: React.Dispatch<React.SetStateAction<Map<number, number>>>;
  refresh: number;
}

const DataFetcher: React.FC<DataFetcherProps> = ({
  columns,
  setRowIds,
  refresh,
}) => {
  const navigate = useNavigate();
  const { setCellContent } = useToolContext();
  const { setRowIds: setRowIdsContext } = useRowIdsContext();
  const { setRowCount } = useRefreshContext();
  const {
    currentPage,
    pageSize,
    setTotalRows,
    setCurrentPage,
  } = usePaginationContext();
  const { columnName, selectedValues, refetchTrigger } = useColumnNameContext();
  const [isLoading, setIsLoading] = useState(false);
  const loadedPages = useRef<number[]>([]);
  const [lastPage, setLastPage] = useState(0); // Novo stanje za poslednju stranicu
  const {
    setActionPlanIds,
    setActionStatuses,
    setCostDescriptions,
    setRiskMeasurements,
    setRiskMeasurementsId,
    setResourceIds,
  } = useDataFetcherContext();

  const fetchData = async (
    page: number,
    direction: 'forward' | 'backward',
    mode: 'filter' | 'default'
  ) => {
    console.log(`Počinje učitavanje stranice: ${page}`);
    console.log(`Preostale stranice za učitavanje: ${lastPage - page}`);
  
    if (mode === 'filter') {
      console.log('Filter režim aktiviran, resetovanje redova.');
      setRowIds(new Map());
    }
  
    if (loadedPages.current.includes(page) && mode === 'default') {
      console.log(`Stranica ${page} je već učitana, preskače se.`);
      const nextPage = direction === 'backward' ? page - 1 : page + 1;
      if (nextPage > 0 && nextPage <= lastPage && !loadedPages.current.includes(nextPage)) {
        console.log(`Prelazak na sledeću stranicu: ${nextPage}`);
        fetchData(nextPage, direction, 'default');
      }
      return;
    }
  
    setIsLoading(true);
    try {
      console.log(`Učitavanje podataka za stranicu: ${page}`);
      const selectedValuesArray = Array.from(selectedValues);
  
      const data = await getFmeaInfo(navigate, page, columnName, selectedValuesArray);
  
      if (data && Array.isArray(data.data) && data.data.length > 0) {
        setTotalRows(data.total);
        setLastPage(data.last_page);
        console.log(`Podaci uspešno učitani za stranicu ${page}. Ukupno stranica: ${data.last_page}`);
  
        const updatedRowIds = new Map();
        data.data.forEach((item, rowIndex) => {
          const absoluteRowIndex = (page - 1) * pageSize + rowIndex + 1;
          updatedRowIds.set(absoluteRowIndex, item.id);
  
          for (let colIndex = 0; colIndex < columns; colIndex++) {
            const textValue = (() => {
              switch (colIndex) {
                case 0: return String(item.processItem || '');
                case 1: return String(item.processStep || '');
                case 2: return String(item.resource_type || '');
                case 3: return String(item.resource_name || '');
                case 4: return `${String(item.FEYourPlant || '')}\n${String(
                  item.FEShipToPlant || ''
                )}\n${String(item.FEEndUser || '')}`;
                case 5: return String(item.FM || '');
                case 6: return String(item.cause || '');
                case 7: return `${String(
                  item.processStepFunctionYourPlant || ''
                )}\n${String(item.processStepFunctionShipToPlant || '')}\n${String(
                  item.processStepFunctionEndUser || ''
                )}`;
                case 8: return `${String(item.processStepFunction || '')}\n${String(
                  item.processCharacteristicsFunction || ''
                )}`;
                case 9: return String(item.processWorkElementFunction || '');
                case 10: return String(item.S || '');
                case 11: return String(item.O || '');
                case 12: return String(item.D || '');
                case 13: return String(item.AP || '');
                case 14: return item.classification?.label || '';
                case 15: return item.riskMeasurements?.[0]?.name || '';
                case 16: return item.riskMeasurements?.[0]?.description || '';
                case 17: return item.action_plans?.[0]?.type || '';
                case 18: return item.action_plans?.[0]?.action || '';
                case 19: return String(item.action_plans?.[0]?.inCharge || '');
                case 20: return item.action_plans?.[0]?.verifier || '';
                case 21: return item.action_plans?.[0]?.startDate || '';
                case 22: return item.action_plans?.[0]?.endDate || '';
                case 23: return item.action_plans?.[0]?.completed_date || '';
                case 24: return String(item.action_plans?.[0]?.costOfAction || '');
                case 25: return String(item.action_plans?.[0]?.S || '');
                case 26: return String(item.action_plans?.[0]?.O || '');
                case 27: return String(item.action_plans?.[0]?.D || '');
                case 28: return String(item.comment || '');
                default: return '';
              }
            })();
  
            setCellContent(absoluteRowIndex, colIndex, [
              {
                text: textValue,
                isBold: false,
                isItalic: false,
                isUnderline: false,
                fontColor: '',
                backgroundColor: '',
                textAlign: 'left',
              },
            ]);
          }
  
          // Saving additional data
          setRowIds((prev) => new Map(prev).set(absoluteRowIndex, item.id));
          setRowIdsContext((prev) => new Map(prev).set(absoluteRowIndex, item.id));
          setResourceIds((prev) => new Map(prev).set(absoluteRowIndex, item.resource_id));
  
          if (item.riskMeasurements?.length > 0) {
            setRiskMeasurementsId((prev) =>
              new Map(prev).set(absoluteRowIndex, String(item.riskMeasurements[0]?.id || ''))
            );
            setRiskMeasurements((prev) =>
              new Map(prev).set(absoluteRowIndex, String(item.riskMeasurements[0]?.name || ''))
            );
          }
  
          if (item.action_plans?.length > 0) {
            setActionPlanIds((prev) =>
              new Map(prev).set(absoluteRowIndex, String(item.action_plans[0]?.id || ''))
            );
            setActionStatuses((prev) =>
              new Map(prev).set(absoluteRowIndex, (item.action_plans[0]?.status || '').slice(0, 3))
            );
          }
  
          if (item.costs?.length > 0) {
            setCostDescriptions((prev) =>
              new Map(prev).set(absoluteRowIndex, item.costs[0]?.description || '')
            );
          }
        });
  
        setRowIds((prev) => {
          let allRows = Array.from(prev);
          if (direction === 'backward') {
            allRows = [...updatedRowIds, ...allRows].slice(0, 2 * pageSize);
          } else {
            allRows = [...allRows, ...updatedRowIds].slice(-2 * pageSize);
          }
          allRows.sort(([a], [b]) => a - b);
          const newMap = new Map(allRows);
          setRowIdsContext(newMap);
          return newMap;
        });
  
        setRowCount((prevCount) => prevCount + data.data.length);
  
        loadedPages.current =
          direction === 'backward'
            ? [page, ...loadedPages.current].slice(0, 2)
            : [...loadedPages.current, page].slice(-2);
  
        console.log(`Ažurirane učitane stranice: ${loadedPages.current}`);
      }
    } catch (error) {
      console.error('Greška prilikom preuzimanja podataka:', error);
    } finally {
      setIsLoading(false);
    }
  };

  
  
  const handleScroll = (event: Event) => {
    const target = event.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
  
    if (scrollTop === 0 && currentPage > 1) {
      const previousPage = currentPage - 1;
      setCurrentPage(previousPage);
      fetchData(previousPage, 'backward', 'default');
    }
  
    if (scrollTop + clientHeight >= scrollHeight && currentPage < lastPage) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchData(nextPage, 'forward', 'default');
    }
  };

  useEffect(() => {
    fetchData(currentPage, 'forward', 'default');

    const scrollContainer = document.getElementById('scrollableDiv');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [currentPage, refresh]);

  useEffect(() => {
    fetchData(currentPage, 'forward', 'filter');
  }, [refetchTrigger]);

  return (
    <>
      {isLoading && <Loader delay={0} />}
    </>
  );
};

export default DataFetcher;
