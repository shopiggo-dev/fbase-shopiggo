// src/lib/firebaseClient.ts
import { app } from './firebase';
import type { Auth } from 'firebase/auth';

/**
 * Client-only helpers — NEVER import at module top in server files.
 * Use these from "use client" components ONLY.
 */
export function getClientAuth(): Auth {
  if (typeof window === 'undefined') {
    // This is a mock auth object for the server-side build
    return {} as Auth;
  }
  // require() to avoid bundling on the server
  const { getAuth } = require('firebase/auth');
  return getAuth(app);
}
