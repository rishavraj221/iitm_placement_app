// public/service-worker.js
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("my-pwa-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/manifest.json",
        "/icon.png",
        // Add other assets you want to cache here
      ]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
