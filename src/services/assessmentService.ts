import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Assessment } from '@/lib/types';

const assessmentsCollection = collection(db, 'assessments');

/**
 * @description Busca todas as avaliações associadas a um paciente específico.
 * @param {string} patientId - O ID do paciente para o qual as avaliações serão buscadas.
 * @returns {Promise<Assessment[]>} Uma promessa que resolve para um array de objetos de avaliação.
 */
export const getAssessmentsByPatientId = async (patientId: string): Promise<Assessment[]> => {
  const q = query(assessmentsCollection, where('patientId', '==', patientId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Assessment));
};

/**
 * @description Busca uma única avaliação pelo seu ID específico.
 * @param {string} assessmentId - O ID da avaliação a ser buscada.
 * @returns {Promise<Assessment | null>} Uma promessa que resolve para o objeto da avaliação ou nulo se não for encontrado.
 */
export const getAssessmentById = async (assessmentId: string): Promise<Assessment | null> => {
  const docRef = doc(db, 'assessments', assessmentId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Assessment;
  }
  return null;
};

/**
 * @description Cria um novo registro de avaliação no Firestore.
 * @param {Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>} assessmentData - Os dados da avaliação a ser criada, omitindo campos gerados automaticamente.
 * @returns {Promise<string>} Uma promessa que resolve para o ID da nova avaliação criada.
 */
export const createAssessment = async (assessmentData: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await addDoc(assessmentsCollection, {
    ...assessmentData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * @description Atualiza uma avaliação existente no Firestore.
 * @param {string} assessmentId - O ID da avaliação a ser atualizada.
 * @param {Partial<Omit<Assessment, 'id' | 'createdAt'>>} updates - Um objeto contendo os campos da avaliação a serem atualizados.
 * @returns {Promise<void>} Uma promessa que é resolvida quando a atualização é concluída.
 */
export const updateAssessment = async (assessmentId: string, updates: Partial<Omit<Assessment, 'id' | 'createdAt'>>): Promise<void> => {
  const docRef = doc(db, 'assessments', assessmentId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

