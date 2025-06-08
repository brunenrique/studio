// Caminho: src/lib/patient-utils.ts

import { Patient } from "@/lib/types"; // CORREÇÃO 1: Removido o 'type'
import { encrypt, decrypt } from "./patientCrypto";

// ============================================================================
// ÁREA DE CONFIGURAÇÃO DA CRIPTOGRAFIA
// ============================================================================

// CORREÇÃO 2: Tipagem da constante simplificada para evitar erros de parsing.
const SENSITIVE_PATIENT_FIELDS = [
  'contact',
  'cpf',
  'dateOfBirth',
  'sessionNotes',
  'treatmentPlan'
];

// ============================================================================
// FUNÇÕES DE UTILIDADE (EXPORTADAS PARA USO EM TODO O APP)
// ============================================================================

/**
 * Recebe um objeto de paciente com dados limpos e retorna um novo objeto
 * com todos os campos sensíveis (definidos em SENSITIVE_PATIENT_FIELDS) criptografados.
 */
export const encryptPatientObject = (patient: Patient): Patient => {
  const securePatient = { ...patient };

  for (const field of SENSITIVE_PATIENT_FIELDS) {
    // CORREÇÃO 3: Acesso dinâmico à propriedade usando 'as any'
    const value = (securePatient as any)[field];

    if (value !== null && value !== undefined) {
      // Transforma objetos/arrays em string JSON antes de criptografar
      const valueToEncrypt = typeof value === 'string' ? value : JSON.stringify(value);
      (securePatient as any)[field] = encrypt(valueToEncrypt);
    }
  }
  return securePatient;
};

/**
 * Recebe um objeto de paciente com dados criptografados e retorna um novo objeto
 * com todos os campos sensíveis descriptografados e prontos para exibição.
 */
export const decryptPatientObject = (patient: Patient): Patient => {
  const plainPatient = { ...patient };

  for (const field of SENSITIVE_PATIENT_FIELDS) {
    // CORREÇÃO 3: Acesso dinâmico à propriedade usando 'as any'
    const value = (plainPatient as any)[field] as string | undefined;

    if (value) {
      try {
        const decryptedValue = decrypt(value);
        // Tenta converter de volta para objeto/array. Se falhar, usa como string.
        try {
          (plainPatient as any)[field] = JSON.parse(decryptedValue);
        } catch {
          (plainPatient as any)[field] = decryptedValue;
        }
      } catch (e) {
        console.error(`Falha ao descriptografar o campo '${String(field)}' do paciente ${patient.id}.`);
        // Mantém o valor criptografado para não quebrar a aplicação.
      }
    }
  }
  return plainPatient;
};