import { readdir, stat } from 'node:fs/promises'
import { extname, join, relative, resolve } from 'node:path'
import sharp from 'sharp'

const publicDirectory = resolve('public')
const sourceAssetsDirectory = resolve('source-assets')
const scenesDirectory = join(publicDirectory, 'scenes')

async function filesInside(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? filesInside(join(directory, entry.name))
    : [join(directory, entry.name)]))).flat()
}

async function fileSize(path) {
  return (await stat(path)).size
}

const sceneSources = (await filesInside(scenesDirectory)).filter(path => extname(path).toLowerCase() === '.webp')
let sourceBytes = 0
let optimizedBytes = 0

for (const source of sceneSources) {
  const destination = source.replace(/\.webp$/i, '.avif')
  await sharp(source).avif({ quality: 58, effort: 5 }).toFile(destination)
  sourceBytes += await fileSize(source)
  optimizedBytes += await fileSize(destination)
  console.log(`${relative(publicDirectory, source)} -> ${relative(publicDirectory, destination)}`)
}

const promoSource = join(sourceAssetsDirectory, 'Live Ride (Tracking).png')
const promoDestination = join(publicDirectory, 'live-ride-tracking.webp')
await sharp(promoSource).resize({ width: 240, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toFile(promoDestination)

const socialSource = join(sourceAssetsDirectory, 'social-preview.png')
const socialDestination = join(publicDirectory, 'social-preview.jpg')
await sharp(socialSource).jpeg({ quality: 82, mozjpeg: true }).toFile(socialDestination)

const saved = sourceBytes - optimizedBytes
console.log(`Scene AVIF variants: ${(optimizedBytes / 1024 / 1024).toFixed(2)} MB (${(saved / 1024 / 1024).toFixed(2)} MB smaller than WebP fallbacks)`)
console.log(`Promo WebP: ${((await fileSize(promoDestination)) / 1024).toFixed(0)} KB`)
console.log(`Social preview JPEG: ${((await fileSize(socialDestination)) / 1024).toFixed(0)} KB`)
