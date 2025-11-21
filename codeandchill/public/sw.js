const CACHE_NAME = 'code-and-chill-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/favicon.svg',
  // Add other static assets
];

// API endpoints to cache
const CACHEABLE_APIS = [
  '/api/courses',
  '/api/problems',
  '/api/quizzes',
  '/api/user/profile'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (request.destination === 'document' ||
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image') {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Default: network first
  event.respondWith(
    fetch(request)
      .catch(() => caches.match(request))
  );
});

// Handle API requests with cache-first strategy for specific endpoints
async function handleApiRequest(request) {
  const url = new URL(request.url);
  const isCacheable = CACHEABLE_APIS.some(api => url.pathname.startsWith(api));

  if (isCacheable && request.method === 'GET') {
    try {
      // Try cache first
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        // Fetch in background to update cache
        fetch(request)
          .then(response => {
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then(cache => cache.put(request, responseClone));
            }
          })
          .catch(() => { }); // Ignore background fetch errors

        return cachedResponse;
      }

      // Fetch from network
      const response = await fetch(request);
      if (response.ok) {
        const responseClone = response.clone();
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, responseClone);
      }
      return response;
    } catch (error) {
      // Return cached version if available
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      throw error;
    }
  }

  // For non-cacheable APIs, just fetch
  return fetch(request);
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await fetch(request);
    if (response.ok) {
      const responseClone = response.clone();
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, responseClone);
    }
    return response;
  } catch (error) {
    // For navigation requests, return cached index.html
    if (request.destination === 'document') {
      const cachedIndex = await caches.match('/index.html');
      if (cachedIndex) {
        return cachedIndex;
      }
    }
    throw error;
  }
}

// Handle background sync
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);

  if (event.tag === 'progress-sync') {
    event.waitUntil(syncProgress());
  }

  if (event.tag === 'submission-sync') {
    event.waitUntil(syncSubmissions());
  }
});

// Sync progress data
async function syncProgress() {
  try {
    const progressData = await getStoredProgressData();
    if (progressData.length > 0) {
      for (const progress of progressData) {
        await fetch('/api/realtime/progress/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${progress.token}`
          },
          body: JSON.stringify(progress.data)
        });
      }
      // Clear synced data
      await clearStoredProgressData();
      console.log('Service Worker: Progress data synced');
    }
  } catch (error) {
    console.error('Service Worker: Error syncing progress', error);
  }
}

// Sync submission data
async function syncSubmissions() {
  try {
    const submissions = await getStoredSubmissions();
    if (submissions.length > 0) {
      for (const submission of submissions) {
        await fetch('/api/submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${submission.token}`
          },
          body: JSON.stringify(submission.data)
        });
      }
      // Clear synced data
      await clearStoredSubmissions();
      console.log('Service Worker: Submissions synced');
    }
  } catch (error) {
    console.error('Service Worker: Error syncing submissions', error);
  }
}

// Helper functions for IndexedDB operations
async function getStoredProgressData() {
  // Implementation would use IndexedDB
  return [];
}

async function clearStoredProgressData() {
  // Implementation would use IndexedDB
}

async function getStoredSubmissions() {
  // Implementation would use IndexedDB
  return [];
}

async function clearStoredSubmissions() {
  // Implementation would use IndexedDB
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');

  const options = {
    body: 'You have new updates!',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  if (event.data) {
    const data = event.data.json();
    options.body = data.message || options.body;
    options.data = data;
  }

  event.waitUntil(
    self.registration.showNotification('Code & Chill', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');

  event.notification.close();

  if (event.action === 'open' || !event.action) {
    const url = event.notification.data?.url || '/';

    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then((clientList) => {
          // Check if app is already open
          for (const client of clientList) {
            if (client.url.includes(url) && 'focus' in client) {
              return client.focus();
            }
          }
          // Open new window
          if (clients.openWindow) {
            return clients.openWindow(url);
          }
        })
    );
  }
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_COURSE') {
    event.waitUntil(cacheCourse(event.data.courseId));
  }
});

// Cache course content for offline access
async function cacheCourse(courseId) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const courseUrl = `/api/courses/${courseId}`;

    const response = await fetch(courseUrl);
    if (response.ok) {
      await cache.put(courseUrl, response.clone());
      console.log(`Service Worker: Course ${courseId} cached for offline access`);
    }
  } catch (error) {
    console.error('Service Worker: Error caching course', error);
  }
}