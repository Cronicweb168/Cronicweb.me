# Study Reminder App - Setup Guide

This guide will help you set up the Study Reminder App with all necessary API keys and configurations.

## Prerequisites

1. Node.js 18+ and npm installed
2. A Google account for Firebase and API access
3. Basic knowledge of React and Firebase

## 1. Firebase Setup

### Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter a project name (e.g., "study-reminder-app")
4. Follow the setup wizard

### Enable Services

1. **Authentication**:
   - In Firebase Console, go to Authentication
   - Click "Get started"
   - Enable "Google" sign-in provider

2. **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in test mode" for development
   - Select a location

3. **Cloud Messaging**:
   - Go to Project Settings > Cloud Messaging
   - Generate a new Web Push certificate (VAPID key)

### Get Firebase Configuration

1. Go to Project Settings > General
2. Under "Your apps", click "Add app" > Web
3. Register your app with a nickname
4. Copy the Firebase configuration object

## 2. YouTube Data API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "YouTube Data API v3"
4. Go to "Credentials" > "Create Credentials" > "API Key"
5. Copy the API key
6. (Optional) Restrict the key to your domain

## 3. Google Gemini API

1. Visit [Google AI Studio](https://makersuite.google.com/)
2. Sign in with your Google account
3. Click "Get API key"
4. Create a new API key
5. Copy the key

## 4. Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your actual values:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your-actual-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_VAPID_KEY=your-vapid-key
   
   # YouTube API
   VITE_YOUTUBE_API_KEY=your-youtube-api-key
   
   # Gemini API
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```

## 5. Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:5173 in your browser

## 6. Deployment

### Deploy to Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   - Select "Hosting"
   - Choose your Firebase project
   - Set public directory to `dist`
   - Configure as single-page app: Yes

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

## Troubleshooting

### Common Issues

1. **"API key not valid" error**:
   - Ensure your API keys are correctly copied
   - Check if APIs are enabled in Google Cloud Console
   - Verify domain restrictions

2. **Notifications not working**:
   - Ensure HTTPS is enabled (required for notifications)
   - Check browser notification permissions
   - Verify VAPID key is correct

3. **Firebase connection errors**:
   - Check Firebase project configuration
   - Ensure Firestore is initialized
   - Verify security rules allow read/write

### Getting Help

- Check the [README.md](README.md) for feature documentation
- Open an issue on GitHub for bugs
- Contact support@studyreminder.app for assistance