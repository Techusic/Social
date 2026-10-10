import { create } from 'zustand';
import { getActiveWorld } from './worldStore';
import { loadStore, registerWorldHydrator, saveStore, worldStoreKey } from '../db/worldPersistence';
import type { Notification, NotificationType } from '../types/notifications';

type NotificationStore = {
  notifications: Notification[];
  unreadCount: () => number;
  add: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clear: () => void;
};

function loadNotifications(worldId: string): Notification[] {
  return loadStore<Notification[]>(worldStoreKey('notifications', worldId))
    ?? (worldId === 'hogwarts' ? loadStore<Notification[]>('notifications') : null)
    ?? [];
}

function persist(notifications: Notification[], worldId = getActiveWorld().id): void {
  saveStore(worldStoreKey('notifications', worldId), notifications.slice(0, 200));
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: loadNotifications(getActiveWorld().id),
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
    if (!state.notifications.some((item) => item.id === id && !item.read)) return state;
    const notifications = state.notifications.map((item) => item.id === id ? { ...item, read: true } : item);
    persist(notifications);
    return { notifications };
  }),
  markAllRead: () => set((state) => {
    if (!state.notifications.some((item) => !item.read)) return state;
    const notifications = state.notifications.map((item) => ({ ...item, read: true }));
    persist(notifications);
    return { notifications };
  }),
  clear: () => {
    persist([]);
    set({ notifications: [] });
  },
}));

registerWorldHydrator((worldId) => useNotificationStore.setState({ notifications: loadNotifications(worldId) }));

export function addNotification(type: NotificationType, input: Omit<Notification, 'id' | 'type' | 'createdAt' | 'read'>): void {
  useNotificationStore.getState().add({ ...input, type });
}
