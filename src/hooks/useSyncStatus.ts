import { useState, useEffect } from 'react';
import { syncService, SyncEngineStatus } from '../repositories/syncRepository';

export function useSyncStatus(): SyncEngineStatus & { triggerSync: () => Promise<void> } {
  const [status, setStatus] = useState<SyncEngineStatus>(syncService.getStatus());

  useEffect(() => {
    const unsubscribe = syncService.subscribe((newStatus) => {
      setStatus(newStatus);
    });
    return unsubscribe;
  }, []);

  const triggerSync = async () => {
    await syncService.syncPendingData();
  };

  return {
    ...status,
    triggerSync,
  };
}
