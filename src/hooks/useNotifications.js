import { useEffect, useRef, useCallback } from 'react';

export function useNotifications(medicines) {
  const intervalRef = useRef(null);
  const lastNotifiedRef = useRef({});

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    const result = await Notification.requestPermission();
    return result === 'granted';
  }, []);

  const showNotification = useCallback((title, body) => {
    // Try service worker first
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title,
        body,
      });
    } else if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '💊',
        vibrate: [200, 100, 200],
      });
    }
  }, []);

  const checkReminders = useCallback(() => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const todayKey = now.toISOString().split('T')[0];

    medicines.forEach((med) => {
      if (!med.reminder?.enabled || !med.reminder?.times) return;

      med.reminder.times.forEach((time) => {
        const notifKey = `${todayKey}-${med.id}-${time}`;
        if (time === currentTime && !lastNotifiedRef.current[notifKey]) {
          lastNotifiedRef.current[notifKey] = true;
          showNotification(
            `💊 Time for ${med.name}`,
            `${med.dosage?.split('.')[0] || 'Take your medicine'}`
          );
        }
      });
    });
  }, [medicines, showNotification]);

  useEffect(() => {
    requestPermission();
    // Check every 30 seconds
    intervalRef.current = setInterval(checkReminders, 30000);
    // Also check immediately
    checkReminders();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [checkReminders, requestPermission]);

  return { requestPermission, showNotification };
}
