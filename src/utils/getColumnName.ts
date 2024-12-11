export const getColumnName = (columnIndex: number): string => {
    const columnName = (() => {
      switch (columnIndex) {
        case 0: return "processItem";
        case 1: return "processStep";
        case 2: return "resource_type";
        case 3: return "resource_name";
        case 4: return "FEYourPlant_FEShipToPlant_FEEndUser";
        case 5: return "FM";
        case 6: return "cause";
        case 7: return "processStepFunctionYourPlant_processStepFunctionShipToPlant_processStepFunctionEndUser";
        case 8: return "processStepFunction_processCharacteristicsFunction";
        case 9: return "processWorkElementFunction";
        case 10: return "S";
        case 11: return "O";
        case 12: return "D";
        case 13: return "AP";
        case 14: return "classification_label";
        case 15: return "riskMeasurements_name";
        case 16: return "riskMeasurements_description";
        case 17: return "action_plans_type";
        case 18: return "action_plans_action";
        case 19: return "action_plans_inCharge";
        case 20: return "action_plans_verifier";
        case 21: return "action_plans_startDate";
        case 22: return "action_plans_endDate";
        case 23: return "action_plans_completed_date";
        case 24: return "action_plans_costOfAction";
        case 25: return "action_plans_S";
        case 26: return "action_plans_O";
        case 27: return "action_plans_D";
        case 28: return "comment";
        default: return `Kolona ${columnIndex + 1}`;
      }
    })();
    return columnName;
  };
  