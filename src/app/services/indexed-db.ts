import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface IndexedDbStats {
  dbName: string;
  isReady: boolean;
  vaultCount: number;
  cognitiveCount: number;
  auditCount: number;
  chatCount: number;
  lastSaved: string | null;
  estimatedSizeBytes: number;
}

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private platformId = inject(PLATFORM_ID);
  private db: IDBDatabase | null = null;
  private readonly dbName = 'HectronImperialDB';
  private readonly dbVersion = 1;

  // Signals for reactive UI bindings
  isReady = signal<boolean>(false);
  lastSaved = signal<string>('Nunca');
  syncStatus = signal<'IDLE' | 'SAVING' | 'SYNCED' | 'ERROR'>('IDLE');
  stats = signal<IndexedDbStats>({
    dbName: this.dbName,
    isReady: false,
    vaultCount: 0,
    cognitiveCount: 0,
    auditCount: 0,
    chatCount: 0,
    lastSaved: null,
    estimatedSizeBytes: 0,
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initDatabase().then(() => {
        this.updateStats();
      }).catch((err) => console.warn('IndexedDB initial load error:', err));
    }
  }

  private initDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (!isPlatformBrowser(this.platformId) || typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not supported or running on server'));
        return;
      }

      if (this.db) {
        resolve(this.db);
        return;
      }

      const request = window.indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Vault Logs Store
        if (!db.objectStoreNames.contains('vault_logs')) {
          db.createObjectStore('vault_logs', { keyPath: 'id' });
        }

        // Cognitive History Store
        if (!db.objectStoreNames.contains('cognitive_history')) {
          db.createObjectStore('cognitive_history', { keyPath: 'id' });
        }

        // Astaroth Audit Ledger Store
        if (!db.objectStoreNames.contains('audit_ledger')) {
          db.createObjectStore('audit_ledger', { keyPath: 'id' });
        }

        // Chat History Store
        if (!db.objectStoreNames.contains('chat_history')) {
          db.createObjectStore('chat_history', { keyPath: 'id' });
        }

        // System Snapshots and Metadata
        if (!db.objectStoreNames.contains('app_metadata')) {
          db.createObjectStore('app_metadata', { keyPath: 'key' });
        }
      };

      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.isReady.set(true);
        resolve(this.db);
      };

      request.onerror = (event: Event) => {
        const error = (event.target as IDBOpenDBRequest).error;
        console.error('IndexedDB open error:', error);
        this.isReady.set(false);
        this.syncStatus.set('ERROR');
        reject(error);
      };
    });
  }

  /* ==========================================================
     GENERIC OBJECT STORE OPERATIONS
     ========================================================== */
  private async getStore(
    storeName: string,
    mode: IDBTransactionMode = 'readonly'
  ): Promise<IDBObjectStore> {
    const db = await this.initDatabase();
    const transaction = db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  private putItems<T>(storeName: string, items: T[]): Promise<void> {
    return this.initDatabase().then((db) => {
      return new Promise<void>((resolve, reject) => {
        try {
          const tx = db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);

          // Clear existing to avoid stale items and replace with current snapshot
          store.clear();

          for (const item of items) {
            store.put(item);
          }

          tx.oncomplete = () => {
            resolve();
          };

          tx.onerror = (e) => {
            reject((e.target as IDBTransaction).error);
          };
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  private getAllItems<T>(storeName: string): Promise<T[]> {
    return this.getStore(storeName, 'readonly').then((store) => {
      return new Promise<T[]>((resolve, reject) => {
        const request = store.getAll();

        request.onsuccess = () => {
          resolve((request.result as T[]) || []);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    });
  }

  /* ==========================================================
     VAULT LOGS PERSISTENCE
     ========================================================== */
  async saveVaultLogs<T = unknown>(logs: T[]): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    this.syncStatus.set('SAVING');
    try {
      await this.putItems('vault_logs', logs);
      await this.saveMetadata('vault_last_saved', new Date().toISOString());
      this.lastSaved.set(new Date().toLocaleTimeString());
      this.syncStatus.set('SYNCED');
      this.updateStats();
    } catch (err) {
      console.error('Error saving vault to IndexedDB:', err);
      this.syncStatus.set('ERROR');
    }
  }

  async getVaultLogs<T = unknown>(): Promise<T[]> {
    if (!isPlatformBrowser(this.platformId)) return [];
    try {
      return await this.getAllItems<T>('vault_logs');
    } catch (err) {
      console.warn('Error reading vault from IndexedDB:', err);
      return [];
    }
  }

  /* ==========================================================
     COGNITIVE HISTORY PERSISTENCE
     ========================================================== */
  async saveCognitiveHistory<T = unknown>(history: T[]): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    this.syncStatus.set('SAVING');
    try {
      await this.putItems('cognitive_history', history);
      await this.saveMetadata('cognitive_last_saved', new Date().toISOString());
      this.lastSaved.set(new Date().toLocaleTimeString());
      this.syncStatus.set('SYNCED');
      this.updateStats();
    } catch (err) {
      console.error('Error saving cognitive history to IndexedDB:', err);
      this.syncStatus.set('ERROR');
    }
  }

  async getCognitiveHistory<T = unknown>(): Promise<T[]> {
    if (!isPlatformBrowser(this.platformId)) return [];
    try {
      return await this.getAllItems<T>('cognitive_history');
    } catch (err) {
      console.warn('Error reading cognitive history from IndexedDB:', err);
      return [];
    }
  }

  /* ==========================================================
     ASTAROTH AUDIT LEDGER PERSISTENCE
     ========================================================== */
  async saveAuditLedger<T = unknown>(ledger: T[]): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    this.syncStatus.set('SAVING');
    try {
      await this.putItems('audit_ledger', ledger);
      await this.saveMetadata('audit_last_saved', new Date().toISOString());
      this.lastSaved.set(new Date().toLocaleTimeString());
      this.syncStatus.set('SYNCED');
      this.updateStats();
    } catch (err) {
      console.error('Error saving audit ledger to IndexedDB:', err);
      this.syncStatus.set('ERROR');
    }
  }

  async getAuditLedger<T = unknown>(): Promise<T[]> {
    if (!isPlatformBrowser(this.platformId)) return [];
    try {
      return await this.getAllItems<T>('audit_ledger');
    } catch (err) {
      console.warn('Error reading audit ledger from IndexedDB:', err);
      return [];
    }
  }

  /* ==========================================================
     CHAT HISTORY PERSISTENCE
     ========================================================== */
  async saveChatHistory<T = unknown>(messages: T[]): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const messagesWithIds = (messages as unknown as Record<string, unknown>[]).map((msg, idx) => ({
        ...msg,
        id: msg['id'] || `chat_${Date.now()}_${idx}`
      }));
      await this.putItems('chat_history', messagesWithIds);
      await this.saveMetadata('chat_last_saved', new Date().toISOString());
      this.updateStats();
    } catch (err) {
      console.error('Error saving chat history to IndexedDB:', err);
    }
  }

  async getChatHistory<T = unknown>(): Promise<T[]> {
    if (!isPlatformBrowser(this.platformId)) return [];
    try {
      return await this.getAllItems<T>('chat_history');
    } catch {
      return [];
    }
  }

  /* ==========================================================
     APP METADATA
     ========================================================== */
  async saveMetadata<T = unknown>(key: string, value: T): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const store = await this.getStore('app_metadata', 'readwrite');
      store.put({ key, value, updatedAt: new Date().toISOString() });
    } catch {
      // Ignore metadata put error
    }
  }

  async getMetadata<T = unknown>(key: string): Promise<T | null> {
    if (!isPlatformBrowser(this.platformId)) return null;
    return this.getStore('app_metadata', 'readonly')
      .then((store) => {
        return new Promise<T | null>((resolve) => {
          const req = store.get(key);
          req.onsuccess = () => resolve(req.result ? (req.result.value as T) : null);
          req.onerror = () => resolve(null);
        });
      })
      .catch(() => null);
  }

  /* ==========================================================
     STATS & MAINTENANCE
     ========================================================== */
  async updateStats(): Promise<IndexedDbStats> {
    if (!isPlatformBrowser(this.platformId)) return this.stats();

    try {
      const vaultLogs = await this.getVaultLogs();
      const cogHistory = await this.getCognitiveHistory();
      const auditLedger = await this.getAuditLedger();
      const chatLogs = await this.getChatHistory();
      const lastSavedTime = (await this.getMetadata<string>('vault_last_saved')) || new Date().toISOString();

      const jsonStr = JSON.stringify({ vaultLogs, cogHistory, auditLedger, chatLogs });
      const sizeBytes = new Blob([jsonStr]).size;

      const currentStats: IndexedDbStats = {
        dbName: this.dbName,
        isReady: true,
        vaultCount: vaultLogs.length,
        cognitiveCount: cogHistory.length,
        auditCount: auditLedger.length,
        chatCount: chatLogs.length,
        lastSaved: lastSavedTime,
        estimatedSizeBytes: sizeBytes,
      };

      this.stats.set(currentStats);
      return currentStats;
    } catch {
      return this.stats();
    }
  }

  async clearAllLocalData(): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) return false;
    try {
      const db = await this.initDatabase();
      const stores = ['vault_logs', 'cognitive_history', 'audit_ledger', 'chat_history', 'app_metadata'];
      const tx = db.transaction(stores, 'readwrite');
      stores.forEach((storeName) => {
        tx.objectStore(storeName).clear();
      });

      return new Promise((resolve) => {
        tx.oncomplete = () => {
          this.updateStats();
          resolve(true);
        };
        tx.onerror = () => resolve(false);
      });
    } catch {
      return false;
    }
  }

  async exportJsonBackup(): Promise<string> {
    if (!isPlatformBrowser(this.platformId)) return '{}';
    const vault = await this.getVaultLogs();
    const cognitive = await this.getCognitiveHistory();
    const audit = await this.getAuditLedger();
    const chat = await this.getChatHistory();

    const backup = {
      exportedAt: new Date().toISOString(),
      source: 'HectronImperialDB-IndexedDB',
      data: {
        vault,
        cognitive,
        audit,
        chat,
      },
    };

    return JSON.stringify(backup, null, 2);
  }
}
