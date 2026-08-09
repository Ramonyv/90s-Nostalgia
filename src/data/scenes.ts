export type SceneId = 'salon' | 'truck' | 'railway' | 'school' | 'cricket' | 'tv' | 'rain' | 'gaming' | 'cassette-shop' | 'bus-stand' | 'village'
export type AmbientKind = 'room' | 'road' | 'station' | 'classroom' | 'lane' | 'television' | 'rain' | 'arcade' | 'cassette' | 'bus-stand' | 'village'
export type Hotspot = { x: number; y: number; label: string; align?: 'left' | 'right'; action?: 'spotify' }
export type RainRipple = { x: number; y: number; width: number; delay?: number }

export type Scene = {
  id: SceneId
  slug: string
  navLabel: string
  title: string
  hindiTitle: string
  year: string
  description: string
  shortLine: string
  desktopBackground: string
  mobileBackground: string
  backgroundVideo?: string
  mobileVideo?: string
  fallbackImage: string
  ambientAudio: AmbientKind
  accentColor: string
  hotspots: Hotspot[]
  animation: { dust: boolean; dustCount: number }
  weather?: { type: 'rain'; intensity: 'light' | 'medium' | 'heavy'; opacity: number; angle: number; speed: number; ripples: RainRipple[] }
  availability: 'active' | 'planned'
  primaryNav: boolean
  mobilePosition: string
}

