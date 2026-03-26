export type ProjectStatus = "active" | "on_hold" | "completed"

export interface Project {
  id: string
  name: string
  description: string
  location_name: string
  status: ProjectStatus
  boundary_geojson: GeoJSON.Feature<GeoJSON.Polygon> | null
  center: [number, number] // [lng, lat]
  created_at: string
  updated_at: string
}

export interface Capture {
  id: string
  project_id: string
  capture_date: string
  notes: string
  created_at: string
}

export interface CaptureImage {
  id: string
  capture_id: string
  file_name: string
  file_url: string
  content_type: string
  file_size: number
  uploaded_at: string
}
