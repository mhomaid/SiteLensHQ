"use client"

import { useEffect, useRef, useState } from "react"
import type { Project } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PencilIcon, CheckIcon, XIcon, Trash2Icon } from "lucide-react"

interface ProjectMapProps {
  project: Project
  onBoundarySaved?: (geojson: GeoJSON.Feature<GeoJSON.Polygon>) => void
}

type DrawMode = "idle" | "drawing" | "editing"

export function ProjectMap({ project, onBoundarySaved }: ProjectMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const drawRef = useRef<MapboxDraw | null>(null)
  const [drawMode, setDrawMode] = useState<DrawMode>("idle")
  const [hasDraft, setHasDraft] = useState(false)
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  useEffect(() => {
    if (!token || !containerRef.current || mapRef.current) return

    let map: mapboxgl.Map
    let draw: MapboxDraw

    Promise.all([
      import("mapbox-gl"),
      import("@mapbox/mapbox-gl-draw"),
    ]).then(([{ default: mapboxgl }, { default: MapboxDraw }]) => {
      // Import CSS dynamically (only in browser)
      const cssLinks = [
        "mapbox-gl/dist/mapbox-gl.css",
        "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css",
      ]
      cssLinks.forEach((href) => {
        if (!document.querySelector(`link[data-mgl="${href}"]`)) {
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = `https://unpkg.com/${href}`
          link.setAttribute("data-mgl", href)
          document.head.appendChild(link)
        }
      })

      mapboxgl.accessToken = token

      map = new mapboxgl.Map({
        container: containerRef.current!,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: project.center,
        zoom: 13.5,
        attributionControl: false,
      })

      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right")

      draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {},
        defaultMode: "simple_select",
        styles: [
          {
            id: "gl-draw-polygon-fill",
            type: "fill",
            filter: ["all", ["==", "$type", "Polygon"]],
            paint: {
              "fill-color": "#3b82f6",
              "fill-opacity": 0.2,
            },
          },
          {
            id: "gl-draw-polygon-stroke",
            type: "line",
            filter: ["all", ["==", "$type", "Polygon"]],
            paint: {
              "line-color": "#3b82f6",
              "line-width": 2,
              "line-dasharray": [2, 1],
            },
          },
          {
            id: "gl-draw-polygon-and-line-vertex-active",
            type: "circle",
            filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"]],
            paint: {
              "circle-radius": 6,
              "circle-color": "#3b82f6",
            },
          },
          {
            id: "gl-draw-polygon-midpoint",
            type: "circle",
            filter: ["all", ["==", "meta", "midpoint"], ["==", "$type", "Point"]],
            paint: {
              "circle-radius": 4,
              "circle-color": "#93c5fd",
            },
          },
        ],
      })

      map.addControl(draw as unknown as mapboxgl.IControl)

      map.on("load", () => {
        // Render existing boundary
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

        map.on("draw.create", () => setHasDraft(true))
        map.on("draw.update", () => setHasDraft(true))
        map.on("draw.delete", () => setHasDraft(false))
      })

      mapRef.current = map
      drawRef.current = draw
    })

    return () => {
      map?.remove()
      mapRef.current = null
      drawRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const startDrawing = () => {
    const draw = drawRef.current
    if (!draw) return
    draw.deleteAll()
    draw.changeMode("draw_polygon")
    setDrawMode("drawing")
    setHasDraft(false)
  }

  const startEditing = () => {
    const draw = drawRef.current
    const map = mapRef.current
    if (!draw || !map || !project.boundary_geojson) return

    // Remove the static boundary layers so draw can take over
    if (map.getLayer("boundary-fill")) map.removeLayer("boundary-fill")
    if (map.getLayer("boundary-line")) map.removeLayer("boundary-line")
    if (map.getSource("boundary")) map.removeSource("boundary")

    draw.deleteAll()
    draw.add(project.boundary_geojson)
    draw.changeMode("direct_select", {
      featureId: draw.getAll().features[0]?.id as string,
    })
    setDrawMode("editing")
    setHasDraft(true)
  }

  const saveBoundary = () => {
    const draw = drawRef.current
    if (!draw) return
    const data = draw.getAll()
    const feature = data.features[0] as GeoJSON.Feature<GeoJSON.Polygon> | undefined
    if (!feature) return

    // Update the static rendered boundary
    const map = mapRef.current
    if (map) {
      const source = map.getSource("boundary") as mapboxgl.GeoJSONSource | undefined
      if (source) {
        source.setData(feature)
      } else {
        map.addSource("boundary", { type: "geojson", data: feature })
        map.addLayer({
          id: "boundary-fill",
          type: "fill",
          source: "boundary",
          paint: { "fill-color": "#3b82f6", "fill-opacity": 0.15 },
        })
        map.addLayer({
          id: "boundary-line",
          type: "line",
          source: "boundary",
          paint: { "line-color": "#3b82f6", "line-width": 2, "line-dasharray": [2, 1] },
        })
      }
    }

    draw.deleteAll()
    draw.changeMode("simple_select")
    onBoundarySaved?.(feature)
    setDrawMode("idle")
    setHasDraft(false)
  }

  const cancelDraw = () => {
    const draw = drawRef.current
    const map = mapRef.current
    if (!draw) return
    draw.deleteAll()
    draw.changeMode("simple_select")

    // Re-render existing boundary if it was removed during edit mode
    if (map && project.boundary_geojson && !map.getSource("boundary")) {
      map.addSource("boundary", { type: "geojson", data: project.boundary_geojson })
      map.addLayer({
        id: "boundary-fill",
        type: "fill",
        source: "boundary",
        paint: { "fill-color": "#3b82f6", "fill-opacity": 0.15 },
      })
      map.addLayer({
        id: "boundary-line",
        type: "line",
        source: "boundary",
        paint: { "line-color": "#3b82f6", "line-width": 2, "line-dasharray": [2, 1] },
      })
    }

    setDrawMode("idle")
    setHasDraft(false)
  }

  const clearBoundary = () => {
    const draw = drawRef.current
    const map = mapRef.current
    if (!draw || !map) return
    draw.deleteAll()
    if (map.getLayer("boundary-fill")) map.removeLayer("boundary-fill")
    if (map.getLayer("boundary-line")) map.removeLayer("boundary-line")
    if (map.getSource("boundary")) map.removeSource("boundary")
    onBoundarySaved?.(null as unknown as GeoJSON.Feature<GeoJSON.Polygon>)
    setDrawMode("idle")
    setHasDraft(false)
  }

  if (!token) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg bg-muted/30 text-center px-6">
        <p className="text-sm font-medium text-muted-foreground">Map unavailable</p>
        <p className="text-xs text-muted-foreground">
          Set{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
            NEXT_PUBLIC_MAPBOX_TOKEN
          </code>{" "}
          in your environment to enable the map.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Site center: {project.center[1].toFixed(4)}°N, {project.center[0].toFixed(4)}°E
        </p>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full rounded-lg overflow-hidden" />

      {/* Boundary toolbar */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 z-10">
        {drawMode === "idle" && (
          <>
            <Button
              size="sm"
              variant="outline"
              className="bg-background/90 backdrop-blur-sm shadow-sm"
              onClick={startDrawing}
            >
              <PencilIcon className="size-3.5" />
              {project.boundary_geojson ? "Redraw Boundary" : "Define Boundary"}
            </Button>
            {project.boundary_geojson && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-background/90 backdrop-blur-sm shadow-sm"
                  onClick={startEditing}
                >
                  Edit Boundary
                </Button>
                <Button
                  size="icon-sm"
                  variant="outline"
                  className="bg-background/90 backdrop-blur-sm shadow-sm text-destructive hover:text-destructive"
                  onClick={clearBoundary}
                >
                  <Trash2Icon className="size-3.5" />
                </Button>
              </>
            )}
          </>
        )}

        {(drawMode === "drawing" || drawMode === "editing") && (
          <>
            {drawMode === "drawing" && (
              <Badge
                variant="outline"
                className="bg-background/90 backdrop-blur-sm text-xs"
              >
                Click to add points · Double-click to finish
              </Badge>
            )}
            <Button
              size="sm"
              className="bg-background/90 backdrop-blur-sm shadow-sm"
              onClick={saveBoundary}
              disabled={!hasDraft}
            >
              <CheckIcon className="size-3.5" />
              Save Boundary
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-background/90 backdrop-blur-sm shadow-sm"
              onClick={cancelDraw}
            >
              <XIcon className="size-3.5" />
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
