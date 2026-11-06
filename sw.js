const CACHE = 'rosalinda-shell-v1';
const SHELL = ['./','./index.html','./styles.css','./app.js','./config.js','./social-pwa.js','./catalogo.json','./manifest.webmanifest','./assets/qr-tienda.png','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install', event => {event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));self.skipWaiting();});
self.addEventListener('activate', event => {event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch', event => {if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>caches.match('./index.html')));return;}
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));});
