import type { Project, Capture, CaptureImage } from "@/types"

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-001",
    name: "Riyadh North Corridor Package A",
    description:
      "Major arterial infrastructure works covering 14 km of the northern expansion corridor. Includes earthworks, utility trenching, and access road alignment for Phase 1 handover.",
    location_name: "Riyadh",
    status: "active",
    center: [46.7219, 24.8607],
    boundary_geojson: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [46.705, 24.848],
            [46.738, 24.848],
            [46.738, 24.873],
            [46.705, 24.873],
            [46.705, 24.848],
          ],
        ],
      },
    },
    created_at: "2025-10-01T08:00:00Z",
    updated_at: "2026-03-18T10:00:00Z",
  },
  {
    id: "proj-002",
    name: "NEOM Logistics Zone Phase 1",
    description:
      "Logistics hub and warehousing cluster serving the wider NEOM development. Current scope covers site preparation, perimeter works, and internal road network.",
    location_name: "NEOM",
    status: "active",
    center: [35.1837, 28.0339],
    boundary_geojson: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [35.165, 28.021],
            [35.202, 28.021],
            [35.202, 28.047],
            [35.165, 28.047],
            [35.165, 28.021],
          ],
        ],
      },
    },
    created_at: "2025-11-15T08:00:00Z",
    updated_at: "2026-03-15T10:00:00Z",
  },
  {
    id: "proj-003",
    name: "Jeddah Industrial Expansion West Yard",
    description:
      "Industrial zone expansion on the western boundary of Jeddah. Scope includes land clearing, drainage works, and foundation preparation for four warehouse blocks.",
    location_name: "Jeddah",
    status: "active",
    center: [39.1568, 21.4979],
    boundary_geojson: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [39.141, 21.485],
            [39.172, 21.485],
            [39.172, 21.511],
            [39.141, 21.511],
            [39.141, 21.485],
          ],
        ],
      },
    },
    created_at: "2025-12-01T08:00:00Z",
    updated_at: "2026-03-20T10:00:00Z",
  },
  {
    id: "proj-004",
    name: "Dammam Port Expansion Terminal 4",
    description:
      "New container terminal and quayside works for the eastern port expansion. Phase 1 covers dredging, sheet pile installation, and crane foundations.",
    location_name: "Dammam",
    status: "on_hold",
    center: [50.1773, 26.4312],
    boundary_geojson: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [50.162, 26.418],
            [50.193, 26.418],
            [50.193, 26.444],
            [50.162, 26.444],
            [50.162, 26.418],
          ],
        ],
      },
    },
    created_at: "2026-01-10T08:00:00Z",
    updated_at: "2026-03-22T10:00:00Z",
  },
]

