/** Generated from the production asset tree during the 2026-08-20 system audit. */
export const largestAssets = [
  ['Auto Rickshaw Loop.mp4', 'Video', 2592410], ['rain-loop.mp4', 'Video', 2499023], ['truck-loop.mp4', 'Video', 2420694], ['village-loop.mp4', 'Video', 2392941], ['railway-loop.mp4', 'Video', 2371882], ['tv-loop.mp4', 'Video', 2364136], ['salon-loop.mp4', 'Video', 2363270], ['gaming-loop.mp4', 'Video', 2336824], ['bus-stand-loop.mp4', 'Video', 2293840], ['bus-stand.webp', 'Desktop image', 378780], ['truck.webp', 'Desktop image', 359056], ['village.webp', 'Desktop image', 355224],
] as const

export const performanceBudgets = [
  ['Desktop hero image', '≤450 KB', 'Current largest optimized desktop scenes are below 380 KB'], ['Mobile hero image', '≤300 KB', 'Sized for narrow screens and cellular delivery'], ['Loop video', '≤2.6 MB', 'Matches the current upper production range; investigate growth'], ['Audio ambience', '≤1.5 MB', 'Load only for the active scene'], ['Playlist artwork', '≤200 KB', 'Use service-hosted artwork where authorized'], ['Blog cover', '≤350 KB', 'Editorial image loaded per article'], ['Initial JS bundle', '≤350 KB gzip', 'Review after every production build'],
] as const

export const formatBytes = (bytes: number) => bytes >= 1_000_000 ? `${(bytes / 1_000_000).toFixed(2)} MB` : `${Math.round(bytes / 1000)} KB`
