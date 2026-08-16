import { useEffect, useRef, useState, type MutableRefObject } from 'react'

const MAX_RIPPLES = 12

const vertexShader = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * .5 + .5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`

const fragmentShader = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_texture;
uniform float u_time;
uniform float u_aspect;
uniform vec2 u_cropScale;
uniform vec2 u_cropOffset;
uniform vec3 u_ripples[${MAX_RIPPLES}];
uniform float u_strengths[${MAX_RIPPLES}];

void main() {
  vec2 displacement = vec2(0.0);
  vec2 aspect = vec2(u_aspect, 1.0);

  for (int i = 0; i < ${MAX_RIPPLES}; i++) {
    float age = u_time - u_ripples[i].z;
    if (age > 0.0 && age < 2.4) {
      vec2 delta = (v_uv - u_ripples[i].xy) * aspect;
      float distanceFromOrigin = length(delta);
      float radius = age * .34;
      float ring = distanceFromOrigin - radius;
      float envelope = exp(-ring * ring * 920.0) * exp(-age * 1.25);
      float wave = sin(ring * 118.0) * envelope * u_strengths[i];
      displacement += normalize(delta + vec2(.00001)) * wave * .018 / aspect;
    }
  }

  vec2 sceneUv = u_cropOffset + clamp(v_uv + displacement, 0.0, 1.0) * u_cropScale;
  vec2 chroma = displacement * .22;
  float red = texture2D(u_texture, clamp(sceneUv + chroma, 0.0, 1.0)).r;
  float green = texture2D(u_texture, sceneUv).g;
  float blue = texture2D(u_texture, clamp(sceneUv - chroma, 0.0, 1.0)).b;
  gl_FragColor = vec4(red, green, blue, 1.0);
}`

