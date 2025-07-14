import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  User, 
  Reminder, 
  Playlist, 
  Quiz, 
  StudyPlan, 
  ThemeState, 
  NavigationState, 
  NotificationState, 
  AppNotification, 
  StudyStats,
  UserPreferences 
} from '../types';

// User and Authentication State
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  clearError: () => void;
  logout: () => void;
}

// Reminder State
interface ReminderState {
  reminders: Reminder[];
  isLoading: boolean;
  error: string | null;
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminderComplete: (id: string) => void;
  setReminders: (reminders: Reminder[]) => void;
  clearError: () => void;
}

// Playlist State
interface PlaylistState {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  isLoading: boolean;
  error: string | null;
  addPlaylist: (playlist: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void;
  deletePlaylist: (id: string) => void;
  setCurrentPlaylist: (playlist: Playlist | null) => void;
  markVideoWatched: (playlistId: string, videoId: string) => void;
  updateVideoProgress: (playlistId: string, videoId: string, progress: number) => void;
  setPlaylists: (playlists: Playlist[]) => void;
  clearError: () => void;
}

// Quiz State
interface QuizState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  isLoading: boolean;
  error: string | null;
  addQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => void;
  updateQuiz: (id: string, updates: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
  setCurrentQuiz: (quiz: Quiz | null) => void;
  setQuizzes: (quizzes: Quiz[]) => void;
  clearError: () => void;
}

// Study Plan State
interface StudyPlanState {
  studyPlans: StudyPlan[];
  currentStudyPlan: StudyPlan | null;
  isLoading: boolean;
  error: string | null;
  addStudyPlan: (plan: Omit<StudyPlan, 'id' | 'createdAt'>) => void;
  updateStudyPlan: (id: string, updates: Partial<StudyPlan>) => void;
  deleteStudyPlan: (id: string) => void;
  setCurrentStudyPlan: (plan: StudyPlan | null) => void;
  setStudyPlans: (plans: StudyPlan[]) => void;
  clearError: () => void;
}

// Theme State
interface ThemeStore {
  theme: ThemeState;
  toggleTheme: () => void;
  setTheme: (theme: ThemeState) => void;
  updatePrimaryColor: (color: string) => void;
}

// Navigation State
interface NavigationStore {
  navigation: NavigationState;
  setActiveTab: (tab: NavigationState['activeTab']) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

// Notification State
interface NotificationStore {
  notifications: NotificationState;
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// Study Stats State
interface StudyStatsState {
  stats: StudyStats;
  isLoading: boolean;
  error: string | null;
  updateStats: (stats: Partial<StudyStats>) => void;
  incrementStudyTime: (minutes: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  addCompletedReminder: () => void;
  addCompletedQuiz: (score: number) => void;
  clearError: () => void;
}

// Combined Store Type
type AppStore = UserState & 
  ReminderState & 
  PlaylistState & 
  QuizState & 
  StudyPlanState & 
  ThemeStore & 
  NavigationStore & 
  NotificationStore & 
  StudyStatsState;

// Utility functions
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const getInitialTheme = (): ThemeState => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return JSON.parse(savedTheme);
  }
  
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return {
    mode: prefersDark ? 'dark' : 'light',
    primaryColor: '#6750A4',
    secondaryColor: '#625B71',
  };
};

const getInitialStats = (): StudyStats => ({
  totalStudyTime: 0,
  streak: 0,
  completedReminders: 0,
  completedQuizzes: 0,
  averageQuizScore: 0,
  weeklyGoalProgress: 0,
  monthlyStats: {
    studyTimeByDay: {},
    completedTasks: 0,
    totalTasks: 0,
    averageDailyStudyTime: 0,
  },
});

// Create the store
export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // User State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      updateUserPreferences: (preferences) => set((state) => ({
        user: state.user ? { ...state.user, preferences: { ...state.user.preferences, ...preferences } } : null,
      })),
      clearError: () => set({ error: null }),
      logout: () => set({ user: null, isAuthenticated: false }),

      // Reminder State
      reminders: [],
      
      addReminder: (reminderData) => {
        const newReminder: Reminder = {
          ...reminderData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ reminders: [...state.reminders, newReminder] }));
      },
      
      updateReminder: (id, updates) => set((state) => ({
        reminders: state.reminders.map(reminder =>
          reminder.id === id ? { ...reminder, ...updates, updatedAt: new Date() } : reminder
        ),
      })),
      
      deleteReminder: (id) => set((state) => ({
        reminders: state.reminders.filter(reminder => reminder.id !== id),
      })),
      
      toggleReminderComplete: (id) => set((state) => ({
        reminders: state.reminders.map(reminder =>
          reminder.id === id ? { ...reminder, completed: !reminder.completed, updatedAt: new Date() } : reminder
        ),
      })),
      
      setReminders: (reminders) => set({ reminders }),

      // Playlist State
      playlists: [],
      currentPlaylist: null,
      
      addPlaylist: (playlistData) => {
        const newPlaylist: Playlist = {
          ...playlistData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ playlists: [...state.playlists, newPlaylist] }));
      },
      
      updatePlaylist: (id, updates) => set((state) => ({
        playlists: state.playlists.map(playlist =>
          playlist.id === id ? { ...playlist, ...updates, updatedAt: new Date() } : playlist
        ),
      })),
      
      deletePlaylist: (id) => set((state) => ({
        playlists: state.playlists.filter(playlist => playlist.id !== id),
        currentPlaylist: state.currentPlaylist?.id === id ? null : state.currentPlaylist,
      })),
      
      setCurrentPlaylist: (playlist) => set({ currentPlaylist: playlist }),
      
      markVideoWatched: (playlistId, videoId) => set((state) => ({
        playlists: state.playlists.map(playlist =>
          playlist.id === playlistId ? {
            ...playlist,
            videos: playlist.videos.map(video =>
              video.id === videoId ? { ...video, watched: true, watchedAt: new Date() } : video
            ),
            watchedCount: playlist.videos.filter(v => v.id === videoId ? true : v.watched).length,
            updatedAt: new Date(),
          } : playlist
        ),
      })),
      
      updateVideoProgress: (playlistId, videoId, progress) => set((state) => ({
        playlists: state.playlists.map(playlist =>
          playlist.id === playlistId ? {
            ...playlist,
            videos: playlist.videos.map(video =>
              video.id === videoId ? { ...video, lastPlaybackPosition: progress } : video
            ),
            updatedAt: new Date(),
          } : playlist
        ),
      })),
      
      setPlaylists: (playlists) => set({ playlists }),

      // Quiz State
      quizzes: [],
      currentQuiz: null,
      
      addQuiz: (quizData) => {
        const newQuiz: Quiz = {
          ...quizData,
          id: generateId(),
          createdAt: new Date(),
        };
        set((state) => ({ quizzes: [...state.quizzes, newQuiz] }));
      },
      
      updateQuiz: (id, updates) => set((state) => ({
        quizzes: state.quizzes.map(quiz =>
          quiz.id === id ? { ...quiz, ...updates } : quiz
        ),
      })),
      
      deleteQuiz: (id) => set((state) => ({
        quizzes: state.quizzes.filter(quiz => quiz.id !== id),
        currentQuiz: state.currentQuiz?.id === id ? null : state.currentQuiz,
      })),
      
      setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
      setQuizzes: (quizzes) => set({ quizzes }),

      // Study Plan State
      studyPlans: [],
      currentStudyPlan: null,
      
      addStudyPlan: (planData) => {
        const newPlan: StudyPlan = {
          ...planData,
          id: generateId(),
          createdAt: new Date(),
        };
        set((state) => ({ studyPlans: [...state.studyPlans, newPlan] }));
      },
      
      updateStudyPlan: (id, updates) => set((state) => ({
        studyPlans: state.studyPlans.map(plan =>
          plan.id === id ? { ...plan, ...updates } : plan
        ),
      })),
      
      deleteStudyPlan: (id) => set((state) => ({
        studyPlans: state.studyPlans.filter(plan => plan.id !== id),
        currentStudyPlan: state.currentStudyPlan?.id === id ? null : state.currentStudyPlan,
      })),
      
      setCurrentStudyPlan: (plan) => set({ currentStudyPlan: plan }),
      setStudyPlans: (plans) => set({ studyPlans: plans }),

      // Theme State
      theme: getInitialTheme(),
      
      toggleTheme: () => set((state) => ({
        theme: {
          ...state.theme,
          mode: state.theme.mode === 'light' ? 'dark' : 'light',
        },
      })),
      
      setTheme: (theme) => set({ theme }),
      
      updatePrimaryColor: (color) => set((state) => ({
        theme: { ...state.theme, primaryColor: color },
      })),

      // Navigation State
      navigation: {
        activeTab: 'dashboard',
        sidebarOpen: false,
      },
      
      setActiveTab: (tab) => set((state) => ({
        navigation: { ...state.navigation, activeTab: tab },
      })),
      
      toggleSidebar: () => set((state) => ({
        navigation: { ...state.navigation, sidebarOpen: !state.navigation.sidebarOpen },
      })),
      
      setSidebarOpen: (open) => set((state) => ({
        navigation: { ...state.navigation, sidebarOpen: open },
      })),

      // Notification State
      notifications: {
        notifications: [],
        unreadCount: 0,
      },
      
      addNotification: (notificationData) => {
        const newNotification: AppNotification = {
          ...notificationData,
          id: generateId(),
          createdAt: new Date(),
        };
        set((state) => ({
          notifications: {
            notifications: [newNotification, ...state.notifications.notifications],
            unreadCount: state.notifications.unreadCount + 1,
          },
        }));
      },
      
      markNotificationRead: (id) => set((state) => ({
        notifications: {
          notifications: state.notifications.notifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
          ),
          unreadCount: Math.max(0, state.notifications.unreadCount - 1),
        },
      })),
      
      markAllNotificationsRead: () => set((state) => ({
        notifications: {
          notifications: state.notifications.notifications.map(notification => ({
            ...notification,
            read: true,
          })),
          unreadCount: 0,
        },
      })),
      
      removeNotification: (id) => set((state) => {
        const notification = state.notifications.notifications.find(n => n.id === id);
        return {
          notifications: {
            notifications: state.notifications.notifications.filter(n => n.id !== id),
            unreadCount: notification && !notification.read ? 
              Math.max(0, state.notifications.unreadCount - 1) : 
              state.notifications.unreadCount,
          },
        };
      }),
      
      clearNotifications: () => set({ notifications: { notifications: [], unreadCount: 0 } }),

      // Study Stats State
      stats: getInitialStats(),
      
      updateStats: (stats) => set((state) => ({
        stats: { ...state.stats, ...stats },
      })),
      
      incrementStudyTime: (minutes) => set((state) => ({
        stats: { ...state.stats, totalStudyTime: state.stats.totalStudyTime + minutes },
      })),
      
      incrementStreak: () => set((state) => ({
        stats: { ...state.stats, streak: state.stats.streak + 1 },
      })),
      
      resetStreak: () => set((state) => ({
        stats: { ...state.stats, streak: 0 },
      })),
      
      addCompletedReminder: () => set((state) => ({
        stats: { ...state.stats, completedReminders: state.stats.completedReminders + 1 },
      })),
      
      addCompletedQuiz: (score) => set((state) => {
        const totalQuizzes = state.stats.completedQuizzes + 1;
        const totalScore = state.stats.averageQuizScore * state.stats.completedQuizzes + score;
        return {
          stats: {
            ...state.stats,
            completedQuizzes: totalQuizzes,
            averageQuizScore: totalScore / totalQuizzes,
          },
        };
      }),
    }),
    {
      name: 'study-reminder-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        reminders: state.reminders,
        playlists: state.playlists,
        quizzes: state.quizzes,
        studyPlans: state.studyPlans,
        theme: state.theme,
        notifications: state.notifications,
        stats: state.stats,
      }),
    }
  )
);

