export type Hotspot = { x: number; y: number; label: string; align?: 'left' | 'right'; action?: 'spotify' }

export type Scene = {
  id: 'salon' | 'truck' | 'railway'
  slug: string
  navLabel: string
  title: string
  englishTitle: string
  description: string
  background: string
  mobileBackground: string
  video?: string
  mobilePosition: string
  accent: string
  year: string
  ambience: 'room' | 'road' | 'station'
  hotspots: Hotspot[]
}

export const scenes: Scene[] = [
  {
    id: 'salon', slug: '/salon', navLabel: 'Salon', title: 'दिलवाय सैलून', englishTitle: 'Mohalle ka salon',
    description: 'कुछ यादें कभी पुरानी नहीं होती…', background: '/scenes/salon.webp', mobileBackground: '/scenes/salon-mobile.webp', video: '/scenes/salon-loop.mp4', mobilePosition: '68% center', accent: '#c95a36', year: '1996', ambience: 'room',
    hotspots: [
      { x: 78, y: 37, label: 'Raju Mistri, always on the radio.', align: 'right' },
      { x: 22, y: 82, label: 'Papa ki cycle.' },
      { x: 60, y: 40, label: 'Dates changed slowly back then.' },
    ],
  },
  {
    id: 'truck', slug: '/truck', navLabel: 'Highway', title: 'सफ़र लंबा था,', englishTitle: 'Highway days',
    description: 'पर जल्दी किसी को नहीं थी।', background: '/scenes/truck.webp', mobileBackground: '/scenes/truck-mobile.webp', video: '/scenes/truck-loop.mp4', mobilePosition: '64% center', accent: '#dda12e', year: '1997', ambience: 'road',
    hotspots: [
      { x: 73, y: 61, label: 'Chai tasted better by the highway.', align: 'right' },
      { x: 58, y: 67, label: 'Long road. One cassette.' },
      { x: 89, y: 49, label: "The driver's playlist.", align: 'right' },
    ],
  },
  {
    id: 'railway', slug: '/railway', navLabel: 'Railway', title: 'ट्रेन थोड़ी देर से आती थी,', englishTitle: 'Platform no. 2',
    description: 'पर इंतज़ार अच्छा लगता था।', background: '/scenes/railway.webp', mobileBackground: '/scenes/railway-mobile.webp', video: '/scenes/railway-loop.mp4', mobilePosition: '62% center', accent: '#62839a', year: '1995', ambience: 'station',
    hotspots: [
      { x: 61, y: 78, label: 'One suitcase. Entire family trip.' },
      { x: 34, y: 53, label: 'Chai garam, chai…' },
      { x: 17, y: 66, label: 'The newspaper was part of the journey.' },
    ],
  },
]

export const futureMemories = ['School Days', 'Street Cricket', 'TV Evening', 'Video Game Parlour', 'Cassette Shop', 'Bus Stand', 'Village Summer']

export const getScene = (pathname: string) => scenes.find((scene) => scene.slug === pathname) ?? scenes[0]
