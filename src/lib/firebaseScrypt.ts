// src/lib/firebaseClient.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Configuração do Firebase buscando as variáveis de ambiente
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Verifica se todas as chaves de configuração necessárias estão presentes
const requiredConfigKeys = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
];
const missingKeys = requiredConfigKeys.filter(
  (key) => !firebaseConfig[key as keyof typeof firebaseConfig]
);

if (missingKeys.length > 0) {
  console.error(
    "ERRO CRÍTICO: Configuração do Firebase faltando ou indefinida para as seguintes chaves. Verifique seu arquivo .env.local e os prefixos NEXT_PUBLIC_FIREBASE_:",
    missingKeys
  );
  console.error("Valores atuais lidos para firebaseConfig:", firebaseConfig);
}

let app;
// Inicializa o Firebase de forma segura para evitar reinicialização
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// export { app }; // Descomente se precisar da instância 'app' diretamente

// Connect to emulators during local development
if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9100');
  connectFirestoreEmulator(db, '127.0.0.1', 8081);
  connectStorageEmulator(storage, '127.0.0.1', 9199);
}
