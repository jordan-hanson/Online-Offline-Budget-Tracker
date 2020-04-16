console.log("Hi this is your service worker.js file!!! ");
const cacheName = "static-cache-v2";
const DATA_cacheName = "data-cache-v1";

self.addEventListener('install', function (evt) {
    evt.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(
                [
                    '/icons/icon-192x192.png',
                    '/icons/icon-512x512.png'
                ],
                console.log("Your files were pre-cached successfully!")
            );
        })
    );

    self.skipWaiting();
});

self.addEventListener("activate", function (evt) {
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== cacheName && key !== DATA_cacheName) {
                        console.log("Removing old cache data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );

    self.clients.claim();
});

self.addEventListener("fetch", function (evt) {
    if (evt.request.url.includes("/api/transaction")) {
        evt.respondWith(
            caches.open(DATA_cacheName).then(cache => {
                return fetch(evt.request)
                    .then(response => {
                        // If the response was good, clone it and store it in the cache.
                        if (response.status === 200) {
                            cache.put(evt.request.url, response.clone());
                        }

                        return response;
                    })
                    .catch(err => {
                        console.log('HIT FIRST CATCH ERROR!!', err)
                        // Network request failed, try to get it from the cache.
                        return cache.match(evt.request);
                    });
            }).catch(err => console.log('Hit second catch error!!!!!', err))
        );

        return;
    }

    evt.respondWith(
        caches.open(cacheName).then(cache => {
            return cache.match(evt.request).then(response => {
                return response || fetch(evt.request);
            });
        })
    );
});
