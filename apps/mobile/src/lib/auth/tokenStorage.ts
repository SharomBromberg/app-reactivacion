import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Nunca AsyncStorage (persiste en claro, sin cifrar). En nativo usamos el
// Keychain/Keystore vía expo-secure-store; en web, memoria + sessionStorage
// (se borra al cerrar la pestaña, nunca queda en disco como localStorage).
const SESSION_KEY = 'admin_session';

export type StoredAdminSession = {
  accessToken: string;
  admin: { id: string; name: string; email: string };
};

let memorySession: StoredAdminSession | null | undefined; // undefined = aún no cargada

function getSessionStorage(): Storage | null {
  if (typeof sessionStorage === 'undefined') {
    return null;
  }
  return sessionStorage;
}

export async function saveSession(session: StoredAdminSession): Promise<void> {
  memorySession = session;
  const serialized = JSON.stringify(session);

  if (Platform.OS === 'web') {
    getSessionStorage()?.setItem(SESSION_KEY, serialized);
    return;
  }

  await SecureStore.setItemAsync(SESSION_KEY, serialized);
}

export async function loadSession(): Promise<StoredAdminSession | null> {
  if (memorySession !== undefined) {
    return memorySession;
  }

  const raw =
    Platform.OS === 'web' ? getSessionStorage()?.getItem(SESSION_KEY) : await SecureStore.getItemAsync(SESSION_KEY);

  memorySession = raw ? (JSON.parse(raw) as StoredAdminSession) : null;
  return memorySession;
}

export async function clearSession(): Promise<void> {
  memorySession = null;

  if (Platform.OS === 'web') {
    getSessionStorage()?.removeItem(SESSION_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(SESSION_KEY);
}