export const MOCK_CAPTURES: Capture[] = [
  // Riyadh North Corridor
  {
    id: "cap-001",
    project_id: "proj-001",
    capture_date: "2025-10-15",
    notes: "Initial baseline capture. Site clearance complete in northern section. Earthworks yet to commence.",
    created_at: "2025-10-15T14:00:00Z",
  },
  {
    id: "cap-002",
    project_id: "proj-001",
    capture_date: "2025-11-19",
    notes: "Earthworks progressing in northwest section. Utility trenching visible near southern boundary. Stockpile volume increased from baseline.",
    created_at: "2025-11-19T14:00:00Z",
  },
  {
    id: "cap-003",
    project_id: "proj-001",
    capture_date: "2025-12-17",
    notes: "Access road alignment now clearly visible across the full site. Northern earthworks approximately 60% complete.",
    created_at: "2025-12-17T14:00:00Z",
  },
  {
    id: "cap-004",
    project_id: "proj-001",
    capture_date: "2026-01-21",
    notes: "Subgrade preparation underway on main corridor. Drainage channels roughed in. Minor delay on southern utility interface.",
    created_at: "2026-01-21T14:00:00Z",
  },
  {
    id: "cap-005",
    project_id: "proj-001",
    capture_date: "2026-02-18",
    notes: "Base course compaction in progress on northern 8 km. Retaining wall construction commenced at chainage 3+200.",
    created_at: "2026-02-18T14:00:00Z",
  },
  {
    id: "cap-006",
    project_id: "proj-001",
    capture_date: "2026-03-18",
    notes: "Northern section substantially complete. Asphalt primer coat applied. Southern section earthworks 80% done. On track for Phase 1 handover.",
    created_at: "2026-03-18T14:00:00Z",
  },
  // NEOM Logistics Zone
  {
    id: "cap-007",
    project_id: "proj-002",
    capture_date: "2025-12-03",
    notes: "Site mobilisation complete. Perimeter fencing erected. Heavy plant on site. Clearing of vegetation in eastern quadrant underway.",
    created_at: "2025-12-03T14:00:00Z",
  },
  {
    id: "cap-008",
    project_id: "proj-002",
    capture_date: "2026-01-14",
    notes: "Bulk earthworks progressing. Cut-to-fill balance being maintained across the site. Internal road alignment staked out.",
    created_at: "2026-01-14T14:00:00Z",
  },
  {
    id: "cap-009",
    project_id: "proj-002",
    capture_date: "2026-02-11",
    notes: "Internal road network base course 50% complete. Foundation pads for logistics units A1–A4 excavated and formwork in progress.",
    created_at: "2026-02-11T14:00:00Z",
  },
  {
    id: "cap-010",
    project_id: "proj-002",
    capture_date: "2026-03-15",
    notes: "Concrete works for units A1 and A2 at slab level. Structural steelwork delivery received on site. Road network nearing completion.",
    created_at: "2026-03-15T14:00:00Z",
  },
  // Jeddah Industrial
  {
    id: "cap-011",
    project_id: "proj-003",
    capture_date: "2026-01-10",
    notes: "Initial capture. Land clearing 70% complete. Demolition of legacy structures in southwest corner completed.",
    created_at: "2026-01-10T14:00:00Z",
  },
  {
    id: "cap-012",
    project_id: "proj-003",
    capture_date: "2026-02-14",
    notes: "Drainage works progressing. Ground improvement trials underway for warehouse block B. Western access gate infrastructure installed.",
    created_at: "2026-02-14T14:00:00Z",
  },
  {
    id: "cap-013",
    project_id: "proj-003",
    capture_date: "2026-03-20",
    notes: "Foundation excavation commenced for blocks A and B. Perimeter drainage network 90% complete. Geotechnical hold point cleared.",
    created_at: "2026-03-20T14:00:00Z",
  },
  // Dammam Port
  {
    id: "cap-014",
    project_id: "proj-004",
    capture_date: "2026-03-22",
    notes: "Pre-construction survey capture. Existing quayside structure documented. Dredging contractor mobilisation pending approval.",
    created_at: "2026-03-22T14:00:00Z",
  },
]

const CONSTRUCTION_IMAGES = [
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
  "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80",
  "https://images.unsplash.com/photo-1621951753015-740c699ab970?w=800&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&q=80",
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
  "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=800&q=80",
]

function makeImages(captureId: string, count: number, offset = 0): CaptureImage[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `img-${captureId}-${i + 1}`,
    capture_id: captureId,
    file_name: `capture_${captureId}_${String(i + 1).padStart(3, "0")}.jpg`,
    file_url: CONSTRUCTION_IMAGES[(i + offset) % CONSTRUCTION_IMAGES.length],
    content_type: "image/jpeg",
    file_size: Math.floor(Math.random() * 4000000) + 1500000,
    uploaded_at: new Date().toISOString(),
  }))
}

export const MOCK_IMAGES: CaptureImage[] = [
  ...makeImages("cap-001", 4, 0),
  ...makeImages("cap-002", 6, 2),
  ...makeImages("cap-003", 5, 4),
  ...makeImages("cap-004", 7, 1),
  ...makeImages("cap-005", 6, 3),
  ...makeImages("cap-006", 8, 0),
  ...makeImages("cap-007", 5, 2),
  ...makeImages("cap-008", 6, 5),
  ...makeImages("cap-009", 4, 1),
  ...makeImages("cap-010", 7, 3),
  ...makeImages("cap-011", 5, 0),
  ...makeImages("cap-012", 6, 4),
  ...makeImages("cap-013", 4, 2),
  ...makeImages("cap-014", 3, 6),
]
