import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Store and hooks
import { useAppStore, useTheme, useThemeActions } from './store';

// Components
import Layout from './components/layout/Layout';
import Dashboard from './components/layout/Dashboard';
import ReminderList from './components/reminders/ReminderList';
import PlaylistList from './components/playlists/PlaylistList';
import AIAssistant from './components/ai/AIAssistant';
import Settings from './components/layout/Settings';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

// Services
import { initializeNotifications } from './services/notifications';
import { getCurrentUser } from './services/firebase';

// Material You theme configuration
const createMaterialYouTheme = (mode: 'light' | 'dark', primaryColor: string) => {
  const isDark = mode === 'dark';
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: primaryColor,
        light: isDark ? '#D0BCFF' : '#EADDFF',
        dark: isDark ? '#4F378B' : '#6750A4',
        contrastText: isDark ? '#21005D' : '#FFFFFF',
      },
      secondary: {
        main: '#625B71',
        light: isDark ? '#CCC2DC' : '#E8DEF8',
        dark: isDark ? '#4A4458' : '#49454F',
        contrastText: isDark ? '#E8DEF8' : '#FFFFFF',
      },
      background: {
        default: isDark ? '#1C1B1F' : '#FFFBFE',
        paper: isDark ? '#1C1B1F' : '#FFFBFE',
      },
      surface: {
        main: isDark ? '#1C1B1F' : '#FFFBFE',
        light: isDark ? '#49454F' : '#E7E0EC',
        dark: isDark ? '#313033' : '#CAC4D0',
      },
      text: {
        primary: isDark ? '#E6E1E5' : '#1C1B1F',
        secondary: isDark ? '#CAC4D0' : '#49454F',
      },
      error: {
        main: '#B3261E',
        light: isDark ? '#F2B8B5' : '#F9DEDC',
        dark: isDark ? '#8C1D18' : '#601410',
      },
      warning: {
        main: '#E6A23C',
        light: '#FDF2E3',
        dark: '#B8851F',
      },
      info: {
        main: '#2563EB',
        light: '#EBF5FF',
        dark: '#1E40AF',
      },
      success: {
        main: '#16A34A',
        light: '#F0FDF4',
        dark: '#15803D',
      },
    },
    typography: {
      fontFamily: 'Roboto, system-ui, -apple-system, sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 400,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 400,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 400,
        lineHeight: 1.4,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 400,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: '1.125rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.43,
      },
      button: {
        fontWeight: 500,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            boxSizing: 'border-box',
          },
          html: {
            height: '100%',
          },
          body: {
            height: '100%',
            margin: 0,
            fontFamily: 'Roboto, system-ui, -apple-system, sans-serif',
          },
          '#root': {
            height: '100%',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
            },
          },
          contained: {
            '&:hover': {
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
            '&:hover': {
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)',
            '&:hover': {
              boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.3), 0px 6px 10px 4px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
    },
  });
};

// Extend MUI theme interface
declare module '@mui/material/styles' {
  interface Palette {
    surface: {
      main: string;
      light: string;
      dark: string;
    };
  }
  
  interface PaletteOptions {
    surface?: {
      main: string;
      light: string;
      dark: string;
    };
  }
}

function App() {
  const theme = useTheme();
  const { setUser } = useAppStore();
  const [isLoading, setIsLoading] = React.useState(true);

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize notifications
        await initializeNotifications();
        
        // Check for existing user session
        const user = await getCurrentUser();
        if (user) {
          setUser({
            id: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || undefined,
            createdAt: new Date(),
            preferences: {
              theme: 'system',
              notifications: true,
              defaultSnoozeTime: 10,
              studyGoal: 2,
              reminderSound: 'default',
            },
          });
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [setUser]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme.mode]);

  const materialTheme = createMaterialYouTheme(theme.mode, theme.primaryColor);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <LoadingSpinner />
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider theme={materialTheme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/reminders" element={<ReminderList />} />
                <Route path="/playlists" element={<PlaylistList />} />
                <Route path="/ai" element={<AIAssistant />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;