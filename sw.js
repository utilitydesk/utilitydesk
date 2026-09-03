// UtilityDesk.in Service Worker
// Version: 6.68.0
const CACHE_VERSION='v6.68.0';
const CACHE_NAME=`utilitydesk-${CACHE_VERSION}`;
const RUNTIME_CACHE=`utilitydesk-runtime-${CACHE_VERSION}`;
const PRECACHE_ASSETS=['/','/index.html','/manifest.json','/search-index.json','/calculators/','/calculators/index.html','/blog/','/blog/index.html','/offline.html'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(PRECACHE_ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(names=>Promise.all(names.filter(name=>name!==CACHE_NAME&&name!==RUNTIME_CACHE).map(name=>caches.delete(name)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url);if(url.origin!==self.location.origin||request.method!=='GET')return;if(/googlesyndication|googletagmanager|google-analytics/.test(url.hostname))return;if(request.mode==='navigate'||request.headers.get('accept')?.includes('text/html')){event.respondWith(networkFirst(request));return}if(/\.(css|js)$/.test(url.pathname)){event.respondWith(networkFirst(request));return}if(isImmutableAsset(url.pathname)){event.respondWith(cacheFirst(request));return}event.respondWith(staleWhileRevalidate(request))});
async function networkFirst(request){try{const response=await fetch(request,{cache:'no-store'});if(response.ok){const cache=await caches.open(RUNTIME_CACHE);await cache.put(request,response.clone())}return response}catch(_){const cached=await caches.match(request);if(cached)return cached;if(request.mode==='navigate'){const offline=await caches.match('/offline.html');if(offline)return offline}return new Response('Offline',{status:503})}}
async function cacheFirst(request){const cached=await caches.match(request);if(cached)return cached;try{const response=await fetch(request);if(response.ok){const cache=await caches.open(RUNTIME_CACHE);await cache.put(request,response.clone())}return response}catch(_){return new Response('Offline',{status:503})}}
async function staleWhileRevalidate(request){const cache=await caches.open(RUNTIME_CACHE);const cached=await cache.match(request);const fresh=fetch(request).then(async response=>{if(response.ok)await cache.put(request,response.clone());return response}).catch(()=>cached||new Response('Offline',{status:503}));return cached||fresh}
function isImmutableAsset(pathname){return /\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/.test(pathname)}
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting();if(event.data==='CLEAR_CACHE')event.waitUntil(caches.keys().then(names=>Promise.all(names.map(name=>caches.delete(name)))))})
