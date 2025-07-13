import { Reminder, PushNotificationPayload, ApiResponse } from '../types';

// Service worker registration
let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notification');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    console.warn('Notification permission denied');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Check if notifications are supported and enabled
export const isNotificationSupported = (): boolean => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

export const isNotificationEnabled = (): boolean => {
  return isNotificationSupported() && Notification.permission === 'granted';
};

// Register service worker
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker is not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    serviceWorkerRegistration = registration;
    
    console.log('Service Worker registered successfully:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};

// Send notification
export const sendNotification = async (
  title: string,
  options: NotificationOptions = {}
): Promise<void> => {
  if (!isNotificationEnabled()) {
    console.warn('Notifications are not enabled');
    return;
  }

  const defaultOptions: NotificationOptions = {
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [200, 100, 200],
    requireInteraction: true,
    tag: 'study-reminder',
    ...options,
  };

  try {
    if (serviceWorkerRegistration) {
      // Use service worker to show notification
      await serviceWorkerRegistration.showNotification(title, defaultOptions);
    } else {
      // Fallback to basic notification
      new Notification(title, defaultOptions);
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Send reminder notification
export const sendReminderNotification = async (reminder: Reminder): Promise<void> => {
  const timeUntilDue = new Date(reminder.dueDate).getTime() - Date.now();
  const timeText = timeUntilDue > 0 ? 
    `Due in ${Math.ceil(timeUntilDue / (1000 * 60))} minutes` : 
    'Due now';

  const options: NotificationOptions = {
    body: `${reminder.description || 'Study reminder'} - ${timeText}`,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: `reminder-${reminder.id}`,
    data: {
      reminderId: reminder.id,
      type: 'reminder',
      actionUrl: `/reminders/${reminder.id}`,
    },
    actions: [
      {
        action: 'complete',
        title: 'Mark Complete',
        icon: '/check-icon.png',
      },
      {
        action: 'snooze',
        title: 'Snooze',
        icon: '/snooze-icon.png',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/dismiss-icon.png',
      },
    ],
    requireInteraction: true,
    vibrate: [200, 100, 200, 100, 200],
  };

  await sendNotification(reminder.title, options);
};

// Schedule reminder notification
export const scheduleReminderNotification = async (reminder: Reminder): Promise<void> => {
  if (!isNotificationEnabled()) {
    console.warn('Notifications are not enabled');
    return;
  }

  const now = Date.now();
  const reminderTime = new Date(reminder.dueDate).getTime();
  const notificationTime = reminderTime - (reminder.notificationSettings.minutesBefore * 60 * 1000);

  if (notificationTime <= now) {
    // Send immediately if time has passed
    await sendReminderNotification(reminder);
    return;
  }

  // Schedule for later
  const delay = notificationTime - now;
  setTimeout(() => {
    sendReminderNotification(reminder);
  }, delay);
};

// Cancel scheduled notification
export const cancelNotification = async (reminderId: string): Promise<void> => {
  if (!serviceWorkerRegistration) return;

  try {
    const notifications = await serviceWorkerRegistration.getNotifications({
      tag: `reminder-${reminderId}`,
    });

    notifications.forEach(notification => {
      notification.close();
    });
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};

// Handle notification click
export const handleNotificationClick = (event: NotificationEvent): void => {
  event.notification.close();

  const data = event.notification.data;
  
  if (event.action === 'complete') {
    // Handle complete action
    handleReminderComplete(data.reminderId);
  } else if (event.action === 'snooze') {
    // Handle snooze action
    handleReminderSnooze(data.reminderId);
  } else if (event.action === 'dismiss') {
    // Just dismiss the notification
    return;
  } else {
    // Default action - open the app
    if (data.actionUrl) {
      clients.openWindow(data.actionUrl);
    }
  }
};

// Handle reminder complete action
const handleReminderComplete = async (reminderId: string): Promise<void> => {
  try {
    // Send message to main thread to update reminder
    if (serviceWorkerRegistration) {
      const clients = await serviceWorkerRegistration.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'REMINDER_COMPLETE',
          reminderId,
        });
      });
    }
  } catch (error) {
    console.error('Error handling reminder complete:', error);
  }
};

// Handle reminder snooze action
const handleReminderSnooze = async (reminderId: string): Promise<void> => {
  try {
    // Send message to main thread to snooze reminder
    if (serviceWorkerRegistration) {
      const clients = await serviceWorkerRegistration.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'REMINDER_SNOOZE',
          reminderId,
        });
      });
    }
  } catch (error) {
    console.error('Error handling reminder snooze:', error);
  }
};

// Setup notification listeners
export const setupNotificationListeners = (): void => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, reminderId } = event.data;
      
      if (type === 'REMINDER_COMPLETE') {
        // Handle reminder completion in main thread
        window.dispatchEvent(new CustomEvent('reminderComplete', { detail: { reminderId } }));
      } else if (type === 'REMINDER_SNOOZE') {
        // Handle reminder snooze in main thread
        window.dispatchEvent(new CustomEvent('reminderSnooze', { detail: { reminderId } }));
      }
    });
  }
};

