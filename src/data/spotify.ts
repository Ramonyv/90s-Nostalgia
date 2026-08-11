import type { SceneId } from './scenes'

export type SpotifyPlaylist = {
  playlistId: string
  title: string
  sourceUrl: string
  uri: string
  stationLabel: string
  cover?: string
  hindiName?: string
  preservePlayback?: boolean
}

const salonPlaylist: SpotifyPlaylist = {
  playlistId: '7vnd8GlKrfazw3sUQ8gt0q',
  title: 'Raju Mistri Playlist',
  sourceUrl: 'https://open.spotify.com/playlist/7vnd8GlKrfazw3sUQ8gt0q',
  uri: 'spotify:playlist:7vnd8GlKrfazw3sUQ8gt0q',
  stationLabel: 'Salon radio',
}

const memoryPlaylist = (stationLabel: string): SpotifyPlaylist => ({ ...salonPlaylist, stationLabel })

export const spotifyPlaylists: Record<SceneId, SpotifyPlaylist> = {
  salon: salonPlaylist,
  truck: {
    playlistId: '0iT5gTODhpUFGSwqGZUpdG',
    title: 'Highway Playlist',
    sourceUrl: 'https://open.spotify.com/playlist/0iT5gTODhpUFGSwqGZUpdG?si=bcUBy4FuQWyNcN3EDZT7YA',
    uri: 'spotify:playlist:0iT5gTODhpUFGSwqGZUpdG',
    stationLabel: 'Highway radio',
  },
  railway: memoryPlaylist('Railway radio'),
  school: memoryPlaylist('School radio'),
  cricket: memoryPlaylist('Gully radio'),
  tv: memoryPlaylist('TV room radio'),
  rain: {
    playlistId: '1eydFGwTFhx46dvqo2fnbO',
    title: 'Rainy 90s · Monsoon Mixtape',
    sourceUrl: 'https://open.spotify.com/playlist/1eydFGwTFhx46dvqo2fnbO?si=Ko4RGTwtTgSpiENxFFORpQ',
    uri: 'spotify:playlist:1eydFGwTFhx46dvqo2fnbO',
    stationLabel: 'Monsoon mixtape',
    cover: '/covers/rainy-90s.webp',
    hindiName: 'बारिश वाली धुनें',
  },
  gaming: memoryPlaylist('Game parlour radio'),
  'cassette-shop': memoryPlaylist('Cassette shop radio'),
  'bus-stand': memoryPlaylist('Bus stand radio'),
  village: memoryPlaylist('Village radio'),
  'auto-rickshaw': {
    ...memoryPlaylist('City Ride Mix'),
    playlistId: '0YFA8rR63BkCFr3H1g3LGh',
    title: 'City Ride Mix',
    sourceUrl: 'https://open.spotify.com/playlist/0YFA8rR63BkCFr3H1g3LGh?si=s-PnLaC_QvunyUfgREklnQ',
    uri: 'spotify:playlist:0YFA8rR63BkCFr3H1g3LGh',
    hindiName: 'सवारी वाली धुनें',
  },
}

export const getSpotifyEmbedUrl = (playlist: SpotifyPlaylist) => `https://open.spotify.com/embed/playlist/${playlist.playlistId}?utm_source=generator&theme=0`
