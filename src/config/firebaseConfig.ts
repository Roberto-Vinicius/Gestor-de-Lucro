/**
 * @file firebaseConfig.ts
 * @description Inicialização do Firebase com suporte a cache offline.
 *
 * ⚠️  IMPORTANTE — SEGURANÇA:
 * Em produção, substitua os valores literais por variáveis de ambiente.
 * Use expo-constants com app.config.ts para injetar process.env.
 * Nunca comite credenciais reais no repositório.
 *
 * @see https://docs.expo.dev/guides/environment-variables/
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// ─── Credenciais (App Web — Firebase JS SDK) ─────────────────────────────────
const firebaseConfig = {
  apiKey: 'AIzaSyBJRE1K8hDLje6Ile_r4w26lpYuv4exO_c',
  authDomain: 'firestore-69148.firebaseapp.com',
  projectId: 'firestore-69148',
  storageBucket: 'firestore-69148.firebasestorage.app',
  messagingSenderId: '859583818059',
  appId: '1:859583818059:web:86980e975baf560b9ba0ce',
  measurementId: 'G-133C6XFJ59', // opcional — Analytics
};

// ─── Inicialização (Hot-Reload Safe) ─────────────────────────────────────────
// Garante que o Firebase não seja inicializado múltiplas vezes durante o
// hot reload do Expo, o que causaria o erro "App already exists".
const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ─── Firestore ───────────────────────────────────────────────────────────────
const db: Firestore = getFirestore(app);

export { app, db };
