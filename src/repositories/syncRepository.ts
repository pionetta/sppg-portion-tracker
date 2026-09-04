import { db } from '../db';
import { supabase, isSupabaseConfigured } from '../services/supabase';

export interface SyncEngineStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncTime: string | null;
  cloudConfigured: boolean;
  message?: string;
}

class SyncService {
  private isOnlineState: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private listeners: Array<(status: SyncEngineStatus) => void> = [];
  private isSyncing: boolean = false;
  private lastSyncTime: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnlineState = true;
        this.notify();
        this.syncPendingData();
      });
      window.addEventListener('offline', () => {
        this.isOnlineState = false;
        this.notify();
      });
    }
  }

  public getStatus(): SyncEngineStatus {
    return {
      isOnline: this.isOnlineState,
      isSyncing: this.isSyncing,
      pendingCount: 0,
      lastSyncTime: this.lastSyncTime,
      cloudConfigured: isSupabaseConfigured,
    };
  }

  public subscribe(listener: (status: SyncEngineStatus) => void) {
    this.listeners.push(listener);
    listener(this.getStatus());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    const status = this.getStatus();
    this.listeners.forEach((l) => l(status));
  }

  public async syncPendingData(): Promise<void> {
    if (!this.isOnlineState || this.isSyncing) return;

    this.isSyncing = true;
    this.notify();

    try {
      if (isSupabaseConfigured) {
        // Example cloud push implementation
        const schools = await db.schools.toArray();
        if (schools.length > 0) {
          await supabase.from('schools').upsert(schools);
        }
      }
      this.lastSyncTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } catch (err) {
      console.warn('Sync notice:', err);
    } finally {
      this.isSyncing = false;
      this.notify();
    }
  }
}

export const syncService = new SyncService();
