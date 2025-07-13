// Reminder Types
export interface Reminder {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time: string;
  repetition: 'once' | 'daily' | 'weekly';
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  completed: boolean;
  reminderBefore?: number; // minutes before to remind
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

// YouTube Types
export interface YouTubeVideo {
  id: string;
  title: string;
  duration: string;
  thumbnailUrl: string;
  watched: boolean;
  playbackPosition?: number;
}

export interface YouTubePlaylist {
  id: string;
  playlistId: string;
  title: string;
  videos: YouTubeVideo[];
  totalVideos: number;
  watchedCount: number;
  addedAt: Date;
  userId?: string;
}

// Study Planner Types
export interface StudyPlan {
  id: string;
  topic: string;
  subtopics: StudySubtopic[];
  totalTime: number; // in minutes
  createdAt: Date;
  userId?: string;
}

export interface StudySubtopic {
  title: string;
  keyPoints: string[];
  timeAllocation: number; // in minutes
  resources?: StudyResource[];
}

export interface StudyResource {
  type: 'video' | 'book' | 'article';
  title: string;
  url?: string;
}

// Quiz Types
export interface Quiz {
  id: string;
  topic: string;
  questions: Question[];
  score?: number;
  completedAt?: Date;
  createdAt: Date;
  userId?: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  userAnswer?: number;
}

// User Types
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  defaultReminderTime: number; // minutes before
  studyStreakGoal: number; // days
}

// Stats Types
export interface StudyStats {
  totalHoursStudied: number;
  currentStreak: number;
  longestStreak: number;
  quizzesCompleted: number;
  averageQuizScore: number;
  dailyStats: DailyStat[];
}

export interface DailyStat {
  date: Date;
  hoursStudied: number;
  remindersCompleted: number;
  quizzesTaken: number;
}

// Notification Types
export interface NotificationData {
  id: string;
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: {
    reminderId?: string;
    action?: 'complete' | 'snooze' | 'dismiss';
  };
}