// Selectors for easier access to specific parts of the store
export const useUser = () => useAppStore((state) => state.user);
export const useReminders = () => useAppStore((state) => state.reminders);
export const usePlaylists = () => useAppStore((state) => state.playlists);
export const useQuizzes = () => useAppStore((state) => state.quizzes);
export const useStudyPlans = () => useAppStore((state) => state.studyPlans);
export const useTheme = () => useAppStore((state) => state.theme);
export const useNavigation = () => useAppStore((state) => state.navigation);
export const useNotifications = () => useAppStore((state) => state.notifications);
export const useStudyStats = () => useAppStore((state) => state.stats);

// Action selectors
export const useReminderActions = () => useAppStore((state) => ({
  addReminder: state.addReminder,
  updateReminder: state.updateReminder,
  deleteReminder: state.deleteReminder,
  toggleReminderComplete: state.toggleReminderComplete,
}));

export const usePlaylistActions = () => useAppStore((state) => ({
  addPlaylist: state.addPlaylist,
  updatePlaylist: state.updatePlaylist,
  deletePlaylist: state.deletePlaylist,
  setCurrentPlaylist: state.setCurrentPlaylist,
  markVideoWatched: state.markVideoWatched,
  updateVideoProgress: state.updateVideoProgress,
}));

export const useQuizActions = () => useAppStore((state) => ({
  addQuiz: state.addQuiz,
  updateQuiz: state.updateQuiz,
  deleteQuiz: state.deleteQuiz,
  setCurrentQuiz: state.setCurrentQuiz,
}));

