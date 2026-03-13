'use client'

import { useEffect, useRef, useState, startTransition } from 'react'
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
}

export interface PannellumConfig {
  default: { firstScene: string }
  scenes: Record<string, PannellumScene>
}

interface VirtualTourViewerProps {
  config: PannellumConfig
  height?: string
  showCoords?: boolean
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pannellum: any
  }
}

export default function VirtualTourViewer({ config, height = '600px', showCoords = false }: VirtualTourViewerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const viewerRef = useRef<any>(null)
  const rafRef = useRef<number | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [viewerError, setViewerError] = useState('')
  const [coords, setCoords] = useState({ pitch: 0, yaw: 0 })
  const [copied, setCopied] = useState(false)
  const [currentSceneTitle, setCurrentSceneTitle] = useState<string>('')

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (viewerRef.current) {
        try { viewerRef.current.destroy() } catch { }
        viewerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!scriptLoaded) return
    if (!containerRef.current) return
    if (!config || !config.default?.firstScene || Object.keys(config.scenes).length === 0) return

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (viewerRef.current) {
      try { viewerRef.current.destroy() } catch { }
      viewerRef.current = null
    }

    startTransition(() => setViewerError(''))

    const firstTitle = config.scenes[config.default.firstScene]?.title ?? config.default.firstScene
    startTransition(() => {
      setCurrentSceneTitle(firstTitle)
    })

    try {
      viewerRef.current = window.pannellum.viewer(containerRef.current, {
        default: {
          firstScene: config.default.firstScene,
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
        },
        scenes: config.scenes,
      })

      viewerRef.current.on('error', (err: string) => {
        console.error('Pannellum error:', err)
        startTransition(() => setViewerError('Gagal memuat gambar. URL tidak bisa diakses (CORS/tidak valid).'))
      })

      viewerRef.current.on('scenechange', (sceneId: string) => {
        const title = config.scenes[sceneId]?.title ?? sceneId
        startTransition(() => {
          setCurrentSceneTitle(title)
        })
      })

      // Override tombol fullscreen Pannellum agar fullscreen wrapper kita (termasuk overlay)
      // Harus lewat user gesture — tambahkan listener setelah Pannellum selesai render
      setTimeout(() => {
        const fsBtn = containerRef.current?.querySelector('.pnlm-fullscreen-toggle-button') as HTMLElement | null
        if (fsBtn && wrapperRef.current) {
          const wrapper = wrapperRef.current
          // Clone button untuk menghapus listener bawaan Pannellum
          const newBtn = fsBtn.cloneNode(true) as HTMLElement
          fsBtn.parentNode?.replaceChild(newBtn, fsBtn)
          newBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
              wrapper.requestFullscreen().catch(() => {/* ignore permission errors */})
            } else {
              document.exitFullscreen().catch(() => {})
            }
          })
        }
      }, 1000)

      const poll = () => {
        if (viewerRef.current && showCoords) {
          setCoords({
            pitch: parseFloat(viewerRef.current.getPitch().toFixed(2)),
            yaw: parseFloat(viewerRef.current.getYaw().toFixed(2)),
          })
        }
        rafRef.current = requestAnimationFrame(poll)
      }
      rafRef.current = requestAnimationFrame(poll)

    } catch (e) {
      console.error('Pannellum init error:', e)
      startTransition(() => setViewerError('Gagal memuat Virtual Tour.'))
    }
  }, [scriptLoaded, config, showCoords])

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
        </div>
      )}
      {!viewerError && !hasScenes && (
        <div style={{ height }} className="flex flex-col items-center justify-center bg-gray-100 text-gray-400">
          <p className="text-sm">Belum ada scene yang tersedia.</p>
        </div>
      )}
      {!viewerError && hasScenes && !scriptLoaded && (
        <div style={{ height }} className="flex items-center justify-center bg-gray-100 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      )}

      <div style={{ display: !viewerError && hasScenes && scriptLoaded ? 'block' : 'none' }}>
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