// Schedule all active reminders
export const scheduleAllReminders = async (reminders: Reminder[]): Promise<void> => {
  const activeReminders = reminders.filter(r => 
    !r.completed && 
    r.notificationSettings.enabled &&
    new Date(r.dueDate).getTime() > Date.now()
  );

  for (const reminder of activeReminders) {
    await scheduleReminderNotification(reminder);
  }
};

// Clear all notifications
export const clearAllNotifications = async (): Promise<void> => {
  if (!serviceWorkerRegistration) return;

  try {
    const notifications = await serviceWorkerRegistration.getNotifications();
    notifications.forEach(notification => {
      notification.close();
    });
  } catch (error) {
    console.error('Error clearing notifications:', error);
  }
};

// Test notification
export const testNotification = async (): Promise<void> => {
  await sendNotification('Test Notification', {
    body: 'This is a test notification from Study Reminder App',
    icon: '/icon-192x192.png',
    tag: 'test-notification',
  });
};

// Send system notification
export const sendSystemNotification = async (
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
): Promise<void> => {
  const iconMap = {
    info: '/info-icon.png',
    success: '/success-icon.png',
    warning: '/warning-icon.png',
    error: '/error-icon.png',
  };

  await sendNotification(title, {
    body: message,
    icon: iconMap[type],
    tag: `system-${type}`,
  });
};

// Snooze reminder
export const snoozeReminder = async (
  reminder: Reminder,
  snoozeMinutes: number = 10
): Promise<void> => {
  // Cancel existing notification
  await cancelNotification(reminder.id);

  // Create new reminder with snoozed time
  const snoozedReminder: Reminder = {
    ...reminder,
    dueDate: new Date(Date.now() + snoozeMinutes * 60 * 1000),
  };

  // Schedule new notification
  await scheduleReminderNotification(snoozedReminder);
};

// Get notification settings
export const getNotificationSettings = (): {
  supported: boolean;
  enabled: boolean;
  permission: NotificationPermission;
} => {
  return {
    supported: isNotificationSupported(),
    enabled: isNotificationEnabled(),
    permission: Notification.permission,
  };
};

// Update notification settings
export const updateNotificationSettings = async (
  enabled: boolean
): Promise<boolean> => {
  if (enabled && !isNotificationEnabled()) {
    return await requestNotificationPermission();
  }
  return true;
};

// Create notification from reminder
export const createNotificationFromReminder = (reminder: Reminder): PushNotificationPayload => {
  const timeUntilDue = new Date(reminder.dueDate).getTime() - Date.now();
  const timeText = timeUntilDue > 0 ? 
    `Due in ${Math.ceil(timeUntilDue / (1000 * 60))} minutes` : 
    'Due now';

  return {
    title: reminder.title,
    body: `${reminder.description || 'Study reminder'} - ${timeText}`,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: {
      reminderId: reminder.id,
      type: 'reminder',
      actionUrl: `/reminders/${reminder.id}`,
    },
  };
};

// Background sync for notifications
export const syncNotifications = async (): Promise<void> => {
  if (!serviceWorkerRegistration) return;

  try {
    await serviceWorkerRegistration.sync.register('notification-sync');
  } catch (error) {
    console.error('Error registering notification sync:', error);
  }
};

// Initialize notifications
export const initializeNotifications = async (): Promise<void> => {
  try {
    // Register service worker
    const registration = await registerServiceWorker();
    
    if (registration) {
      // Request notification permission
      const permissionGranted = await requestNotificationPermission();
      
      if (permissionGranted) {
        // Setup listeners
        setupNotificationListeners();
        
        // Register background sync
        await syncNotifications();
        
        console.log('Notifications initialized successfully');
      }
    }
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
};

// Utility functions for notification timing
export const getNotificationDelay = (reminder: Reminder): number => {
  const reminderTime = new Date(reminder.dueDate).getTime();
  const notificationTime = reminderTime - (reminder.notificationSettings.minutesBefore * 60 * 1000);
  return Math.max(0, notificationTime - Date.now());
};

export const formatNotificationTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Declare global types for service worker
declare global {
  interface ServiceWorkerGlobalScope {
    clients: Clients;
  }
  
  interface NotificationEvent extends ExtendableEvent {
    notification: Notification;
    action?: string;
  }
  
  interface Window {
    clients: Clients;
  }
}

// Export notification constants
export const NOTIFICATION_ICONS = {
  DEFAULT: '/icon-192x192.png',
  BADGE: '/badge-72x72.png',
  COMPLETE: '/check-icon.png',
  SNOOZE: '/snooze-icon.png',
  DISMISS: '/dismiss-icon.png',
};

export const NOTIFICATION_TAGS = {
  REMINDER: 'reminder',
  SYSTEM: 'system',
  TEST: 'test',
};

export const NOTIFICATION_ACTIONS = {
  COMPLETE: 'complete',
  SNOOZE: 'snooze',
  DISMISS: 'dismiss',
};