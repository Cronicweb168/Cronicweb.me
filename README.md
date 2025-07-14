# 🧠 AI-Powered Study Reminder App with Material You Integration

A comprehensive full-stack React web application that serves as a highly personalized Study Reminder & Planning Tool, featuring smart scheduling, YouTube playlist tracking, AI-generated study plans, and a dynamic Material You (Material 3) user interface.

## 🚀 Features

### ✅ Smart Reminder System
- **Interactive Reminders**: Add, edit, delete reminders with customizable priorities
- **Flexible Scheduling**: Set date, time, and repetition patterns (daily/weekly/monthly)
- **Material You Time & Date Pickers**: Custom-built Android-style pickers
- **Desktop Notifications**: Browser push notifications with action buttons
- **Snooze Functionality**: Configurable snooze options (5/10/15/30 minutes)
- **Tags & Categories**: Organize reminders with custom tags

### 🎞️ YouTube Playlist Integration
- **Playlist Import**: Import YouTube playlists and individual videos
- **Progress Tracking**: Mark videos as watched/unwatched
- **Embedded Player**: Built-in YouTube player with playback position memory
- **Statistics**: Track progress with percentage completion and time spent
- **Navigation**: Next/Previous video controls
- **YouTube Data API**: Automatic video metadata fetching

### 🤖 AI-Powered Study Tools (Gemini Integration)
- **Study Plan Generator**: AI-generated topic breakdowns with time allocations
- **Quiz Creator**: Auto-generated multiple-choice questions with explanations
- **Concept Explanations**: AI-powered concept explanations at different levels
- **Study Tips**: Personalized study recommendations based on learning style
- **Flashcard Generation**: AI-created flashcards for spaced repetition
- **Learning Path Recommendations**: Structured learning progressions

### 🎨 Material You (Material 3) Design
- **Dynamic Color System**: Adaptive color schemes based on Material 3 specifications
- **Theme Switching**: Light/dark mode with system preference detection
- **Custom Components**: Material You styled buttons, cards, and inputs
- **Ripple Effects**: Interactive state layers and animations
- **Elevation System**: Proper shadow and surface elevation
- **Typography Scale**: Material 3 typography with Roboto Flex

### 📊 Study Analytics
- **Progress Tracking**: Study streaks, hours studied, completion rates
- **Statistics Dashboard**: Visual progress indicators and charts
- **Goal Management**: Set and track daily/weekly study goals
- **Performance Metrics**: Quiz scores, improvement tracking

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI) v5+** with Material You tokens
- **Tailwind CSS** for utility-first styling
- **Zustand** for state management
- **React Router** for navigation
- **Vite** for build tooling

### Backend & Services
- **Firebase** for authentication and database
- **YouTube Data API** for video/playlist management
- **Google Gemini AI** for study plan and quiz generation
- **Service Workers** for offline functionality and notifications

### UI/UX
- **Material You Color System** with dynamic theming
- **Responsive Design** for mobile/tablet/desktop
- **Progressive Web App** capabilities
- **Accessibility** compliance with WCAG guidelines

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Authentication and Firestore enabled
- YouTube Data API key
- Google Gemini API key

### 1. Clone and Install
```bash
git clone <repository-url>
cd study-reminder-app
npm install
```

### 2. Environment Configuration
Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Fill in your API keys:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# YouTube API
VITE_YOUTUBE_API_KEY=your_youtube_api_key

# Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 3. Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication with Google provider
3. Enable Firestore Database
4. Add your domain to authorized domains in Authentication settings

### 4. API Keys Setup
1. **YouTube Data API**: Enable in Google Cloud Console
2. **Gemini AI**: Get API key from Google AI Studio
3. **Firebase**: Configuration available in project settings

