import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { User, Reminder, Playlist, Quiz, StudyPlan, ApiResponse } from '../types';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-domain",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-bucket",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "demo-sender",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Authentication Functions
export const signInWithGoogle = async (): Promise<ApiResponse<User>> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;
    
    // Create user document in Firestore
    const userData: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || undefined,
      createdAt: new Date(),
      preferences: {
        theme: 'system',
        notifications: true,
        defaultSnoozeTime: 10,
        studyGoal: 2, // 2 hours per day
        reminderSound: 'default',
      },
    };
    
    await setDoc(doc(db, 'users', firebaseUser.uid), userData);
    
    return { success: true, data: userData };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: 'Failed to sign in with Google' };
  }
};

export const signOutUser = async (): Promise<ApiResponse<void>> => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: 'Failed to sign out' };
  }
};

export const getCurrentUser = (): Promise<FirebaseUser | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const getUserData = async (userId: string): Promise<ApiResponse<User>> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() as User };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Get user data error:', error);
    return { success: false, error: 'Failed to get user data' };
  }
};

export const updateUserData = async (userId: string, updates: Partial<User>): Promise<ApiResponse<void>> => {
  try {
    await updateDoc(doc(db, 'users', userId), updates);
    return { success: true };
  } catch (error) {
    console.error('Update user data error:', error);
    return { success: false, error: 'Failed to update user data' };
  }
};

// Reminder Functions
export const createReminder = async (userId: string, reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Reminder>> => {
  try {
    const reminderData = {
      ...reminder,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, 'reminders'), reminderData);
    const newReminder = { ...reminder, id: docRef.id, createdAt: new Date(), updatedAt: new Date() };
    
    return { success: true, data: newReminder };
  } catch (error) {
    console.error('Create reminder error:', error);
    return { success: false, error: 'Failed to create reminder' };
  }
};

