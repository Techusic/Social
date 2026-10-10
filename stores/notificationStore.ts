import { create } from 'zustand';
import { loadStore, saveStore } from '../db/worldPersistence';
import type { Notification, NotificationType } from '../types/notifications';

type NotificationStore = {
  notifications: Notification[];
  unreadCount: () => number;
  add: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clear: () => void;
};

const initialNotifications = loadStore<Notification[]>('notifications') ?? [];

function persist(notifications: Notification[]): void {
  saveStore('notifications', notifications.slice(0, 200));
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: initialNotifications,
  unreadCount: () => get().notifications.filter((item) => !item.read).length,
  add: (notification) => set((state) => {
    const next: Notification[] = [
      { ...notification, id: `notification-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: Date.now(), read: false },
      ...state.notifications,
    ];
    persist(next);
    return { notifications: next };
  }),
  markRead: (id) => set((state) => {
    const notifications = state.notifications.map((item) => item.id === id ? { ...item, read: true } : item);
    persist(notifications);
    return { notifications };
  }),
  markAllRead: () => set((state) => {
    const notifications = state.notifications.map((item) => ({ ...item, read: true }));
    persist(notifications);
    return { notifications };
  }),
  clear: () => {
    persist([]);
    set({ notifications: [] });
  },
}));

export function addNotification(type: NotificationType, input: Omit<Notification, 'id' | 'type' | 'createdAt' | 'read'>): void {
  useNotificationStore.getState().add({ ...input, type });
}

