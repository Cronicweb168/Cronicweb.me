# Study Reminder App

A modern, AI-powered study reminder application built with React, TypeScript, and Material You (Material 3) design system. This app helps students manage their study schedules with smart reminders, YouTube playlist tracking, AI-generated study plans, and interactive quizzes.

## 🌟 Features

### ✅ Smart Reminder System
- Create, edit, and delete reminders with custom date/time
- Material You-style clock and calendar pickers
- Recurring reminders (daily/weekly/once)
- Priority levels and tags
- Desktop notifications with snooze functionality
- "Remind me X minutes before" settings

### 🎞️ YouTube Playlist Tracker
- Add and track YouTube playlists
- Mark videos as watched/unwatched
- Embedded YouTube player with playlist navigation
- Remember playback position
- Progress tracking

### 🤖 AI-Powered Features (Gemini API)
- **Study Planner**: Generate comprehensive study plans for any topic
- **Quiz Generator**: Create custom quizzes from topics or notes
- Smart topic breakdowns with time allocations
- Resource suggestions

### 🎨 Material You (Material 3) UI/UX
- Dynamic color theming with Material 3 design tokens
- Light/dark mode with system preference support
- Custom-built components following Material 3 guidelines
- Smooth animations and transitions
- Responsive design for all devices

### 📊 Study Analytics
- Track study streaks
- View completion rates
- Daily study statistics
- Visual progress indicators

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase account
- YouTube Data API key
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/study-reminder-app.git
cd study-reminder-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Add your API keys to `.env`:
```env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
VITE_FIREBASE_VAPID_KEY=your-firebase-vapid-key
VITE_YOUTUBE_API_KEY=your-youtube-api-key
VITE_GEMINI_API_KEY=your-gemini-api-key
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with Material 3 design tokens
- **State Management**: Zustand
- **UI Components**: Custom Material You components + MUI icons
- **Animations**: Framer Motion
- **Backend**: Firebase (Auth, Firestore, Cloud Messaging)
- **APIs**: YouTube Data API v3, Google Gemini API
- **Date Handling**: date-fns
- **Notifications**: Browser Push API + Firebase Cloud Messaging

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx      # Material You button
│   ├── Card.tsx        # Material You card
│   ├── ClockPicker.tsx # Custom time picker
│   ├── CalendarPicker.tsx # Custom date picker
│   └── ...
├── pages/              # Main page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── YouTube.tsx     # YouTube playlist manager
│   ├── StudyPlanner.tsx # AI study planner
│   └── Quizzes.tsx     # Quiz interface
├── services/           # API and external services
│   ├── firebase.ts     # Firebase configuration
│   ├── youtube.ts      # YouTube API service
│   ├── gemini.ts       # Gemini AI service
│   └── notifications.ts # Notification service
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── hooks/              # Custom React hooks
```

## 🎨 Design System

The app implements Material You (Material 3) design principles:

- **Color System**: Dynamic theming with primary, secondary, and tertiary colors
- **Typography**: Roboto Flex with Material 3 type scales
- **Components**: Custom-built following Material 3 specifications
- **Elevation**: Proper shadow hierarchy
- **Motion**: Meaningful animations and transitions
- **Accessibility**: WCAG compliant with proper contrast ratios

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication, Firestore, and Cloud Messaging
3. Add your web app and copy the configuration
4. Enable Google Sign-In in Authentication

### YouTube API Setup
1. Go to Google Cloud Console
2. Enable YouTube Data API v3
3. Create credentials and get your API key

### Gemini API Setup
1. Visit Google AI Studio
2. Create an API key for Gemini Pro

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

## 📱 Features in Detail

### Reminder System
- Full CRUD operations with intuitive UI
- Custom Material You date/time pickers
- Browser notifications with action buttons
- Recurring reminder support
- Smart scheduling with time zones

### YouTube Integration
- Playlist import via URL
- Video progress tracking
- Embedded player with controls
- Playlist management
- Watch history

### AI Features
- Topic-based study plan generation
- Automatic quiz creation
- Customizable difficulty levels
- Explanation for quiz answers
- Export functionality

## 🛠️ Development

### Run Tests
```bash
npm test
```

### Lint Code
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Material Design 3 by Google
- React community
- All contributors and testers

## 📞 Support

For support, email support@studyreminder.app or open an issue on GitHub.
