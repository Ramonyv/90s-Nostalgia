export type SceneId = 'salon' | 'truck' | 'railway' | 'school' | 'cricket' | 'tv' | 'rain' | 'gaming' | 'cassette-shop' | 'bus-stand' | 'village' | 'auto-rickshaw' | 'adhoori-shaam' | 'highway-adda' | '90s-shaadi' | 'nusrat-night' | 'gulzar-rain' | 'sukoon'
export type AmbientKind = 'room' | 'road' | 'station' | 'classroom' | 'lane' | 'television' | 'rain' | 'arcade' | 'cassette' | 'bus-stand' | 'village' | 'auto-rickshaw' | 'permit-room' | 'baraat' | 'night' | 'pond'
export type HotspotAction = 'spotify' | 'radio' | 'chai' | 'motorcycle' | 'gear6'
export type Hotspot = { x: number; y: number; label: string; align?: 'left' | 'right'; action?: HotspotAction }

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
  videoMuted?: boolean
  fallbackImage: string
  ambientAudio: AmbientKind
  accentColor: string
  hotspots: Hotspot[]
  animation: { dust: boolean; dustCount: number }
  availability: 'active' | 'planned'
  primaryNav: boolean
  mobilePosition: string
  selectorTitle?: string
  selectorSecondary?: string
  seoTitle?: string
  seoDescription?: string
  memoryLabel?: string
  selectorImage?: string
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
    description: 'Wet uniforms, paper boats, and one more cup of chai under the awning.', shortLine: 'बारिश रुकने का इंतज़ार किसे था?', desktopBackground: '/scenes/rain/rain.webp', mobileBackground: '/scenes/rain/rain-mobile.webp', backgroundVideo: '/scenes/rain-loop.mp4', fallbackImage: '/scenes/rain/rain.webp', ambientAudio: 'rain', accentColor: '#6f96a5', animation: { dust: false, dustCount: 0 }, availability: 'active', primaryNav: false, mobilePosition: '72% center',
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
  {
    id: 'auto-rickshaw', slug: '/auto-rickshaw', navLabel: 'Auto Ride', title: 'Auto Ride', hindiTitle: 'ऑटो की सवारी', year: '1997',
    description: 'Warm wind, familiar roads, and an old song somewhere in the traffic.', shortLine: 'हवा चेहरे पर थी, गाने दिल में।', desktopBackground: '/scenes/auto-rickshaw/auto.webp', mobileBackground: '/scenes/auto-rickshaw/auto-mobile.webp', backgroundVideo: '/scenes/auto-rickshaw/Auto%20Rickshaw%20Loop.mp4', videoMuted: true, fallbackImage: '/scenes/auto-rickshaw/auto.webp', ambientAudio: 'auto-rickshaw', accentColor: '#d89b3d', animation: { dust: false, dustCount: 0 }, availability: 'active', primaryNav: false, mobilePosition: '58% center',
    hotspots: [
      { x: 41, y: 61, label: 'मीटर चलता था. अंदाज़ा फिर भी अलग होता था.' },
      { x: 25, y: 49, label: 'AC नहीं था. हवा free थी.' },
      { x: 54, y: 29, label: 'Driver bhaiya को पूरा शहर पता था.' },
      { x: 76, y: 82, label: 'तीन की जगह चार भी बैठ जाते थे.', align: 'right' },
    ],
  },
  {
    id: 'adhoori-shaam', slug: '/adhoori-shaam', navLabel: 'Evening', title: 'An Unfinished Evening', hindiTitle: 'एक अधूरी शाम', year: '1997',
    description: 'A rainy permit-room, an old photograph, and a memory that never quite left.', shortLine: 'कुछ लोग चले जाते हैं, कुछ शामों में रह जाते हैं।', desktopBackground: '/scenes/adhoori-shaam/adhoori-shaam.webp', mobileBackground: '/scenes/adhoori-shaam/adhoori-shaam-mobile.webp', fallbackImage: '/scenes/adhoori-shaam/adhoori-shaam.webp', ambientAudio: 'permit-room', accentColor: '#b57a38', animation: { dust: false, dustCount: 0 }, availability: 'active', primaryNav: false, mobilePosition: 'center',
    hotspots: [
      { x: 49, y: 54, label: 'कुछ तस्वीरें album में नहीं… wallet में रहती थीं।' },
      { x: 51, y: 72, label: 'कुछ शामें धीरे-धीरे खत्म होती थीं।' },
      { x: 79, y: 30, label: 'कुछ लोग चले जाते हैं, कुछ शामों में रह जाते हैं।', align: 'right' },
      { x: 43, y: 42, label: 'कुछ गाने वक्त नहीं बताते… बस याद दिलाते हैं।' },
      { x: 17, y: 45, label: 'बारिश बाहर थी. यादें अंदर।' },
    ],
  },
  {
    id: 'highway-adda', slug: '/highway-adda', navLabel: 'Highway Adda', title: 'Highway Adda', hindiTitle: 'कुछ रास्ते मंज़िल से ज़्यादा याद रहते हैं।', year: '1998',
    description: 'A late-night dhaba stop, old motorcycles, and friendship before group chats.', shortLine: 'जब दोस्ती के लिए नेटवर्क नहीं चाहिए था।', desktopBackground: '/scenes/highway-adda/highway-adda.webp', mobileBackground: '/scenes/highway-adda/highway-adda-mobile.webp', fallbackImage: '/scenes/highway-adda/highway-adda.webp', ambientAudio: 'road', accentColor: '#d8943b', animation: { dust: true, dustCount: 6 }, availability: 'active', primaryNav: true, mobilePosition: 'center',
    hotspots: [
      { x: 89, y: 16, label: 'Radio — tune into the night.', align: 'right', action: 'radio' },
      { x: 56, y: 79, label: 'Chai. Still warm.', action: 'chai' },
      { x: 16, y: 66, label: 'One kick. Maybe two.', action: 'motorcycle' },
      { x: 53, y: 31, label: 'An old club poster.', action: 'gear6' },
    ],
  },
  {
    id: '90s-shaadi', slug: '/90s-shaadi', navLabel: 'Shaadi', title: '90s Shaadi', hindiTitle: '90s की शादी', year: '1997',
    description: 'A neighbourhood baraat of brass, borrowed lights, tangled wires, and relatives who danced anyway.', shortLine: 'जब बारात पूरे मोहल्ले की होती थी।', desktopBackground: '/scenes/90s-shaadi/90s-shaadi.webp', mobileBackground: '/scenes/90s-shaadi/90s-shaadi-mobile.webp', fallbackImage: '/scenes/90s-shaadi/90s-shaadi.webp', ambientAudio: 'baraat', accentColor: '#d89452', animation: { dust: false, dustCount: 0 }, availability: 'active', primaryNav: false, mobilePosition: 'center 46%',
    hotspots: [
      { x: 39, y: 67, label: 'उसकी शादी नहीं थी। नाच फिर भी सबसे ज़्यादा वही रहा।' },
      { x: 54, y: 46, label: 'दूल्हा खुश था… और थोड़ा-सा घबराया हुआ भी।' },
      { x: 72, y: 34, label: 'रोशनी उधार की थी। रौनक पूरे मोहल्ले की।', align: 'right' },
      { x: 18, y: 42, label: 'छतों और बालकनियों की अपनी guest list होती थी।' },
    ],
  },
  {
    id: 'nusrat-night', slug: '/nusrat-night', navLabel: 'Nusrat Night', title: 'Night, Radio & Nusrat', hindiTitle: 'रात, रेडियो और नुसरत', year: '1997',
    description: 'A quiet late-night memory from 1997: cassette music, chai, a ceiling fan and the kind of voice that made the night feel endless.', shortLine: 'कुछ आवाज़ें सुनी नहीं जातीं, महसूस की जाती हैं।', desktopBackground: '/scenes/nusrat-night/nusrat-night.webp', mobileBackground: '/scenes/nusrat-night/nusrat-night-mobile.webp', fallbackImage: '/scenes/nusrat-night/nusrat-night.webp', ambientAudio: 'night', accentColor: '#d5a056', animation: { dust: false, dustCount: 0 }, availability: 'active', primaryNav: false, mobilePosition: 'center', selectorTitle: 'रात, रेडियो और नुसरत', selectorSecondary: 'Night, Radio & Nusrat', seoTitle: 'Night, Radio & Nusrat', seoDescription: 'A quiet late-night memory from 1997: cassette music, chai, a ceiling fan and the kind of voice that made the night feel endless.',
    hotspots: [
      { x: 50, y: 69, label: 'कुछ गाने खत्म हो जाते थे। असर नहीं।' },
      { x: 78, y: 42, label: 'शहर सो जाता था। कुछ लोग नहीं।', align: 'right' },
      { x: 47, y: 75, label: 'चाय ठंडी हो जाती थी, रात नहीं।' },
      { x: 58, y: 77, label: 'कुछ बातें लिखी जाती थीं क्योंकि भेजी नहीं जा सकती थीं।', align: 'right' },
    ],
  },
  {
    id: 'gulzar-rain', slug: '/gulzar-rain', navLabel: 'Gulzar Rain', title: 'Rain, Window & Gulzar', hindiTitle: 'बारिश, खिड़की और गुलज़ार', year: '1998',
    description: 'A monsoon train journey where the rain, the passing landscape and the music stayed longer than the destination.', shortLine: 'कुछ सफ़र मंज़िल के लिए नहीं होते।', desktopBackground: '/scenes/gulzar-rain/gulzar-rain.webp', mobileBackground: '/scenes/gulzar-rain/gulzar-rain-mobile.webp', fallbackImage: '/scenes/gulzar-rain/gulzar-rain.webp', ambientAudio: 'rain', accentColor: '#86a5a4', animation: { dust: false, dustCount: 0 }, availability: 'active', primaryNav: false, mobilePosition: 'center', selectorTitle: 'बारिश, खिड़की और गुलज़ार', selectorSecondary: 'Rain, Window & Gulzar', memoryLabel: 'A MONSOON MEMORY • 1998', seoTitle: 'Rain, Window & Gulzar — A Monsoon Train Memory', seoDescription: 'Step into a cinematic 1998 Indian train journey: rain on the window, chai, a diary and Gulzar songs as the monsoon countryside passes by.',
    hotspots: [
      { x: 45, y: 51, label: 'खिड़की के बाहर शहर बदलते रहे, अंदर एक ही गाना चलता रहा।' },
      { x: 52, y: 78, label: 'चाय ठंडी हुई। सफ़र चलता रहा।' },
      { x: 66, y: 79, label: 'कुछ बातें डायरी के पन्नों तक ही पहुँचीं।' },
      { x: 88, y: 75, label: 'एक बैग में सामान था। बाकी सब यादें थीं।', align: 'right' },
    ],
  },
  {
    id: 'sukoon', slug: '/sukoon', navLabel: 'Sukoon', title: 'Sukoon', hindiTitle: 'सुकून', year: '1996',
    description: 'A quiet interactive fish-pond experience with calming music, soft water ripples and colourful fish — a peaceful corner inside 90s Yaadein.', shortLine: 'बस थोड़ी देर यहीं रुक जाओ।', desktopBackground: '/scenes/sukoon/sukoon.webp', mobileBackground: '/scenes/sukoon/sukoon-mobile.webp', fallbackImage: '/scenes/sukoon/sukoon.webp', ambientAudio: 'pond', accentColor: '#d3ad64', animation: { dust: false, dustCount: 0 }, availability: 'active', primaryNav: true, mobilePosition: 'center', selectorTitle: 'सुकून', selectorSecondary: 'Sukoon', selectorImage: '/scenes/sukoon/sukoon-thumbnail.webp', memoryLabel: 'A QUIET MEMORY • 1996', seoTitle: 'Sukoon — Interactive Fish Pond | 90s Yaadein', seoDescription: 'A quiet interactive fish-pond experience with calming music, soft water ripples and colourful fish — a peaceful corner inside 90s Yaadein.',
    hotspots: [],
  },
]

export const plannedSceneIdeas = ['STD / PCO Booth', 'Photo Studio', 'Sunday Market', 'Mela', 'Monsoon School Day', 'Terrace Night', 'Audio / Video Rental Shop'] as const
export const sceneAvif = (source: string) => source.replace(/\.webp$/i, '.avif')
export const getScene = (pathname: string) => scenes.find(scene => scene.slug === pathname && scene.availability === 'active') ?? scenes[0]
