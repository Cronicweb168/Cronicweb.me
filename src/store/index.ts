import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Reminder, 
  User, 
  YouTubePlaylist, 
  StudyPlan, 
  Quiz, 
  StudyStats 
} from '../types';

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Theme state
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Reminders state
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
  updateReminder: (id: string, reminder: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminderComplete: (id: string) => void;
  
  // YouTube playlists state
  playlists: YouTubePlaylist[];
  addPlaylist: (playlist: YouTubePlaylist) => void;
  updatePlaylist: (id: string, playlist: Partial<YouTubePlaylist>) => void;
  deletePlaylist: (id: string) => void;
  toggleVideoWatched: (playlistId: string, videoId: string) => void;
  updateVideoProgress: (playlistId: string, videoId: string, position: number) => void;
  
  // Study plans state
  studyPlans: StudyPlan[];
  addStudyPlan: (plan: StudyPlan) => void;
  deleteStudyPlan: (id: string) => void;
  
  // Quizzes state
  quizzes: Quiz[];
  addQuiz: (quiz: Quiz) => void;
  updateQuiz: (id: string, quiz: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
  
  // Stats state
  stats: StudyStats | null;
  updateStats: (stats: StudyStats) => void;
  
  // UI state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      theme: 'system',
      reminders: [],
      playlists: [],
      studyPlans: [],
      quizzes: [],
      stats: null,
      isLoading: false,
      selectedDate: new Date(),
      
      // User actions
      setUser: (user) => set({ user }),
      
      // Theme actions
      setTheme: (theme) => set({ theme }),
      
      // Reminder actions
      addReminder: (reminder) => 
        set((state) => ({ reminders: [...state.reminders, reminder] })),
      
      updateReminder: (id, updates) =>
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, ...updates, updatedAt: new Date() } : r
          ),
        })),
      
      deleteReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        })),
      
      toggleReminderComplete: (id) =>
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id 
              ? { ...r, completed: !r.completed, updatedAt: new Date() } 
              : r
          ),
        })),
      
      // YouTube playlist actions
      addPlaylist: (playlist) =>
        set((state) => ({ playlists: [...state.playlists, playlist] })),
      
      updatePlaylist: (id, updates) =>
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      
      deletePlaylist: (id) =>
        set((state) => ({
          playlists: state.playlists.filter((p) => p.id !== id),
        })),
      
      toggleVideoWatched: (playlistId, videoId) =>
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId
              ? {
                  ...p,
                  videos: p.videos.map((v) =>
                    v.id === videoId ? { ...v, watched: !v.watched } : v
                  ),
                  watchedCount: p.videos.filter((v) =>
                    v.id === videoId ? !v.watched : v.watched
                  ).length,
                }
              : p
          ),
        })),
      
      updateVideoProgress: (playlistId, videoId, position) =>
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId
              ? {
                  ...p,
                  videos: p.videos.map((v) =>
                    v.id === videoId ? { ...v, playbackPosition: position } : v
                  ),
                }
              : p
          ),
        })),
      
      // Study plan actions
      addStudyPlan: (plan) =>
        set((state) => ({ studyPlans: [...state.studyPlans, plan] })),
      
      deleteStudyPlan: (id) =>
        set((state) => ({
          studyPlans: state.studyPlans.filter((p) => p.id !== id),
        })),
      
      // Quiz actions
      addQuiz: (quiz) =>
        set((state) => ({ quizzes: [...state.quizzes, quiz] })),
      
      updateQuiz: (id, updates) =>
        set((state) => ({
          quizzes: state.quizzes.map((q) =>
            q.id === id ? { ...q, ...updates } : q
          ),
        })),
      
      deleteQuiz: (id) =>
        set((state) => ({
          quizzes: state.quizzes.filter((q) => q.id !== id),
        })),
      
      // Stats actions
      updateStats: (stats) => set({ stats }),
      
      // UI actions
      setIsLoading: (isLoading) => set({ isLoading }),
      setSelectedDate: (selectedDate) => set({ selectedDate }),
    }),
    {
      name: 'study-reminder-storage',
      partialize: (state) => ({
        theme: state.theme,
        reminders: state.reminders,
        playlists: state.playlists,
        studyPlans: state.studyPlans,
        quizzes: state.quizzes,
      }),
    }
  )
);