import { initializeApp, getApps, getApp } from "firebase/app";
import type { FirebaseOptions } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
 apiKey: "AIzaSyA5IxEXkzpIr--BFOpL0nwJkh6rvQ2I8PA",
 authDomain: "studio3-bhc.firebaseapp.com",
 projectId: "studio3-bhc",
 storageBucket: "studio3-bhc.firebasestorage.app",
 messagingSenderId: "130897822034",
 appId: "1:130897822034:web:9322f7e49df20ad1e8ba8b"
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

// Connect to Firebase emulators in development mode
if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, `http://127.0.0.1:9100`);
  connectFirestoreEmulator(db, '127.0.0.1', 8081);
}

