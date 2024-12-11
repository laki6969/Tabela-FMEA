export interface FmeaInfoResponse {
    total: number; // Ukupan broj redova
    data: FmeaInfo[]; // Niz objekata sa podacima
  }
  
  // Interfejs za pojedinačne podatke FmeaInfo
  export interface FmeaInfo {
    id: number;
    fmea_id: number;
    processItem: string;
    processStep: string;
    cause: string;
    processStepFunctionYourPlant: string;
    processStepFunctionShipToPlant: string;
    processStepFunctionEndUser: string;
    processStepFunction: string;
    processCharacteristicsFunction: string;
    processWorkElementFunction: string;
    FEYourPlant: string;
    FEShipToPlant: string;
    FEEndUser: string;
    FM: string;
    resource_type: string;
    resource_id: number;
    S: number;
    O: number;
    D: number;
    AP: string;
    classification_id: number;
    ishikawa_id: number;
    fiveWhy_id: number;
    created_at: string;
    updated_at: string;
    resource: Resource; // Povezani podaci o resursima
    riskMeasurements: RiskMeasurement[]; // Niz merenja rizika
    action_plans: ActionPlan[]; // Niz akcionih planova
    classification: Classification; // Klasifikacija
    costs: Cost[]; // Troškovi
    effect: string; // Efekat
    errorNo: string; // Broj greške
    sumCosts: number; // Suma troškova
    comment: string; // Komentar
    resource_name: string; // Ime resursa
  }
  
  // Interfejsi za povezane entitete
  export interface Resource {
    id: number;
    name: string;
    position: string;
    shift: number;
    superiors: number;
    yearsOfExperience: number;
    comment: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface RiskMeasurement {
    id: number;
    name: string;
    description: string;
  }
  
  export interface ActionPlan {
    id: number;
    type: string;
    name: string;
    action: string;
    verifier: string;
    inCharge: number;
    costOfAction: number;
    status: string | null;
    S: number;
    O: number;
    D: number;
    AP: string;
    startDate: string;
    endDate: string;
    created_at: string;
    updated_at: string;
    implementationTime: string;
    repetitionNo: string;
    actualDate: string;
    completed_date: string;
  }
  
  export interface Classification {
    id: number;
    label: string;
    description: string;
    internal: string;
    S: string;
    characteristic_id: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface Cost {
    id: number;
    cost: string;
    description: string;
    risk_id: number;
    created_at: string;
    updated_at: string;
  }

  export interface FmeaInfoResponse {
    total: number; // Ukupan broj redova
    data: FmeaInfo[]; // Niz objekata sa podacima
    last_page: number; // Poslednja stranica (dodato)
    current_page: number; // Trenutna stranica (dodato)
    per_page: number; // Broj redova po stranici (dodato)
  }
  
  
  