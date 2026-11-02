// BazaGo · service worker: εμφανίζει τις ειδοποιήσεις push και ανοίγει την παραγγελία στο πάτημα.
// Τοποθετείται στη ρίζα της εφαρμογής (/sw.js).
self.addEventListener('push', (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) { d = { title: 'BazaGo', body: event.data && event.data.text() }; }
  event.waitUntil(self.registration.showNotification(d.title || 'BazaGo', {
    body: d.body || '',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: d.tag || undefined,          // νέα ειδοποίηση για την ίδια παραγγελία αντικαθιστά την παλιά
    renotify: !!d.tag,
    data: { url: d.url || '/' },
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url || '/';
  event.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const w of wins) {
      if (new URL(w.url).origin === new URL(url).origin) { await w.focus(); return w.navigate(url); }
    }
    return self.clients.openWindow(url);
  })());
});
