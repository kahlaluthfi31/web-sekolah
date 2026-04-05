"use client"

import "leaflet/dist/leaflet.css"
import { useEffect, useMemo, useRef, useState } from "react"
import type { Map as LeafletMap, LatLngExpression, Marker as LeafletMarker } from "leaflet"
import L from "leaflet"

const redIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface Props {
  center: [number, number] | null
  marker: [number, number] | null
}

export default function TraceMap({ center, marker }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const markerRef = useRef<LeafletMarker | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // fix leaflet icon path when bundling
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: redIcon.options.iconRetinaUrl,
      iconUrl: redIcon.options.iconUrl,
      shadowUrl: redIcon.options.shadowUrl,
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      markerRef.current = null
    }
  }, [])

  const defaultCenter: LatLngExpression = useMemo(() => center || [-6.9175, 107.6191], [center]) // Bandung fallback
  const targetZoom = center ? 14 : 5

  useEffect(() => {
    if (!mounted) return
    if (!containerRef.current) return

    // Initialize map once
    if (!mapRef.current) {
      const map = L.map(containerRef.current, {
        center: defaultCenter,
        zoom: targetZoom,
        zoomControl: true,
        scrollWheelZoom: true,
      })
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)
      mapRef.current = map
    }

    // Update view
  mapRef.current.setView(defaultCenter, targetZoom)

    // Update marker
    if (marker && marker.length === 2) {
      if (markerRef.current) {
        markerRef.current.setLatLng(marker)
      } else {
        markerRef.current = L.marker(marker, { icon: redIcon }).addTo(mapRef.current)
      }
    } else if (markerRef.current) {
      markerRef.current.remove()
      markerRef.current = null
    }
  }, [mounted, defaultCenter, marker, targetZoom])

  return (
    <>
      <div
        ref={containerRef}
        className="trace-map-root relative isolate z-0 w-full h-full overflow-hidden"
      />

      <style jsx global>{`
        .trace-map-root .leaflet-container,
        .trace-map-root .leaflet-pane,
        .trace-map-root .leaflet-top,
        .trace-map-root .leaflet-bottom {
          z-index: 0 !important;
        }
      `}</style>
    </>
  )
}
