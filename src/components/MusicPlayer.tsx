import { Pause, Play, SkipBack, SkipForward, Volume1, VolumeX, Waves } from 'lucide-react'
import type { ReturnTypeAudio } from './types'

const format = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`

export function MusicPlayer({ audio }: { audio: ReturnTypeAudio }) {
  const { track, playing, currentTime, duration, volume, setVolume, toggle, previous, next, seek } = audio
  return <aside className="music-player" aria-label="Music player">
    <div className="cassette-art" style={{ '--cassette': `rgb(${track.palette.join(',')})` } as React.CSSProperties} aria-hidden="true"><span /><span /></div>
    <div className="player-main">
      <div className="track-row"><div><strong>{track.title}</strong><small>{track.artist}</small></div><Waves size={15} aria-hidden="true" /></div>
      <input className="timeline" aria-label="Seek track" type="range" min="0" max={duration || 24} step=".1" value={Math.min(currentTime, duration || 24)} onChange={e => seek(Number(e.target.value))} />
      <div className="player-bottom"><span>{format(currentTime)} / {format(duration)}</span><div className="controls">
        <button onClick={previous} aria-label="Previous track"><SkipBack size={16} /></button>
        <button onClick={toggle} aria-label={playing ? 'Pause music' : 'Play music'} className="play-button">{playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}</button>
        <button onClick={next} aria-label="Next track"><SkipForward size={16} /></button>
      </div><label className="volume">{volume === 0 ? <VolumeX size={14} /> : <Volume1 size={14} />}<input aria-label="Music volume" type="range" min="0" max="1" step=".05" value={volume} onChange={e => setVolume(Number(e.target.value))} /></label></div>
    </div>
  </aside>
}