type RippleSceneMediaProps = {
  alt: string
  desktopImage: string
  mobileImage: string
  mobilePosition: string
  video?: string
  mobileVideo?: string
  poster: string
  muted: boolean
  videoRef: MutableRefObject<HTMLVideoElement | null>
  onPlay: () => void
  onVideoError: () => void
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function parsePosition(value: string) {
  const normalized = value.trim().replace(/left/g, '0%').replace(/right/g, '100%').replace(/top/g, '0%').replace(/bottom/g, '100%').replace(/center/g, '50%')
  const parts = normalized.split(/\s+/)
  const number = (part: string | undefined) => Math.max(0, Math.min(1, Number.parseFloat(part ?? '50') / 100))
  return [number(parts[0]), number(parts[1] ?? parts[0])] as const
}

export function RippleSceneMedia({ alt, desktopImage, mobileImage, mobilePosition, video, mobileVideo, poster, muted, videoRef, onPlay, onVideoError }: RippleSceneMediaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const [shaderReady, setShaderReady] = useState(false)
  const hasVideo = Boolean(video)

  useEffect(() => {
    videoRef.current = localVideoRef.current
    return () => { videoRef.current = null }
  }, [videoRef, hasVideo])

  useEffect(() => {
    const canvas = canvasRef.current
    const media = hasVideo ? localVideoRef.current : imageRef.current
    if (!canvas || !media || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'high-performance' })
    if (!gl) return
    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShader)
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader)
    if (!vertex || !fragment) return
    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)

    const timeLocation = gl.getUniformLocation(program, 'u_time')
    const aspectLocation = gl.getUniformLocation(program, 'u_aspect')
    const cropScaleLocation = gl.getUniformLocation(program, 'u_cropScale')
    const cropOffsetLocation = gl.getUniformLocation(program, 'u_cropOffset')
    const ripplesLocation = gl.getUniformLocation(program, 'u_ripples[0]')
    const strengthsLocation = gl.getUniformLocation(program, 'u_strengths[0]')
    const rippleData = new Float32Array(MAX_RIPPLES * 3)
    const strengths = new Float32Array(MAX_RIPPLES)
    rippleData.fill(-10)
    let rippleIndex = 0
    let lastTrail = 0
    let lastRippleAt = Number.NEGATIVE_INFINITY
    let frame = 0
    let running = true
    let textureUploaded = false
    let disposed = false
    let ready = false
    const startedAt = performance.now()

    const mediaSize = () => hasVideo
      ? [localVideoRef.current?.videoWidth ?? 0, localVideoRef.current?.videoHeight ?? 0]
      : [imageRef.current?.naturalWidth ?? 0, imageRef.current?.naturalHeight ?? 0]

    const addRipple = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const now = performance.now()
      if (event.type === 'pointermove' && now - lastTrail < 48) return
      lastTrail = now
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const offset = rippleIndex * 3
      rippleData[offset] = (event.clientX - rect.left) / rect.width
      rippleData[offset + 1] = 1 - (event.clientY - rect.top) / rect.height
      rippleData[offset + 2] = (now - startedAt) / 1000
      strengths[rippleIndex] = event.type === 'pointerdown' ? 1.35 : .72
      rippleIndex = (rippleIndex + 1) % MAX_RIPPLES
      lastRippleAt = now
      if (!running) {
        running = true
        frame = requestAnimationFrame(render)
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr))
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
    }

    const render = (now: number) => {
      if (disposed) return
      resize()
      const [mediaWidth, mediaHeight] = mediaSize()
      if (mediaWidth && mediaHeight) {
        try {
          if (hasVideo || !textureUploaded) {
            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, media)
            textureUploaded = true
          }
          const viewportAspect = canvas.clientWidth / canvas.clientHeight
          const sourceAspect = mediaWidth / mediaHeight
          let visibleX = 1
          let visibleY = 1
          if (sourceAspect > viewportAspect) visibleX = viewportAspect / sourceAspect
          else visibleY = sourceAspect / viewportAspect
          const mobile = window.matchMedia('(max-width: 760px)').matches
          const [positionX, positionY] = parsePosition(mobile ? mobilePosition : '50% 50%')
          gl.uniform1f(timeLocation, (now - startedAt) / 1000)
          gl.uniform1f(aspectLocation, viewportAspect)
          gl.uniform2f(cropScaleLocation, visibleX, visibleY)
          gl.uniform2f(cropOffsetLocation, (1 - visibleX) * positionX, (1 - visibleY) * (1 - positionY))
          gl.uniform3fv(ripplesLocation, rippleData)
          gl.uniform1fv(strengthsLocation, strengths)
          gl.drawArrays(gl.TRIANGLES, 0, 6)
          if (!ready) { ready = true; setShaderReady(true) }
        } catch {
          disposed = true
          setShaderReady(false)
          return
        }
      }
      if (!hasVideo && ready && now - lastRippleAt > 2500) {
        running = false
        return
      }
      frame = requestAnimationFrame(render)
    }

    window.addEventListener('pointermove', addRipple, { passive: true })
    window.addEventListener('pointerdown', addRipple, { passive: true })
    frame = requestAnimationFrame(render)
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', addRipple)
      window.removeEventListener('pointerdown', addRipple)
      gl.deleteTexture(texture)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    }
  }, [desktopImage, hasVideo, mobilePosition, video])

  return <div className={`scene-media${shaderReady ? ' scene-media--ripple-ready' : ''}`}>
    {hasVideo ? <video ref={localVideoRef} className="scene-video" poster={poster} autoPlay muted={muted} loop playsInline preload="metadata" aria-hidden="true" onPlay={onPlay} onError={onVideoError}>{mobileVideo && <source media="(max-width: 760px)" src={mobileVideo} type="video/mp4" />}<source src={video} type="video/mp4" /></video> : <picture><source media="(max-width: 760px)" srcSet={mobileImage.replace(/\.webp$/i, '.avif')} type="image/avif" /><source media="(max-width: 760px)" srcSet={mobileImage} type="image/webp" /><source srcSet={desktopImage.replace(/\.webp$/i, '.avif')} type="image/avif" /><img ref={imageRef} className="scene-image" src={desktopImage} alt={alt} fetchPriority="high" decoding="async" /></picture>}
    <canvas ref={canvasRef} className="scene-ripple-canvas" aria-hidden="true" />
  </div>
}
