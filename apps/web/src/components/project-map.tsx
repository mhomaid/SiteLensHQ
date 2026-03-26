"use client"

import { useEffect, useRef } from "react"
import type { Project } from "@/types"

interface ProjectMapProps {
  project: Project
}

export function ProjectMap({ project }: ProjectMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token || !containerRef.current || mapRef.current) return

    import("mapbox-gl").then(({ default: mapboxgl }) => {
      import("mapbox-gl/dist/mapbox-gl.css")
      mapboxgl.accessToken = token

      const map = new mapboxgl.Map({
        container: containerRef.current!,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: project.center,
        zoom: 13.5,
        attributionControl: false,
      })

      map.addControl(new mapboxgl.NavigationControl(), "top-right")

      map.on("load", () => {
        if (project.boundary_geojson) {
          map.addSource("boundary", {
            type: "geojson",
            data: project.boundary_geojson,
          })
          map.addLayer({
            id: "boundary-fill",
            type: "fill",
            source: "boundary",
            paint: {
              "fill-color": "#3b82f6",
              "fill-opacity": 0.15,
            },
          })
          map.addLayer({
            id: "boundary-line",
            type: "line",
            source: "boundary",
            paint: {
              "line-color": "#3b82f6",
              "line-width": 2,
              "line-dasharray": [2, 1],
            },
          })
        }
      })

      mapRef.current = map
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [project])

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg bg-muted/30 text-center px-6">
        <p className="text-sm font-medium text-muted-foreground">Map unavailable</p>
        <p className="text-xs text-muted-foreground">
          Set <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">NEXT_PUBLIC_MAPBOX_TOKEN</code> to enable the map view.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Center: {project.center[1].toFixed(4)}°N, {project.center[0].toFixed(4)}°E
        </p>
      </div>
    )
  }

  return <div ref={containerRef} className="h-full w-full rounded-lg overflow-hidden" />
}