export const scenes: Scene[] = [
  {
    id: 'salon', slug: '/salon', navLabel: 'Salon', title: 'Mohalle ka salon', hindiTitle: 'दिलवाय सैलून', year: '1996',
    description: 'The neighbourhood chair where every story got a trim.', shortLine: 'कुछ यादें कभी पुरानी नहीं होती…', desktopBackground: '/scenes/salon.webp', mobileBackground: '/scenes/salon-mobile.webp', backgroundVideo: '/scenes/salon-loop.mp4', fallbackImage: '/scenes/salon.webp', ambientAudio: 'room', accentColor: '#c95a36', animation: { dust: true, dustCount: 8 }, availability: 'active', primaryNav: true, mobilePosition: '68% center',
    hotspots: [
      { x: 78, y: 37, label: 'Raju Mistri, always on the radio.', align: 'right' },
      { x: 22, y: 82, label: 'Papa ki cycle.' },
      { x: 60, y: 40, label: 'Dates changed slowly back then.' },
    ],
  },
  {
    id: 'truck', slug: '/truck', navLabel: 'Highway', title: 'Highway days', hindiTitle: 'सफ़र लंबा था,', year: '1997',
    description: 'Dusty roads, one cassette, and chai worth stopping for.', shortLine: 'पर जल्दी किसी को नहीं थी।', desktopBackground: '/scenes/truck.webp', mobileBackground: '/scenes/truck-mobile.webp', backgroundVideo: '/scenes/truck-loop.mp4', fallbackImage: '/scenes/truck.webp', ambientAudio: 'road', accentColor: '#dda12e', animation: { dust: true, dustCount: 8 }, availability: 'active', primaryNav: true, mobilePosition: '64% center',
    hotspots: [
      { x: 73, y: 61, label: 'Chai tasted better by the highway.', align: 'right' },
      { x: 58, y: 67, label: 'Long road. One cassette.' },
      { x: 89, y: 49, label: "The driver's playlist.", align: 'right' },
    ],
  },
  {
    id: 'railway', slug: '/railway', navLabel: 'Railway', title: 'Platform no. 2', hindiTitle: 'ट्रेन थोड़ी देर से आती थी,', year: '1995',
    description: 'A platform full of chai, newspapers, and patient journeys.', shortLine: 'पर इंतज़ार अच्छा लगता था।', desktopBackground: '/scenes/railway.webp', mobileBackground: '/scenes/railway-mobile.webp', backgroundVideo: '/scenes/railway-loop.mp4', fallbackImage: '/scenes/railway.webp', ambientAudio: 'station', accentColor: '#62839a', animation: { dust: true, dustCount: 8 }, availability: 'active', primaryNav: true, mobilePosition: '62% center',
    hotspots: [
      { x: 61, y: 78, label: 'One suitcase. Entire family trip.' },
      { x: 34, y: 53, label: 'Chai garam, chai…' },
      { x: 17, y: 66, label: 'The newspaper was part of the journey.' },
    ],
  },
  {
    id: 'school', slug: '/school', navLabel: 'School', title: 'School Days', hindiTitle: 'स्कूल के दिन', year: '1996',
    description: 'Wooden desks, chalk dust, and a clock that moved too slowly.', shortLine: 'Bell bajte hi duniya badal jaati thi.', desktopBackground: '/scenes/school.webp', mobileBackground: '/scenes/school-mobile.webp', backgroundVideo: '/scenes/school-loop.mp4', fallbackImage: '/scenes/school.webp', ambientAudio: 'classroom', accentColor: '#c66b42', animation: { dust: true, dustCount: 7 }, availability: 'active', primaryNav: false, mobilePosition: '58% center',
    hotspots: [
      { x: 52, y: 66, label: 'Steel bottle ka paani hamesha thanda lagta tha.' },
      { x: 76, y: 81, label: 'New session ka best part — books cover karna.', align: 'right' },
      { x: 92, y: 75, label: 'Bag humse zyada heavy hota tha.', align: 'right' },
    ],
  },
  {
    id: 'cricket', slug: '/cricket', navLabel: 'Cricket', title: 'Street Cricket', hindiTitle: 'गली क्रिकेट', year: '1997',
    description: 'Every lane had a pitch, an umpire, and its own rules.', shortLine: 'Boundary wahi thi jahan aunty ka ghar shuru hota tha.', desktopBackground: '/scenes/cricket.webp', mobileBackground: '/scenes/cricket-mobile.webp', backgroundVideo: '/scenes/cricket-loop.mp4', fallbackImage: '/scenes/cricket.webp', ambientAudio: 'lane', accentColor: '#d58a36', animation: { dust: true, dustCount: 8 }, availability: 'active', primaryNav: false, mobilePosition: '67% center',
    hotspots: [
      { x: 72, y: 77, label: 'Stumps? Do ईंटें काफी थीं.', align: 'right' },
      { x: 68, y: 62, label: 'Ball neighbour ke ghar gayi toh game over.' },
      { x: 80, y: 14, label: 'Har match ka ek permanent audience hota tha.', align: 'right' },
    ],
  },
  {
    id: 'tv', slug: '/tv', navLabel: 'TV', title: 'TV Evening', hindiTitle: 'टीवी वाली शाम', year: '1995',
    description: 'The whole room gathered around one flickering screen.', shortLine: 'Ek TV. Puri family.', desktopBackground: '/scenes/tv.webp', mobileBackground: '/scenes/tv-mobile.webp', backgroundVideo: '/scenes/tv-loop.mp4', fallbackImage: '/scenes/tv.webp', ambientAudio: 'television', accentColor: '#5d7891', animation: { dust: true, dustCount: 5 }, availability: 'active', primaryNav: false, mobilePosition: '65% center',
    hotspots: [
      { x: 64, y: 39, label: 'Picture साफ करने के लिए antenna घुमाओ.' },
      { x: 61, y: 82, label: 'Best seat हमेशा TV के सबसे पास.' },
      { x: 70, y: 59, label: 'Channel बदलने के लिए उठना पड़ता था.', align: 'right' },
    ],
  },
  {
    id: 'rain', slug: '/rain', navLabel: 'Rain', title: 'Monsoon Memories', hindiTitle: 'बारिश के दिन', year: '1996',
    description: 'Wet uniforms, paper boats, and one more cup of chai under the awning.', shortLine: 'बारिश रुकने का इंतज़ार किसे था?', desktopBackground: '/scenes/rain/rain.webp', mobileBackground: '/scenes/rain/rain-mobile.webp', backgroundVideo: '/scenes/rain-loop.mp4', fallbackImage: '/scenes/rain/rain.webp', ambientAudio: 'rain', accentColor: '#6f96a5', animation: { dust: false, dustCount: 0 }, weather: { type: 'rain', intensity: 'medium', opacity: .32, angle: -7, speed: 1, ripples: [{ x: 23, y: 89, width: 58 }, { x: 46, y: 83, width: 42, delay: .8 }, { x: 63, y: 91, width: 35, delay: 1.6 }] }, availability: 'active', primaryNav: false, mobilePosition: '72% center',
    hotspots: [
      { x: 22, y: 87, label: 'Notebook ka आखिरी page शायद इसी काम आता था.' },
      { x: 92, y: 57, label: 'Books बचानी थीं. खुद भीग सकते थे.', align: 'right' },
      { x: 74, y: 47, label: 'बारिश + chai. बाकी सब optional.', align: 'right' },
      { x: 78, y: 79, label: 'बारिश में cycle चलाने का अलग ही मज़ा था.', align: 'right' },
    ],
  },
  {
    id: 'gaming', slug: '/gaming', navLabel: 'Gaming', title: 'Video Game Parlour', hindiTitle: 'वीडियो गेम पार्लर', year: '1998',
    description: 'A dark little room where thirty minutes disappeared.', shortLine: '10 रुपये में आधा घंटा.', desktopBackground: '/scenes/gaming.webp', mobileBackground: '/scenes/gaming-mobile.webp', backgroundVideo: '/scenes/gaming-loop.mp4', fallbackImage: '/scenes/gaming.webp', ambientAudio: 'arcade', accentColor: '#648d7d', animation: { dust: false, dustCount: 0 }, availability: 'active', primaryNav: false, mobilePosition: '62% center',
    hotspots: [
      { x: 37, y: 31, label: 'Blow करके फिर लगाओ. अब चलेगा.' },
      { x: 66, y: 71, label: 'Player 2 बनने के लिए भी इंतज़ार.' },
      { x: 80, y: 16, label: 'Half hour खत्म सबसे जल्दी यहीं होता था.', align: 'right' },
    ],
  },
  {
    id: 'cassette-shop', slug: '/cassette-shop', navLabel: 'Cassettes', title: 'Cassette Shop', hindiTitle: 'कैसेट की दुकान', year: '1996',
    description: 'Songs were chosen slowly, recorded carefully, and rewound often.', shortLine: 'Playlist नहीं थी. Mixtape बनती थी.', desktopBackground: '/scenes/cassette-shop.webp', mobileBackground: '/scenes/cassette-shop-mobile.webp', backgroundVideo: '/scenes/cassette-shop-loop.mp4', fallbackImage: '/scenes/cassette-shop.webp', ambientAudio: 'cassette', accentColor: '#b85b3f', animation: { dust: true, dustCount: 5 }, availability: 'active', primaryNav: false, mobilePosition: '69% center',
    hotspots: [
      { x: 72, y: 68, label: 'Side A / Side B — दोनों की planning होती थी.', align: 'right' },
      { x: 61, y: 53, label: 'Cassette rewind emergency tool.' },
      { x: 86, y: 25, label: 'Songs download नहीं होते थे. Record होते थे.', align: 'right' },
    ],
  },
  {
    id: 'bus-stand', slug: '/bus-stand', navLabel: 'Bus Stand', title: 'Bus Stand', hindiTitle: 'बस अड्डा', year: '1996',
    description: 'No timetable felt certain, but everyone eventually got home.', shortLine: 'Bus कब आएगी? किसी को ठीक से नहीं पता था.', desktopBackground: '/scenes/bus-stand.webp', mobileBackground: '/scenes/bus-stand-mobile.webp', backgroundVideo: '/scenes/bus-stand-loop.mp4', fallbackImage: '/scenes/bus-stand.webp', ambientAudio: 'bus-stand', accentColor: '#b8583c', animation: { dust: true, dustCount: 9 }, availability: 'active', primaryNav: false, mobilePosition: '66% center',
    hotspots: [
      { x: 68, y: 57, label: 'Ticket संभाल के रखना.' },
      { x: 76, y: 82, label: 'पूरा सफर एक trunk में.', align: 'right' },
      { x: 76, y: 42, label: 'Window seat मिल जाए तो journey successful.', align: 'right' },
    ],
  },
  {
    id: 'village', slug: '/village', navLabel: 'Village', title: 'Village Summer', hindiTitle: 'गाँव की गर्मियाँ', year: '1995',
    description: 'Hot afternoons, cool shade, and nowhere else to be.', shortLine: 'छुट्टियाँ लंबी थीं. दिन उससे भी लंबे.', desktopBackground: '/scenes/village.webp', mobileBackground: '/scenes/village-mobile.webp', backgroundVideo: '/scenes/village-loop.mp4', fallbackImage: '/scenes/village.webp', ambientAudio: 'village', accentColor: '#71804b', animation: { dust: true, dustCount: 7 }, availability: 'active', primaryNav: false, mobilePosition: '70% center',
    hotspots: [
      { x: 65, y: 61, label: 'Afternoon plans: कुछ नहीं.' },
      { x: 38, y: 81, label: 'Fridge से बेहतर पानी.' },
      { x: 83, y: 79, label: 'Summer का असली subscription.', align: 'right' },
    ],
  },
]

export const plannedSceneIdeas = ['STD / PCO Booth', 'Photo Studio', 'Sunday Market', 'Mela', 'Monsoon School Day', 'Terrace Night', 'Audio / Video Rental Shop'] as const
export const getScene = (pathname: string) => scenes.find(scene => scene.slug === pathname && scene.availability === 'active') ?? scenes[0]
