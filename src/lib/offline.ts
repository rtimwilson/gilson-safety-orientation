// IndexedDB utilities for offline data storage
import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface GilsonDB extends DBSchema {
  pendingSubmissions: {
    key: string
    value: {
      id: string
      type: 'orientation' | 'quiz'
      data: Record<string, unknown>
      createdAt: Date
    }
  }
  cachedData: {
    key: string
    value: {
      id: string
      data: Record<string, unknown>
      cachedAt: Date
    }
  }
}

const DB_NAME = 'gilson-safety-db'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<GilsonDB>> | null = null

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<GilsonDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create pending submissions store
        if (!db.objectStoreNames.contains('pendingSubmissions')) {
          db.createObjectStore('pendingSubmissions', { keyPath: 'id' })
        }
        // Create cached data store
        if (!db.objectStoreNames.contains('cachedData')) {
          db.createObjectStore('cachedData', { keyPath: 'id' })
        }
      },
    })
  }
  return dbPromise
}

// Save data for later sync
export async function savePendingSubmission(
  type: 'orientation' | 'quiz',
  data: Record<string, unknown>
) {
  const db = await getDB()
  const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  await db.put('pendingSubmissions', {
    id,
    type,
    data,
    createdAt: new Date(),
  })
  return id
}

// Get all pending submissions
export async function getPendingSubmissions() {
  const db = await getDB()
  return db.getAll('pendingSubmissions')
}

// Remove a submission after successful sync
export async function removePendingSubmission(id: string) {
  const db = await getDB()
  await db.delete('pendingSubmissions', id)
}

// Cache data locally
export async function cacheData(id: string, data: Record<string, unknown>) {
  const db = await getDB()
  await db.put('cachedData', {
    id,
    data,
    cachedAt: new Date(),
  })
}

// Get cached data
export async function getCachedData(id: string) {
  const db = await getDB()
  const result = await db.get('cachedData', id)
  return result?.data
}

// Register service worker
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      })

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              console.log('New version available!')
            }
          })
        }
      })

      console.log('Service worker registered:', registration.scope)
      return registration
    } catch (error) {
      console.error('Service worker registration failed:', error)
    }
  }
  return null
}

// Request background sync (for offline submissions)
export async function requestBackgroundSync(tag: string) {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready
    try {
      await (registration as unknown as { sync: { register: (tag: string) => Promise<void> } }).sync.register(tag)
      console.log('Background sync registered:', tag)
    } catch (error) {
      console.error('Background sync registration failed:', error)
    }
  }
}

// Check if online
export function isOnline() {
  return navigator.onLine
}

// Sync pending submissions when back online
export async function syncPendingSubmissions() {
  if (!isOnline()) return

  const pending = await getPendingSubmissions()

  for (const submission of pending) {
    try {
      const response = await fetch('/api/orientation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission.data),
      })

      if (response.ok) {
        await removePendingSubmission(submission.id)
        console.log('Synced submission:', submission.id)
      }
    } catch (error) {
      console.error('Failed to sync submission:', submission.id, error)
    }
  }
}