export const updateReminder = async (reminderId: string, updates: Partial<Reminder>): Promise<ApiResponse<void>> => {
  try {
    await updateDoc(doc(db, 'reminders', reminderId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Update reminder error:', error);
    return { success: false, error: 'Failed to update reminder' };
  }
};

export const deleteReminder = async (reminderId: string): Promise<ApiResponse<void>> => {
  try {
    await deleteDoc(doc(db, 'reminders', reminderId));
    return { success: true };
  } catch (error) {
    console.error('Delete reminder error:', error);
    return { success: false, error: 'Failed to delete reminder' };
  }
};

export const getUserReminders = async (userId: string): Promise<ApiResponse<Reminder[]>> => {
  try {
    const q = query(
      collection(db, 'reminders'),
      where('userId', '==', userId),
      orderBy('dueDate', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const reminders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Reminder[];
    
    return { success: true, data: reminders };
  } catch (error) {
    console.error('Get reminders error:', error);
    return { success: false, error: 'Failed to get reminders' };
  }
};

// Playlist Functions
export const createPlaylist = async (userId: string, playlist: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Playlist>> => {
  try {
    const playlistData = {
      ...playlist,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, 'playlists'), playlistData);
    const newPlaylist = { ...playlist, id: docRef.id, createdAt: new Date(), updatedAt: new Date() };
    
    return { success: true, data: newPlaylist };
  } catch (error) {
    console.error('Create playlist error:', error);
    return { success: false, error: 'Failed to create playlist' };
  }
};

export const updatePlaylist = async (playlistId: string, updates: Partial<Playlist>): Promise<ApiResponse<void>> => {
  try {
    await updateDoc(doc(db, 'playlists', playlistId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Update playlist error:', error);
    return { success: false, error: 'Failed to update playlist' };
  }
};

export const deletePlaylist = async (playlistId: string): Promise<ApiResponse<void>> => {
  try {
    await deleteDoc(doc(db, 'playlists', playlistId));
    return { success: true };
  } catch (error) {
    console.error('Delete playlist error:', error);
    return { success: false, error: 'Failed to delete playlist' };
  }
};

export const getUserPlaylists = async (userId: string): Promise<ApiResponse<Playlist[]>> => {
  try {
    const q = query(
      collection(db, 'playlists'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const playlists = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Playlist[];
    
    return { success: true, data: playlists };
  } catch (error) {
    console.error('Get playlists error:', error);
    return { success: false, error: 'Failed to get playlists' };
  }
};

// Quiz Functions
export const createQuiz = async (userId: string, quiz: Omit<Quiz, 'id' | 'createdAt'>): Promise<ApiResponse<Quiz>> => {
  try {
    const quizData = {
      ...quiz,
      userId,
      createdAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, 'quizzes'), quizData);
    const newQuiz = { ...quiz, id: docRef.id, createdAt: new Date() };
    
    return { success: true, data: newQuiz };
  } catch (error) {
    console.error('Create quiz error:', error);
    return { success: false, error: 'Failed to create quiz' };
  }
};

export const updateQuiz = async (quizId: string, updates: Partial<Quiz>): Promise<ApiResponse<void>> => {
  try {
    await updateDoc(doc(db, 'quizzes', quizId), updates);
    return { success: true };
  } catch (error) {
    console.error('Update quiz error:', error);
    return { success: false, error: 'Failed to update quiz' };
  }
};

export const deleteQuiz = async (quizId: string): Promise<ApiResponse<void>> => {
  try {
    await deleteDoc(doc(db, 'quizzes', quizId));
    return { success: true };
  } catch (error) {
    console.error('Delete quiz error:', error);
    return { success: false, error: 'Failed to delete quiz' };
  }
};

export const getUserQuizzes = async (userId: string): Promise<ApiResponse<Quiz[]>> => {
  try {
    const q = query(
      collection(db, 'quizzes'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const quizzes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Quiz[];
    
    return { success: true, data: quizzes };
  } catch (error) {
    console.error('Get quizzes error:', error);
    return { success: false, error: 'Failed to get quizzes' };
  }
};

// Study Plan Functions
export const createStudyPlan = async (userId: string, plan: Omit<StudyPlan, 'id' | 'createdAt'>): Promise<ApiResponse<StudyPlan>> => {
  try {
    const planData = {
      ...plan,
      userId,
      createdAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, 'studyPlans'), planData);
    const newPlan = { ...plan, id: docRef.id, createdAt: new Date() };
    
    return { success: true, data: newPlan };
  } catch (error) {
    console.error('Create study plan error:', error);
    return { success: false, error: 'Failed to create study plan' };
  }
};

export const updateStudyPlan = async (planId: string, updates: Partial<StudyPlan>): Promise<ApiResponse<void>> => {
  try {
    await updateDoc(doc(db, 'studyPlans', planId), updates);
    return { success: true };
  } catch (error) {
    console.error('Update study plan error:', error);
    return { success: false, error: 'Failed to update study plan' };
  }
};

export const deleteStudyPlan = async (planId: string): Promise<ApiResponse<void>> => {
  try {
    await deleteDoc(doc(db, 'studyPlans', planId));
    return { success: true };
  } catch (error) {
    console.error('Delete study plan error:', error);
    return { success: false, error: 'Failed to delete study plan' };
  }
};

export const getUserStudyPlans = async (userId: string): Promise<ApiResponse<StudyPlan[]>> => {
  try {
    const q = query(
      collection(db, 'studyPlans'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const plans = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as StudyPlan[];
    
    return { success: true, data: plans };
  } catch (error) {
    console.error('Get study plans error:', error);
    return { success: false, error: 'Failed to get study plans' };
  }
};

// Real-time listeners
export const subscribeToReminders = (userId: string, callback: (reminders: Reminder[]) => void) => {
  const q = query(
    collection(db, 'reminders'),
    where('userId', '==', userId),
    orderBy('dueDate', 'asc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const reminders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Reminder[];
    callback(reminders);
  });
};

export const subscribeToPlaylists = (userId: string, callback: (playlists: Playlist[]) => void) => {
  const q = query(
    collection(db, 'playlists'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const playlists = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Playlist[];
    callback(playlists);
  });
};

export { auth, db };