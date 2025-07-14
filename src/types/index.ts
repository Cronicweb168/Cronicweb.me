// Core data types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  defaultSnoozeTime: number;
  studyGoal: number; // hours per day
  reminderSound: string;
}

// Reminder system types
export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  repetition: RepetitionType;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  notificationSettings: NotificationSettings;
}

export interface RepetitionType {
  type: 'none' | 'daily' | 'weekly' | 'monthly';
  daysOfWeek?: number[]; // 0-6, Sunday = 0
  interval?: number; // Every X days/weeks/months
  endDate?: Date;
}

export interface NotificationSettings {
  enabled: boolean;
  minutesBefore: number;
  snoozeOptions: number[]; // [5, 10, 15, 30] minutes
}

// YouTube integration types
export interface Playlist {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  videoCount: number;
  totalDuration: number; // in seconds
  watchedCount: number;
  videos: Video[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  youtubePlaylistId?: string;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  duration: number; // in seconds
  watched: boolean;
  watchedAt?: Date;
  youtubeVideoId: string;
  position: number; // order in playlist
  lastPlaybackPosition?: number; // in seconds
  playlistId: string;
}

export interface VideoProgress {
  videoId: string;
  currentTime: number;
  duration: number;
  watched: boolean;
  watchedAt?: Date;
}

// AI integration types
export interface StudyPlan {
  id: string;
  topic: string;
  subtopics: Subtopic[];
  estimatedDuration: number; // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  userId: string;
  completed: boolean;
}

export interface Subtopic {
  id: string;
  title: string;
  description: string;
  keyConcepts: string[];
  suggestedTimeAllocation: number; // in minutes
  resources: Resource[];
  completed: boolean;
}

export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'book' | 'practice';
  url?: string;
  description?: string;
}

export interface Quiz {
  id: string;
  title: string;
  topic: string;
  questions: Question[];
  createdAt: Date;
  userId: string;
  completed: boolean;
  score?: number;
  attempts: QuizAttempt[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  answers: number[];
  score: number;
  completedAt: Date;
  timeSpent: number; // in seconds
}

// UI state types
export interface ThemeState {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  customColors?: Record<string, string>;
}

export interface NavigationState {
  activeTab: 'dashboard' | 'reminders' | 'playlists' | 'ai' | 'settings';
  sidebarOpen: boolean;
}

export interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
}

export interface AppNotification {
  id: string;
  type: 'reminder' | 'quiz' | 'playlist' | 'system';
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  actionUrl?: string;
  reminderId?: string;
}

// Form types
export interface ReminderFormData {
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  repetition: RepetitionType;
  notificationSettings: NotificationSettings;
}

export interface PlaylistFormData {
  title: string;
  description: string;
  youtubePlaylistId?: string;
  videos: VideoFormData[];
}

export interface VideoFormData {
  title: string;
  youtubeVideoId: string;
  duration: number;
}

export interface QuizFormData {
  title: string;
  topic: string;
  questions: QuestionFormData[];
}

export interface QuestionFormData {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// YouTube API types
export interface YouTubePlaylistResponse {
  kind: string;
  etag: string;
  items: YouTubePlaylistItem[];
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export interface YouTubePlaylistItem {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      [key: string]: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
  };
  contentDetails: {
    itemCount: number;
  };
}

export interface YouTubeVideoResponse {
  kind: string;
  etag: string;
  items: YouTubeVideoItem[];
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export interface YouTubeVideoItem {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      [key: string]: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
  };
  contentDetails: {
    duration: string; // ISO 8601 duration format
  };
}

// Gemini AI types
export interface GeminiResponse {
  candidates: GeminiCandidate[];
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

export interface GeminiCandidate {
  content: {
    parts: GeminiPart[];
    role: string;
  };
  finishReason: string;
  index: number;
  safetyRatings: GeminiSafetyRating[];
}

export interface GeminiPart {
  text: string;
}

export interface GeminiSafetyRating {
  category: string;
  probability: string;
}

// Study statistics types
export interface StudyStats {
  totalStudyTime: number; // in minutes
  streak: number; // days
  completedReminders: number;
  completedQuizzes: number;
  averageQuizScore: number;
  weeklyGoalProgress: number; // percentage
  monthlyStats: MonthlyStats;
}

export interface MonthlyStats {
  studyTimeByDay: Record<string, number>;
  completedTasks: number;
  totalTasks: number;
  averageDailyStudyTime: number;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Local storage types
export interface LocalStorageData {
  userPreferences: UserPreferences;
  themeState: ThemeState;
  lastSync: Date;
  offlineData: {
    reminders: Reminder[];
    playlists: Playlist[];
    quizzes: Quiz[];
  };
}

// Service worker types
export interface ServiceWorkerMessage {
  type: 'REMINDER_NOTIFICATION' | 'SYNC_DATA' | 'CACHE_UPDATE';
  payload: any;
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon: string;
  badge: string;
  data: {
    reminderId?: string;
    type: 'reminder' | 'system';
    actionUrl?: string;
  };
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: any;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isDirty: boolean;
}