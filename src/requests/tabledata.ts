import { NavigateFunction } from 'react-router-dom';
import createAgent from '../API/agent'; 
import { FmeaInfoResponse, FmeaInfo } from './types';
//import { useFmeaidContext } from '../Context/FmeaidContext';

export const getFmeaInfo = async (
  navigate: NavigateFunction,
  currentPage: number,
  columnName: string,
  selectedValues: string[],
): Promise<FmeaInfoResponse> => {
  try {
    const agent = createAgent(navigate);

    // Kreiranje query parametara
    const params = new URLSearchParams();
    params.append("page", currentPage.toString()); // Dodavanje parametra za stranicu

    // Dodavanje filtera sa nazivom kolone
    selectedValues.forEach(filter => {
      params.append(`${columnName}[]`, filter); // Dodavanje filtera u uglastim zagradama
    });

    console.log("Kreirani query parametri:", params.toString()); // Provera kreiranih parametara

    // Slanje GET zahteva sa query parametrima
    const response = await agent.api.get(`/fmeaInfo/1`, 
      params, // Prosleđujemo query parametre
    );

    console.log(`API odgovor za stranicu ${currentPage}:`, response.data);
    return response.data as FmeaInfoResponse;
  } catch (error) {
    console.error(`Greška prilikom preuzimanja podataka za stranicu ${currentPage}:`, error);
    throw error;
  }
};

// Funkcija za brisanje postojećeg FmeaInfo po ID-u
export const deleteFmeaInfo = async (
  navigate: NavigateFunction,
  fmeaInfoId: number
): Promise<void> => {
  try {
    const agent = createAgent(navigate);
    await agent.api.delete(`/risk/${fmeaInfoId}`);
  } catch (error) {
    console.error(`Greška prilikom brisanja FmeaInfo sa ID-jem ${fmeaInfoId}:`, error);
    throw error;
  }
};

// Funkcija za ažuriranje postojećeg FmeaInfo po ID-u koristeći PATCH
export const updateFmeaInfo = async (
  navigate: NavigateFunction,
  fmeaInfoId: number, 
  updatedFmeaInfo: Partial<Omit<FmeaInfo, 'created_at' | 'updated_at' | 'resource' | 'action_plans' | 'classification' | 'costs'>>
): Promise<FmeaInfo> => {
  try {
    const agent = createAgent(navigate);
    const response = await agent.api.patch(`/risk/${fmeaInfoId}`, updatedFmeaInfo);
    return response.data as FmeaInfo;
  } catch (error) {
    console.error(`Greška prilikom ažuriranja FmeaInfo sa ID-jem ${fmeaInfoId}:`, error);
    throw error;
  }
};

export const insertFmeaInfo = async (
  navigate: NavigateFunction,
  fmeaInfoData: Record<string, any>
): Promise<void> => {
  try {
    const agent = createAgent(navigate);
    console.log("Podaci za slanje:", fmeaInfoData); // Dodato za proveru
    const response = await agent.api.post('/risk', fmeaInfoData);
    console.log("Odgovor sa servera:", response); // Dodato za proveru odgovora
  } catch (error) {
    console.error('Greška prilikom umetanja novog FmeaInfo:', error);
    throw error;
  }
};


export const fetchCausesForMItem = async (
  navigate: NavigateFunction,
  selectedItem: string | string[]
) => {
  try {
    const agent = createAgent(navigate);

    // Proverite da li je `selectedItem` niz. Ako nije, konvertujte ga u niz.
    const selectedItemsArray = Array.isArray(selectedItem) ? selectedItem : [selectedItem];

    // Pretvorite niz u string za query parametar
    const queryParams = selectedItemsArray.map(item => `selectedItems[]=${encodeURIComponent(item)}`).join('&');

    const response = await agent.api.get(`/resources?${queryParams}`);
    return response.data as { name: string; id: number }[];
  } catch (error) {
    console.error("Error fetching causes for selected item:", error); 
    throw error;
  }
};


export const fetchCausesForActionVerifierItem = async (
  navigate: NavigateFunction,
  selectedItem: string
) => {
  try {
    const agent = createAgent(navigate);
    const response = await agent.api.get(`/fmeaTeam/1/${selectedItem}`);
    
    if (Array.isArray(response)) {
      return response as { name: string; id: number }[];
    } else {
      console.error("API odgovor nije niz ili je prazan:", response);
      return [];
    }
  } catch (error) {
    console.error("Greška pri preuzimanju podataka:", error);
    throw error;
  }
};

export const fetchCausesForProcessItem = async (
  navigate: NavigateFunction,
  selectedItem: string
) => {
  try {
    const agent = createAgent(navigate);
    const response = await agent.api.get(`/process/${selectedItem}`);

    if (Array.isArray(response.data)) {
      return response.data as { processItem: string; id: number }[]; // Vraćamo response.data, ne ceo response
    } else {
      console.error("API odgovor nije niz ili je prazan:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Greška pri preuzimanju podataka:", error);
    throw error;
  }
};

export const fetchCausesForClassificationItem = async (
  navigate: NavigateFunction,
  selectedItem: string
) => {
  try {
    const agent = createAgent(navigate);
    const response = await agent.api.get(`/getClassificationsForFmea/1${selectedItem}`);

    if (Array.isArray(response.data)) {
      // Define the type of each item in the map function
      return response.data.map((item: { label: string; id: number }) => ({
        label: item.label,
        id: item.id,
      }));
    } else {
      console.error("API odgovor nije niz ili je prazan:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Greška pri preuzimanju podataka:", error);
    throw error;
  }
};

export const fetchCausesForColumnValuesItem = async (
  navigate: NavigateFunction,
  columnName: string
): Promise<string[]> => {
  try {
    const agent = createAgent(navigate);

    // Kreiraj URL sa query parametrom
    const params = new URLSearchParams();
    params.append("column", columnName); // Dodaj columnName kao query parametar
    console.log("Ime kolone: ", columnName);
    // Pošalji GET zahtev sa query parametrima
    const response = await agent.api.get(`/fmea/getColumnValues`, params);

    // Proveri da li je odgovor validan niz
    if (Array.isArray(response.data)) {
      return response.data; // Vrati niz podataka
    } else {
      console.error("API odgovor nije niz ili je prazan:", response.data);
      return []; // Vrati prazan niz ako podaci nisu validni
    }
  } catch (error) {
    console.error("Greška prilikom preuzimanja podataka:", error);
    throw error; // Ponovo izbaci grešku za rukovanje na višem nivou
  }
};












