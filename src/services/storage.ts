import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  session: '@pitzone/session',
  profile: '@pitzone/profile',
} as const;

export type AuthSession = {
  email: string;
  remember: boolean;
  createdAt: string;
};

export type StoredProfile = {
  name: string;
  email: string;
};

async function readJson<T>(key: string): Promise<T | null> {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) as T : null;
}

async function writeJson<T>(key: string, value: T) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function getAuthSession() {
  return readJson<AuthSession>(KEYS.session);
}

export async function saveAuthSession(session: AuthSession) {
  if (session.remember) {
    await writeJson(KEYS.session, session);
  } else {
    await AsyncStorage.removeItem(KEYS.session);
  }
}

export async function clearAuthSession() {
  await AsyncStorage.removeItem(KEYS.session);
}

export async function getProfile() {
  return readJson<StoredProfile>(KEYS.profile);
}

export async function saveProfile(profile: StoredProfile) {
  await writeJson(KEYS.profile, profile);
}
