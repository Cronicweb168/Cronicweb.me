import type { Reminder, NotificationData } from '../types';
import { format } from 'date-fns';

export class NotificationService {
  private static notificationQueue: Map<string, number> = new Map();

  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  static scheduleReminder(reminder: Reminder): void {
    // Clear existing timeout if any
    this.cancelReminder(reminder.id);

    const reminderDate = new Date(reminder.date);
    const [hours, minutes] = reminder.time.split(':').map(Number);
    reminderDate.setHours(hours, minutes, 0, 0);

    // Subtract reminder before time
    const notificationTime = new Date(
      reminderDate.getTime() - (reminder.reminderBefore || 0) * 60 * 1000
    );

    const now = new Date();
    const timeUntilNotification = notificationTime.getTime() - now.getTime();

    if (timeUntilNotification > 0) {
      const timeout = setTimeout(() => {
        this.showNotification({
          id: reminder.id,
          title: reminder.title,
          body: `Reminder: ${reminder.description || 'No description'}`,
          tag: `reminder-${reminder.id}`,
          data: {
            reminderId: reminder.id,
            action: 'complete'
          }
        });
        
        // If it's a recurring reminder, schedule the next one
        if (reminder.repetition !== 'once') {
          this.scheduleNextOccurrence(reminder);
        }
      }, timeUntilNotification);

      this.notificationQueue.set(reminder.id, timeout);
    }
  }

  static cancelReminder(reminderId: string): void {
    const timeout = this.notificationQueue.get(reminderId);
    if (timeout) {
      clearTimeout(timeout);
      this.notificationQueue.delete(reminderId);
    }
  }

  static async showNotification(data: NotificationData): Promise<void> {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const notification = new Notification(data.title, {
      body: data.body,
      icon: data.icon || '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: data.tag,
      requireInteraction: true,
      data: data.data
    });

    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      notification.close();
    };
  }

  private static scheduleNextOccurrence(reminder: Reminder): void {
    const nextDate = new Date(reminder.date);
    
    if (reminder.repetition === 'daily') {
      nextDate.setDate(nextDate.getDate() + 1);
    } else if (reminder.repetition === 'weekly') {
      nextDate.setDate(nextDate.getDate() + 7);
    }

    const updatedReminder = { ...reminder, date: nextDate };
    this.scheduleReminder(updatedReminder);
  }

  static snoozeReminder(reminderId: string, minutes: number = 10): void {
    const snoozeTime = new Date(Date.now() + minutes * 60 * 1000);
    
    const timeout = setTimeout(() => {
      this.showNotification({
        id: `${reminderId}-snooze`,
        title: 'Snoozed Reminder',
        body: 'Your snoozed reminder is due!',
        tag: `reminder-${reminderId}`,
        data: {
          reminderId,
          action: 'complete'
        }
      });
    }, minutes * 60 * 1000);

    this.notificationQueue.set(`${reminderId}-snooze`, timeout);
  }

  static async testNotification(): Promise<void> {
    await this.showNotification({
      id: 'test',
      title: 'Test Notification',
      body: 'This is a test notification from Study Reminder App',
      tag: 'test'
    });
  }

  // Initialize notification handlers
  static initialize(): void {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('notificationclick', (event: any) => {
          const notification = event.notification;
          const action = event.action;
          const reminderId = notification.data?.reminderId;

          if (action === 'complete' && reminderId) {
            // Handle mark complete action
            window.postMessage({ type: 'COMPLETE_REMINDER', reminderId }, '*');
          } else if (action === 'snooze' && reminderId) {
            // Handle snooze action
            this.snoozeReminder(reminderId, 10);
          }

          notification.close();
        });
      });
    }
  }
}