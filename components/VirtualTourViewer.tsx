'use client'

import { useEffect, useMemo, useRef, useState, startTransition } from 'react'
import Script from 'next/script'
import { Loader2, AlertTriangle, Crosshair, MapPin } from 'lucide-react'

export interface PannellumHotspot {
  pitch: number
  yaw: number
  type: 'scene' | 'info'
  text: string
  sceneId?: string
}

export interface PannellumScene {
  title: string
  panorama: string
  hotSpots: PannellumHotspot[]
  type?: 'equirectangular'
  autoLoad?: boolean
  crossOrigin?: 'anonymous' | ''
}

export interface PannellumConfig {
  default: { firstScene: string }
  scenes: Record<string, PannellumScene>
}

interface VirtualTourViewerProps {
  config: PannellumConfig
  height?: string
  showCoords?: boolean
  activeSceneId?: string
  onSceneChange?: (sceneId: string) => void
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pannellum: any
  }
}

export default function VirtualTourViewer({ config, height = '600px', showCoords = false, activeSceneId, onSceneChange }: VirtualTourViewerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const viewerRef = useRef<any>(null)
  const downscaledScenesRef = useRef<Set<string>>(new Set())
  const originalUrlRef = useRef<Record<string, string>>({})
  const retriedOriginalRef = useRef<Set<string>>(new Set())
  const objectUrlsRef = useRef<string[]>([])
  const [preparedScenes, setPreparedScenes] = useState<Record<string, PannellumScene>>({})
  const [scenesReady, setScenesReady] = useState(false)
  const rafRef = useRef<number | null>(null)
  const sizeObserverRef = useRef<ResizeObserver | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [viewerError, setViewerError] = useState('')
  const [fetchErrorDetail, setFetchErrorDetail] = useState('')
  const [coords, setCoords] = useState({ pitch: 0, yaw: 0 })
  const [copied, setCopied] = useState(false)
  const [currentSceneTitle, setCurrentSceneTitle] = useState<string>('')
  const [containerReady, setContainerReady] = useState(false)

  useEffect(() => {
    const destroyViewer = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      if (viewerRef.current) {
        try { viewerRef.current.destroy?.() } catch { /* ignore */ }
        viewerRef.current = null
      }
      downscaledScenesRef.current = new Set()
  objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u))
  objectUrlsRef.current = []
    }

    return () => {
      destroyViewer()
      if (sizeObserverRef.current) {
        sizeObserverRef.current.disconnect()
        sizeObserverRef.current = null
      }
    }
  }, [])

  // Observe container size to avoid initializing Pannellum when width/height is 0
  useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current
    const checkSize = () => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      setContainerReady(w > 0 && h > 0)
    }

    sizeObserverRef.current = new ResizeObserver(checkSize)
    sizeObserverRef.current.observe(el)
    checkSize()

    return () => {
      sizeObserverRef.current?.disconnect()
      sizeObserverRef.current = null
    }
  }, [])

  const downscalePanorama = async (sceneId: string, url?: string, targetWidth = 2048) => {
    if (!url) return null
    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error('load failed'))
      })
      img.src = url
      await loadPromise

      const width = Math.min(img.width || 0, targetWidth)
      if (!width || !img.height) return null
      const targetHeight = Math.round(img.height * (width / img.width))

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = targetHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return null
      ctx.drawImage(img, 0, 0, width, targetHeight)
      return canvas.toDataURL('image/jpeg', 0.85)
    } catch (e) {
      console.error('Downscale failed for scene', sceneId, e)
      return null
    }
  }

  const getMaxTextureSize = () => {
    if (typeof window === 'undefined') return 0
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    if (!gl) return 0
    const size = gl.getParameter(gl.MAX_TEXTURE_SIZE)
    return typeof size === 'number' && size > 0 ? size : 0
  }

  const prepareScenes = useMemo(() => {
    const entries = Object.entries(config?.scenes ?? {})

    const makeAbsolute = (url: string) => {
      if (!url) return url
      const base = typeof window !== 'undefined' ? window.location.origin : ''
      const isAbsolute = /^https?:\/\//i.test(url)
      const absolute = isAbsolute ? url : `${base}${url}`
      try { return new URL(absolute, base || undefined).toString() } catch { return absolute }
    }

    const toProxy = (absoluteUrl: string) => {
      if (!absoluteUrl) return absoluteUrl
      // Avoid double-proxying
      if (/\/api\/virtual-tour\/proxy\?/i.test(absoluteUrl)) return absoluteUrl
      return `/api/virtual-tour/proxy?url=${encodeURIComponent(absoluteUrl)}`
    }

    const mapped = Object.fromEntries(
      entries.map(([id, scene]) => {
        const absolute = makeAbsolute(scene.panorama)
        const panorama = toProxy(absolute)
        return [
          id,
          {
            type: 'equirectangular',
            autoLoad: true,
            crossOrigin: 'anonymous' as const,
            ...scene,
            panorama,
          },
        ]
      }),
    )

    // cache originals for fallback
    originalUrlRef.current = Object.fromEntries(
      entries.map(([id, scene]) => {
        const absolute = makeAbsolute(scene.panorama)
        return [id, absolute]
      }),
    )

    return mapped
  }, [config])

  // Preprocess scenes: ensure absolute URL, fetch via proxy (fallback to original), set crossOrigin, and downscale if needed
  useEffect(() => {
    let cancelled = false
    const maxTextureSize = getMaxTextureSize() || 4096
    const targetMax = Math.min(4096, maxTextureSize || 4096)
  let hadFetchError = false

  const describe = (id: string, msg: string) => `Scene ${id}: ${msg}`

    setScenesReady(false)
    setPreparedScenes({})

    // Clean previous object URLs to avoid leaks
    objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u))
    objectUrlsRef.current = []

    const ensureScenes = async () => {
      const entries = await Promise.all(
        Object.entries(prepareScenes).map(async ([id, scene]) => {
          let panoramaUrl = scene.panorama
          if (!panoramaUrl) return [id, scene] as const

          const fetchPanorama = async (url: string) => {
            const res = await fetch(url, { cache: 'no-store' })
            if (!res.ok) throw new Error(`status ${res.status}`)
            const blob = await res.blob()
            const objectUrl = URL.createObjectURL(blob)
            objectUrlsRef.current.push(objectUrl)
            return objectUrl
          }

          try {
            panoramaUrl = await fetchPanorama(scene.panorama)
          } catch (e) {
            console.warn('Proxy fetch failed, trying original', id, e)
            const originalUrl = originalUrlRef.current?.[id]
            if (originalUrl && originalUrl !== scene.panorama) {
              try {
                panoramaUrl = await fetchPanorama(originalUrl)
              } catch (e2) {
                hadFetchError = true
                setFetchErrorDetail(describe(id, `proxy & original gagal (${String(e2)})`))
                console.error('Original fetch also failed', id, e2)
                panoramaUrl = scene.panorama
              }
            } else {
              hadFetchError = true
              setFetchErrorDetail(describe(id, `proxy gagal (${String(e)})`))
            }
          }

          try {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
              img.onload = () => resolve(img)
              img.onerror = () => reject(new Error('load failed'))
            })
            img.src = panoramaUrl
            const loaded = await loadPromise

            // Only downscale if larger than targetMax
            if (loaded.width > targetMax) {
              const dataUrl = await downscalePanorama(id, panoramaUrl, targetMax)
              return [id, { ...scene, panorama: dataUrl || panoramaUrl }]
            }
          } catch (e) {
            console.warn('Preprocess scene failed, keep original', id, e)
          }
          return [id, { ...scene, panorama: panoramaUrl }]
        }),
      )

      if (!cancelled) {
        setPreparedScenes(Object.fromEntries(entries))
        setScenesReady(true)
        if (hadFetchError) {
          startTransition(() => setViewerError('Gambar tidak bisa diambil dari server. Pastikan URL panorama aktif atau cek proxy.'))
        }
        if (!hadFetchError) {
          startTransition(() => setFetchErrorDetail(''))
        }
      }
    }

    ensureScenes()
    return () => {
      cancelled = true
    }
  }, [prepareScenes])

  useEffect(() => {
    if (!scriptLoaded) return
    if (!containerRef.current) return
    if (!containerReady) return
  if (!config || !config.default?.firstScene || Object.keys(preparedScenes).length === 0 || !scenesReady) return

    const supportedTextureSize = getMaxTextureSize()
    if (!supportedTextureSize || supportedTextureSize <= 0) {
      startTransition(() => setViewerError('Perangkat atau browser tidak mendukung WebGL. Coba gunakan browser lain atau perbarui driver.'))
      return
    }

    const downscaleTarget = Math.min(2048, supportedTextureSize || 2048)

    const firstSceneKey = preparedScenes[config.default.firstScene]
      ? config.default.firstScene
      : Object.keys(preparedScenes)[0]

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    if (viewerRef.current) {
      try { viewerRef.current.destroy?.() } catch { }
      viewerRef.current = null
    }

  startTransition(() => setViewerError(''))
  startTransition(() => setFetchErrorDetail(''))

    const firstTitle = preparedScenes[firstSceneKey]?.title ?? firstSceneKey
    startTransition(() => {
      setCurrentSceneTitle(firstTitle)
    })

    const destroyViewer = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      if (viewerRef.current) {
        try { viewerRef.current.destroy?.() } catch { /* ignore */ }
        viewerRef.current = null
      }
    }

    try {
      viewerRef.current = window.pannellum.viewer(containerRef.current, {
        default: {
          firstScene: firstSceneKey,
          sceneFadeDuration: 1000,
          autoLoad: true,
          showControls: true,
          showZoomCtrl: true,
          showFullscreenCtrl: true,
          hfov: 100,
          minHfov: 50,
          maxHfov: 120,
          compass: false,
          mouseZoom: true,
          draggable: true,
          // Try to avoid GPU limit issues by capping texture size (ignored if unsupported)
          maxTextureSize: Math.min(4096, supportedTextureSize || 4096),
        },
        scenes: preparedScenes,
      })

      viewerRef.current.on('error', (err: string) => {
        console.error('Pannellum error:', err)
        const currentScene = viewerRef.current?.getScene?.()
        const isTooBig = typeof err === 'string' && /too big for your device|supports images up to 0px/i.test(err)

        if (currentScene && isTooBig && !downscaledScenesRef.current.has(currentScene)) {
          downscaledScenesRef.current.add(currentScene)
          const panoramaUrl = preparedScenes[currentScene]?.panorama
          downscalePanorama(currentScene, panoramaUrl, downscaleTarget).then((dataUrl) => {
            if (!dataUrl || !viewerRef.current) {
              startTransition(() => setViewerError('Gambar terlalu besar untuk perangkat ini. Silakan coba di perangkat lain.'))
              return
            }
            const updated = {
              ...preparedScenes[currentScene],
              panorama: dataUrl,
            }
            viewerRef.current.addScene(currentScene, updated)
            viewerRef.current.loadScene(currentScene)
            startTransition(() => setViewerError(''))
          }).catch(() => {
            startTransition(() => setViewerError('Gambar terlalu besar untuk perangkat ini. Silakan coba di perangkat lain.'))
          })
          return
        }

        // If proxy failed, try the original absolute URL once
        if (currentScene && originalUrlRef.current?.[currentScene] && !retriedOriginalRef.current.has(currentScene)) {
          retriedOriginalRef.current.add(currentScene)
          const originalUrl = originalUrlRef.current[currentScene]
          const updatedScene = {
            ...preparedScenes[currentScene],
            panorama: originalUrl,
          }
          try {
            viewerRef.current.addScene(currentScene, updatedScene)
            viewerRef.current.loadScene(currentScene)
            startTransition(() => setViewerError(''))
            return
          } catch (fallbackErr) {
            console.warn('Fallback to original URL failed', fallbackErr)
          }
        }

        const detail = currentScene ? ` (scene: ${currentScene})` : ''
        startTransition(() => setViewerError(`Gagal memuat gambar. URL tidak bisa diakses (CORS/tidak valid).${detail}`))
      })

      viewerRef.current.on('scenechange', (sceneId: string) => {
        const title = preparedScenes[sceneId]?.title ?? sceneId
        startTransition(() => {
          setCurrentSceneTitle(title)
        })
        onSceneChange?.(sceneId)
      })

      // Override tombol fullscreen Pannellum agar fullscreen wrapper kita (termasuk overlay)
      // Harus lewat user gesture — tambahkan listener setelah Pannellum selesai render
      setTimeout(() => {
        const fsBtn = containerRef.current?.querySelector('.pnlm-fullscreen-toggle-button') as HTMLElement | null
        const parent = fsBtn?.parentElement
        if (fsBtn && parent && wrapperRef.current) {
          const wrapper = wrapperRef.current
          // Clone button untuk menghapus listener bawaan Pannellum
          const newBtn = fsBtn.cloneNode(true) as HTMLElement
          // Pastikan node masih anak parent sebelum replace, hindari NotFoundError
          if (parent.contains(fsBtn)) {
            parent.replaceChild(newBtn, fsBtn)
            newBtn.addEventListener('click', () => {
              if (!document.fullscreenElement) {
                wrapper.requestFullscreen().catch(() => {/* ignore permission errors */})
              } else {
                document.exitFullscreen().catch(() => {})
              }
            })
          }
        }
      }, 1000)

      const poll = () => {
        if (viewerRef.current && showCoords) {
          const rawPitch = viewerRef.current.getPitch?.()
          const rawYaw = viewerRef.current.getYaw?.()
          const pitch = typeof rawPitch === 'number' && isFinite(rawPitch) ? parseFloat(rawPitch.toFixed(2)) : coords.pitch
          const yaw = typeof rawYaw === 'number' && isFinite(rawYaw) ? parseFloat(rawYaw.toFixed(2)) : coords.yaw
          if (pitch !== coords.pitch || yaw !== coords.yaw) {
            setCoords({ pitch, yaw })
          }
        }
        rafRef.current = requestAnimationFrame(poll)
      }
      rafRef.current = requestAnimationFrame(poll)

    } catch (e) {
      console.error('Pannellum init error:', e)
      startTransition(() => setViewerError('Gagal memuat Virtual Tour.'))
    }

    return () => {
      destroyViewer()
    }
    // We intentionally exclude coords from deps to avoid recreating the viewer every mouse move.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoaded, containerReady, config, preparedScenes, scenesReady, showCoords, onSceneChange])

  // Apply external scene change requests
  useEffect(() => {
  if (!viewerRef.current || !activeSceneId || !scenesReady) return
    if (viewerError) startTransition(() => setViewerError(''))
    if (activeSceneId) downscaledScenesRef.current.delete(activeSceneId)
    const current = viewerRef.current.getScene?.()
    if (current !== activeSceneId && config.scenes[activeSceneId]) {
      try {
        viewerRef.current.loadScene(activeSceneId)
      } catch (e) {
        console.error('Failed to switch scene', e)
      }
    }
  }, [activeSceneId, preparedScenes, config.scenes, viewerError, scenesReady])

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${coords.pitch}, ${coords.yaw}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasScenes = config && config.default?.firstScene && Object.keys(config.scenes).length > 0

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css" />
      <style>{`
        /* Sembunyikan title bawaan Pannellum (kita punya overlay sendiri di pojok kiri bawah) */
        .pnlm-title-box { display: none !important; }

        /* Saat fullscreen — pastikan wrapper memenuhi layar */
        :-webkit-full-screen { width: 100vw !important; height: 100vh !important; }
        :-moz-full-screen { width: 100vw !important; height: 100vh !important; }
        :fullscreen { width: 100vw !important; height: 100vh !important; }
      `}</style>

      <Script
        src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
        onError={() => setViewerError('Gagal memuat library Pannellum.')}
      />

      {viewerError && (
        <div style={{ height }} className="flex flex-col items-center justify-center bg-gray-100 text-gray-500 gap-3">
          <AlertTriangle className="w-10 h-10 text-red-400" />
          <p className="text-sm text-center px-4">{viewerError}</p>
          {fetchErrorDetail && <p className="text-xs text-center px-4 text-gray-400">Detail: {fetchErrorDetail}</p>}
        </div>
      )}
      {!viewerError && !hasScenes && (
        <div style={{ height }} className="flex flex-col items-center justify-center bg-gray-100 text-gray-400">
          <p className="text-sm">Belum ada scene yang tersedia.</p>
        </div>
      )}
      {!viewerError && hasScenes && (!scriptLoaded || !scenesReady) && (
        <div style={{ height }} className="flex items-center justify-center bg-gray-100 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      )}

      <div style={{ display: !viewerError && hasScenes && scriptLoaded && scenesReady ? 'block' : 'none' }}>
        {/* wrapperRef: pembungkus yang ikut masuk saat fullscreen */}
        <div ref={wrapperRef} className="relative overflow-hidden" style={{ height, isolation: 'isolate' }}>
          {/* Target Pannellum — TIDAK boleh ada children, Pannellum akan menimpa isinya */}
          <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

          {/* Nama scene — pojok kiri bawah */}
          {currentSceneTitle && (
            <div className="absolute bottom-3 left-3 z-100 flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl pointer-events-none select-none" style={{ maxWidth: '55%' }}>
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-xs font-medium" style={{ overflowWrap: 'break-word', wordBreak: 'break-word', whiteSpace: 'normal' }}>{currentSceneTitle}</span>
            </div>
          )}

          {/* Coords copy — pojok kanan bawah */}
          {showCoords && (
            <button
              onClick={handleCopyCoords}
              title="Klik copy koordinat"
              className="absolute bottom-3 right-3 z-100 flex items-center gap-2 bg-black/70 hover:bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm transition-colors select-none"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Pitch: <strong>{coords.pitch}</strong> &nbsp; Yaw: <strong>{coords.yaw}</strong></span>
              <span className="ml-1 text-gray-300">{copied ? '✓ Copied!' : '(klik copy)'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
