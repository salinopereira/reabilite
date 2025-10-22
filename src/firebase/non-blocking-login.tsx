'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

// As funções aqui não estão sendo usadas ativamente no fluxo de login/signup atual,
// que chama as funções do SDK diretamente nos componentes.
// Mantido para referência ou uso futuro em fluxos não-bloqueantes.