export const useStudyPlanActions = () => useAppStore((state) => ({
  addStudyPlan: state.addStudyPlan,
  updateStudyPlan: state.updateStudyPlan,
  deleteStudyPlan: state.deleteStudyPlan,
  setCurrentStudyPlan: state.setCurrentStudyPlan,
}));

export const useThemeActions = () => useAppStore((state) => ({
  toggleTheme: state.toggleTheme,
  setTheme: state.setTheme,
  updatePrimaryColor: state.updatePrimaryColor,
}));

export const useNavigationActions = () => useAppStore((state) => ({
  setActiveTab: state.setActiveTab,
  toggleSidebar: state.toggleSidebar,
  setSidebarOpen: state.setSidebarOpen,
}));

export const useNotificationActions = () => useAppStore((state) => ({
  addNotification: state.addNotification,
  markNotificationRead: state.markNotificationRead,
  markAllNotificationsRead: state.markAllNotificationsRead,
  removeNotification: state.removeNotification,
  clearNotifications: state.clearNotifications,
}));

export const useStatsActions = () => useAppStore((state) => ({
  updateStats: state.updateStats,
  incrementStudyTime: state.incrementStudyTime,
  incrementStreak: state.incrementStreak,
  resetStreak: state.resetStreak,
  addCompletedReminder: state.addCompletedReminder,
  addCompletedQuiz: state.addCompletedQuiz,
}));