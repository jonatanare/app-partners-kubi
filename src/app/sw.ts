import { defaultCache } from "@serwist/next/worker";
import { Serwist, NetworkFirst, StaleWhileRevalidate, CacheFirst } from "serwist";

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Coupon validation — always fetch fresh data (must never serve stale)
    {
      matcher: /^https:\/\/partners\.getkubi\.com\/portal\/validate/,
      handler: new NetworkFirst({
        cacheName: "validate-page",
        networkTimeoutSeconds: 5,
      }),
    },
    // Dashboard & promotions — show cached, update in background
    {
      matcher: /^https:\/\/partners\.getkubi\.com\/portal\/(dashboard|promotions|profile)/,
      handler: new StaleWhileRevalidate({
        cacheName: "portal-pages",
      }),
    },
    // API calls — network first, 5s timeout fallback to cache
    {
      matcher: ({ url }) =>
        url.pathname.startsWith("/api/partner/") ||
        url.pathname.startsWith("/api/auth/"),
      handler: new NetworkFirst({
        cacheName: "api-cache",
        networkTimeoutSeconds: 5,
      }),
    },
    // Static assets — cache first, long lived
    {
      matcher: /\/_next\/static\/.*/,
      handler: new CacheFirst({
        cacheName: "next-static",
      }),
    },
    // Default strategy for everything else
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();

declare const self: {
  __SW_MANIFEST: (string | { url: string; revision: string | null })[];
};
