import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseError, getApp, getApps, initializeApp } from 'firebase/app';
import {
  Auth,
  Persistence,
  createUserWithEmailAndPassword,
  getAuth,
  initializeAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'api_Key',
  authDomain: 'auth_Domain',
  projectId: 'project_Id',
  storageBucket: 'storage_Bucket',
  messagingSenderId: 'messagingSender_Id',
  appId: 'app_Id',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const reactNativePersistence = {
  type: 'LOCAL' as const,
  _isAvailable: async () => true,
  _set: async (key: string, value: unknown) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  _get: async <T>(key: string): Promise<T | null> => {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) as T : null;
  },
  _remove: async (key: string) => {
    await AsyncStorage.removeItem(key);
  },
  _addListener: () => undefined,
  _removeListener: () => undefined,
} as unknown as Persistence;

let auth: Auth;
try {
  auth = initializeAuth(app, { persistence: reactNativePersistence });
} catch {
  auth = getAuth(app);
}

export const firebaseAuth = auth;
export const firestore: Firestore = getFirestore(app);

export type FirebaseUserData = { name: string; email: string; uid: string };

export function firebaseErrorMessage(error: unknown) {
  if (!(error instanceof FirebaseError)) return 'Não foi possível concluir a operação. Tente novamente.';
  const messages: Record<string, string> = {
    'auth/invalid-credential': 'E-mail ou senha inválidos.',
    'auth/invalid-email': 'Informe um e-mail válido.',
    'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
    'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
    'auth/network-request-failed': 'Sem conexão com a internet.',
  };
  return messages[error.code] ?? 'Não foi possível concluir a operação. Tente novamente.';
}

export async function registerFirebaseUser(name: string, email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
  await updateProfile(credential.user, { displayName: name.trim() });
  await setDoc(doc(firestore, 'users', credential.user.uid), {
    uid: credential.user.uid,
    name: name.trim(),
    email: credential.user.email,
    createdAt: serverTimestamp(),
  });
  return credential.user;
}

export async function loginFirebaseUser(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
  return credential.user;
}

export async function logoutFirebaseUser() {
  await signOut(auth);
}

export async function getFirebaseProfile(uid: string) {
  const snapshot = await getDoc(doc(firestore, 'users', uid));
  return snapshot.exists() ? (snapshot.data() as FirebaseUserData) : null;
}

export async function saveUserDocument(collectionName: string, data: Record<string, unknown>, id?: string) {
  const user = auth.currentUser;
  if (!user) return;
  const reference = id
    ? doc(firestore, 'users', user.uid, collectionName, id)
    : doc(collection(firestore, 'users', user.uid, collectionName));
  await setDoc(reference, { ...data, userId: user.uid, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getUserDocuments<T>(collectionName: string) {
  const user = auth.currentUser;
  if (!user) return [];
  const snapshot = await getDocs(collection(firestore, 'users', user.uid, collectionName));
  return snapshot.docs.map((item) => item.data() as T);
}