### 5. Run the Application
```bash
npm run dev
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── MaterialButtons.tsx
│   ├── layout/           # Layout components
│   │   ├── Layout.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Sidebar.tsx
│   │   └── Settings.tsx
│   ├── reminders/        # Reminder management
│   │   ├── ReminderList.tsx
│   │   ├── ReminderForm.tsx
│   │   ├── ReminderCard.tsx
│   │   └── TimePicker.tsx
│   ├── playlists/        # YouTube integration
│   │   ├── PlaylistList.tsx
│   │   ├── PlaylistCard.tsx
│   │   ├── VideoPlayer.tsx
│   │   └── ProgressTracker.tsx
│   └── ai/              # AI-powered features
│       ├── AIAssistant.tsx
│       ├── StudyPlanGenerator.tsx
│       ├── QuizGenerator.tsx
│       └── ConceptExplainer.tsx
├── services/            # API and service integrations
│   ├── firebase.ts      # Firebase auth and database
│   ├── youtube.ts       # YouTube Data API
│   ├── gemini.ts        # Gemini AI integration
│   └── notifications.ts # Push notifications
├── store/              # Zustand state management
│   └── index.ts        # Global state store
├── types/              # TypeScript definitions
│   └── index.ts        # All type definitions
├── utils/              # Utility functions
│   └── helpers.ts      # Helper functions
├── hooks/              # Custom React hooks
│   └── useNotifications.ts
└── App.tsx             # Main application component
```

## 🎯 Key Features Implementation

### Material You Integration
The app implements a complete Material You design system:

- **Color Tokens**: Full Material 3 color system with light/dark variants
- **Typography**: Roboto Flex with proper size and weight scales
- **Components**: Custom Material You styled components
- **Animations**: Smooth transitions and state changes
- **Elevation**: Proper shadow and surface elevation system

### Smart Notifications
- **Service Worker**: Background notification handling
- **Push API**: Browser notifications with action buttons
- **Scheduling**: Intelligent reminder scheduling
- **Snooze Logic**: Configurable snooze options

### AI Integration
- **Study Plans**: Topic breakdown with time allocations
- **Quiz Generation**: Multiple-choice questions with explanations
- **Adaptive Learning**: Personalized recommendations
- **Progress Tracking**: AI-powered insights

### YouTube Integration
- **Playlist Import**: Automatic video metadata fetching
- **Progress Sync**: Watch history and position tracking
- **Embedded Player**: Custom YouTube player integration
- **Statistics**: Detailed viewing analytics

## 📱 Usage Guide

### 1. Getting Started
- Sign in with Google account
- Grant notification permissions
- Set up your study preferences

### 2. Creating Reminders
- Click the floating action button (FAB)
- Fill in reminder details with custom time picker
- Set repetition patterns and notification preferences
- Add tags for organization

### 3. Managing Playlists
- Import YouTube playlists by URL or ID
- Track video progress automatically
- Use embedded player for seamless viewing
- Mark videos as complete or bookmark for later

### 4. AI Study Tools
- Generate study plans from any topic
- Create custom quizzes with AI assistance
- Get personalized study recommendations
- Track learning progress and performance

### 5. Analytics & Insights
- View study streaks and progress
- Analyze quiz performance
- Track time spent on different topics
- Set and monitor study goals

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Testing
```bash
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:coverage # Generate coverage report
```

### Build & Deployment
```bash
npm run build        # Create production build
npm run deploy       # Deploy to Firebase Hosting
```

## 📚 API Documentation

### Firebase Functions
- User authentication and profile management
- Reminder CRUD operations
- Playlist synchronization
- Real-time data updates

### YouTube Integration
- Playlist metadata fetching
- Video progress tracking
- Search functionality
- Embedded player controls

### Gemini AI Features
- Study plan generation
- Quiz creation and evaluation
- Concept explanations
- Learning recommendations

## 🛡️ Security & Privacy

- **Authentication**: Secure Google OAuth integration
- **Data Encryption**: All data encrypted in transit and at rest
- **Privacy**: No personal data shared with third parties
- **Permissions**: Minimal required permissions requested
- **Offline Support**: Critical features work offline

## 🌟 Advanced Features

### Progressive Web App
- **Offline Functionality**: Core features work without internet
- **Install Prompt**: Add to home screen capability
- **Background Sync**: Sync data when connection restored
- **Push Notifications**: Real-time reminder notifications

### Accessibility
- **WCAG Compliance**: Level AA accessibility standards
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and descriptions
- **High Contrast**: Support for high contrast mode

### Performance
- **Code Splitting**: Lazy loading for optimal performance
- **Caching**: Intelligent caching strategies
- **Optimizations**: Bundle size optimization
- **Service Worker**: Offline-first architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Material Design Team** for Material You specifications
- **Google** for Firebase, YouTube API, and Gemini AI
- **React Team** for the excellent framework
- **Material-UI** for the component library
- **Tailwind CSS** for utility-first styling

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using React, Material You, and AI**
