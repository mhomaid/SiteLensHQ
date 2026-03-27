"use client"

import { useEffect, useRef, useCallback } from "react"
import type { Project } from "@/types"

interface ProjectsMapPanelProps {
  projects: Project[]
  highlightedId: string | null
  onMarkerClick: (id: string) => void
  onMarkerHover: (id: string | null) => void
}

export function ProjectsMapPanel({
  projects,
  highlightedId,
  onMarkerClick,
  onMarkerHover,
}: ProjectsMapPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map())
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  // Update marker styles when highlighted project changes
  const updateMarkers = useCallback(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement()
      const isActive = id === highlightedId
      el.className = [
        "flex items-center justify-center cursor-pointer",
        "rounded-full border-2 text-xs font-bold shadow-lg",
        "transition-all duration-150 select-none",
        isActive
          ? "size-9 bg-primary border-primary text-primary-foreground scale-110 z-10"
          : "size-8 bg-background border-border text-foreground hover:border-primary hover:scale-105",
      ].join(" ")
    })
  }, [highlightedId])

  useEffect(() => {
    updateMarkers()
  }, [updateMarkers])

  useEffect(() => {
    if (!token || !containerRef.current || mapRef.current) return

    import("mapbox-gl").then(({ default: mapboxgl }) => {
      if (!document.querySelector('link[data-mgl="mapbox-gl"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/mapbox-gl/dist/mapbox-gl.css"
        link.setAttribute("data-mgl", "mapbox-gl")
        document.head.appendChild(link)
      }

      mapboxgl.accessToken = token

      // Fit all project centers
      const lngs = projects.map((p) => p.center[0])
      const lats = projects.map((p) => p.center[1])
      const bounds = new mapboxgl.LngLatBounds(
        [Math.min(...lngs) - 1, Math.min(...lats) - 1],
        [Math.max(...lngs) + 1, Math.max(...lats) + 1]
      )

      const map = new mapboxgl.Map({
        container: containerRef.current!,
        style: "mapbox://styles/mapbox/light-v11",
        attributionControl: false,
        fitBoundsOptions: { padding: 60 },
      })

      map.fitBounds(bounds, { padding: 60, animate: false })
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right")

      map.on("load", () => {
        projects.forEach((project) => {
          const el = document.createElement("div")
          el.className = [
            "flex items-center justify-center cursor-pointer",
            "size-8 rounded-full border-2 border-border bg-background",
            "text-xs font-bold shadow-lg transition-all duration-150 select-none",
          ].join(" ")
          el.textContent = project.location_name.slice(0, 2).toUpperCase()

          el.addEventListener("click", () => onMarkerClick(project.id))
          el.addEventListener("mouseenter", () => onMarkerHover(project.id))
          el.addEventListener("mouseleave", () => onMarkerHover(null))

          const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
            .setLngLat(project.center)
            .addTo(map)

          markersRef.current.set(project.id, marker)
        })

        updateMarkers()
      })

      mapRef.current = map
    })

    return () => {
      markersRef.current.clear()
      mapRef.current?.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (!token) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted/20 text-center px-6">
        <p className="text-sm text-muted-foreground font-medium">Map unavailable</p>
        <p className="text-xs text-muted-foreground">
          Set{" "}
          <code className="rounded bg-muted px-1 font-mono text-xs">
            NEXT_PUBLIC_MAPBOX_TOKEN
          </code>{" "}
          to enable
        </p>
      </div>
    )
  }

  return <div ref={containerRef} className="h-full w-full" />
}
