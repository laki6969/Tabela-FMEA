import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { RowIdsProvider } from './Context/RowIdsContext';
import { ToolProvider } from './Context/ToolContext';
import { UpdateProvider } from './Context/UpdateContext';
import { DataFetcherContextProvider } from './Context/DataFetcherContext';
import { ColumnProvider } from './Context/ColumnContext';
import { RefreshProvider } from './Context/RefreshContext';
import { NewRowsProvider } from './Context/NewRowsContext';
import { TypeValueProvider } from './Context/TypeValueContext';
import { FmeaidProvider } from './Context/FmeaidContext';
import { PaginationProvider } from './Context/PaginationContext';
import { ColumnNameProvider } from './Context/ColumnNameContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <RefreshProvider>
                <ColumnProvider>
                    <DataFetcherContextProvider>
                        <RowIdsProvider>
                            <ToolProvider>
                                <UpdateProvider>
                                    <NewRowsProvider>
                                        <TypeValueProvider>
                                            <FmeaidProvider>
                                                <PaginationProvider>
                                                    <ColumnNameProvider>
                                                        <App />
                                                    </ColumnNameProvider>
                                                </PaginationProvider>
                                            </FmeaidProvider>
                                        </TypeValueProvider>
                                    </NewRowsProvider>
                                </UpdateProvider>
                            </ToolProvider>
                        </RowIdsProvider>
                    </DataFetcherContextProvider>
                </ColumnProvider>
            </RefreshProvider>
        </BrowserRouter>
    </React.StrictMode>
);
