/* istanbul ignore file */
import { format, addDays } from "date-fns";
import type { Patient, /* ...outros tipos */ } from "@/lib/types";

// --- IMPORTAÇÃO ATUALIZADA ---
// Agora importa as funções de utilidade do novo arquivo central.
import { encryptPatientObject, decryptPatientObject } from "./patient-utils"; 
// ----------------------------

// ... (todo o resto do seu arquivo mock-data.ts permanece o mesmo,
// pois ele já usa as funções que agora estão sendo importadas) ...