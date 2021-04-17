const CACHE_NAME = "Sudoku_Solver_cache_v1.0.4";
const URLS_TO_CACHE = [
    "/Sudoku-Solver/",
    "/Sudoku-Solver/index.html",
    "/Sudoku-Solver/global.css",
    "/Sudoku-Solver/manifest.webmanifest",
    "/Sudoku-Solver/serviceWorker.js",
    "/Sudoku-Solver/favicon.png",
    "/Sudoku-Solver/build/bundle.css",
    "/Sudoku-Solver/build/bundle.js"
];

self.addEventListener("install", function (event) {
    event.waitUntil(caches.open(CACHE_NAME)
        .then(function (cache) {
            console.log("Opened Cache");
            return cache.addAll(URLS_TO_CACHE);
        })
    );
})

self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
})

self.addEventListener("activate", function (event) {
    event.waitUntil(
      caches.keys().then(function (cacheNames) {
          return Promise.all(
              cacheNames.map(function (cacheName) {
                  if (cacheName !== CACHE_NAME) {
                      console.log("DELETING CACHE");
                      return caches.delete(cacheName);
                  }
              })
          );
      })
    );
})