export interface ABCCardData {
  id: string;
  patientId: string;
  date: string; // ISO 8601
  antecedent: string;
  behavior: string;
  consequence: string;
  intensity?: number;
}

export function isABCCardData(data: unknown): data is ABCCardData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data && typeof (data as any).id === 'string' &&
    'patientId' in data && typeof (data as any).patientId === 'string' &&
    'date' in data && typeof (data as any).date === 'string' &&
    'antecedent' in data && typeof (data as any).antecedent === 'string' &&
    'behavior' in data && typeof (data as any).behavior === 'string' &&
    'consequence' in data && typeof (data as any).consequence === 'string' &&
    ( !("intensity" in data) || typeof (data as any).intensity === 'number')
  );
}
