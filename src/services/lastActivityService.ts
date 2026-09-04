import type { LastActivity } from '../types';

const STORAGE_KEY = 'sppg_last_activity';

export const lastActivityService = {
  saveActivity(activity: Omit<LastActivity, 'updatedAt'>): void {
    try {
      const payload: LastActivity = {
        ...activity,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Could not persist last activity:', e);
    }
  },

  getLastActivity(): LastActivity | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as LastActivity;
    } catch {
      return null;
    }
  },

  clearActivity(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  },
};
