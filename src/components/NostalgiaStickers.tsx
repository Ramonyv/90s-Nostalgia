import { AnimatePresence, motion } from 'framer-motion'

const sticker = (file: string) => `/Stickers/${file.replace(' ', '%20')}`

const sceneStickers: Record<string, [string, string]> = {
  salon: ['Group 112.png', 'Group 20.png'],
  truck: ['Group 109.png', 'Group 110.png'],
  railway: ['Group 105.png', 'Group 111.png'],
  school: ['Group 104.png', 'Group 97.png'],
  cricket: ['Group 101.png', 'Group 108.png'],
  tv: ['Group 106.png', 'Group 111.png'],
  'tv-room': ['Group 99.png', 'Group 95.png'],
  rain: ['Group 105.png', 'Group 100.png'],
  gaming: ['Group 95.png', 'Group 99.png'],
  'cassette-shop': ['Group 107.png', 'Group 102.png'],
  'bus-stand': ['Group 104.png', 'Group 109.png'],
  village: ['Group 108.png', 'Group 20.png'],
  'auto-rickshaw': ['Group 106.png', 'Group 101.png'],
  'adhoori-shaam': ['Group 96.png', 'Group 107.png'],
  'highway-adda': ['Group 109.png', 'Group 110.png'],
  '90s-shaadi': ['Group 98.png', 'Group 112.png'],
  'nusrat-night': ['Group 107.png', 'Group 96.png'],
}

export function NostalgiaStickers({ sceneId }: { sceneId: string }) {
  const files = sceneStickers[sceneId] ?? sceneStickers.salon
  return <div className="nostalgia-stickers" aria-hidden="true">
    <AnimatePresence mode="popLayout">
      {files.map((file, index) => <motion.img
        className={`nostalgia-sticker nostalgia-sticker--${index + 1}`}
        key={`${sceneId}-${file}`}
        src={sticker(file)}
        alt=""
        draggable={false}
        initial={{ opacity: 0, scale: .72, rotate: index ? 13 : -15 }}
        animate={{ opacity: 1, scale: 1, rotate: index ? 7 : -8 }}
        exit={{ opacity: 0, scale: .78 }}
        transition={{ duration: .65, ease: [0.22, 1, 0.36, 1], delay: .2 + index * .1 }}
      />)}
    </AnimatePresence>
  </div>
}

export function EditorialStickers() {
  return <div className="editorial-stickers" aria-hidden="true">
    <img src={sticker('Group 97.png')} alt="" draggable={false} />
    <img src={sticker('Group 111.png')} alt="" draggable={false} />
    <img src={sticker('Group 102.png')} alt="" draggable={false} />
  </div>
}

export function IntroStickers() {
  return <div className="intro-stickers" aria-hidden="true">
    <motion.img src={sticker('Group 95.png')} alt="" draggable={false} initial={{ opacity: 0, x: -30, rotate: -22 }} animate={{ opacity: 1, x: 0, rotate: -13 }} transition={{ duration: 1, delay: .35 }} />
    <motion.img src={sticker('Group 101.png')} alt="" draggable={false} initial={{ opacity: 0, x: 30, rotate: 20 }} animate={{ opacity: 1, x: 0, rotate: 12 }} transition={{ duration: 1, delay: .5 }} />
  </div>
}
