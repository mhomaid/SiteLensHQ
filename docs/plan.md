# MASTER BUILD PROMPT — SiteLensHQ MVP
You are a senior staff-level full-stack engineer and product-minded architect.

Your job is to build an end-to-end MVP called **SiteLensHQ** — a drone-powered construction intelligence platform for Saudi Arabia.

This is not a toy app. Build it like a serious prototype that can be shown to construction executives, infrastructure stakeholders, and potential partners in Saudi Arabia within **2 weeks**.

The app should feel premium, practical, and believable.

---

# 1. Product Context

## Product Name
SiteLensHQ

## Product Vision
SiteLensHQ helps construction teams and stakeholders monitor sites using drone imagery, geospatial boundaries, capture timelines, and executive-ready reports.

It turns manual, fragmented site reporting into a centralized digital workflow.

## What the MVP must prove
The MVP should prove that:
1. a project can be created
2. a site boundary can be defined
3. drone captures can be uploaded and organized by date
4. site progress can be viewed over time
5. reports can be generated for stakeholders
6. the system can evolve into a larger construction intelligence platform

---

# 2. Core MVP Scope

Build the following:

## A. Authentication
Keep it simple for MVP:
- basic email/password auth OR mock auth
- one default seeded user is acceptable if needed for speed

## B. Project Management
Users can:
- create a project
- view project list
- open a project detail page
- define or upload a project boundary as GeoJSON
- edit basic project info

Project fields:
- id
- name
- description
- location_name
- boundary_geojson
- created_at
- updated_at

## C. Captures
Each project can have multiple captures over time.

Users can:
- create a capture
- assign a capture date
- add notes
- attach multiple images to a capture
- browse captures in chronological order

Capture fields:
- id
- project_id
- capture_date
- notes
- created_at

## D. Image Uploads
Users can:
- upload multiple drone images
- store files in object storage
- save image metadata in database
- view image gallery per capture

Image fields:
- id
- capture_id
- file_name
- file_url
- content_type
- file_size
- uploaded_at

For MVP:
- use S3-compatible storage if easy
- if local dev is faster, abstract storage behind an interface so we can swap later

## E. Map View
Each project detail page should have a map experience.

Requirements:
- use Mapbox
- render project boundary
- center map to project extent
- show a clean satellite or hybrid style
- allow selecting a capture date from timeline and update the content shown on the page

For MVP:
- if proper orthomosaic generation is too much, do not fake it badly
- instead show boundary + selected capture gallery + capture metadata next to map
- optionally support a simple image overlay placeholder if feasible

## F. Timeline View
Each project should show progress over time:
- horizontal timeline or vertical chronological capture list
- selecting a capture updates the active gallery and summary panel
- show dates clearly
- make this feel executive-friendly

## G. Reporting
Users can generate a simple professional PDF report per project or capture.

PDF should include:
- project name
- location
- selected capture date
- notes
- site summary
- a few images
- generated timestamp

Do not overcomplicate report generation.
A clean HTML-to-PDF flow is acceptable.

## H. Demo Data
Seed the app with at least:
- 2 projects
- 3 captures for one project
- multiple images per capture
- realistic sample names tied to Saudi infrastructure / construction contexts

Examples:
- Riyadh East Infrastructure Package A
- NEOM Logistics Zone Prototype
- Jeddah Industrial Expansion Phase 1

---

# 3. Technical Stack Requirements

## Frontend
Use:
- Next.js latest stable
- TypeScript
- App Router
- Tailwind CSS
- shadcn/ui or a similarly clean component approach
- Mapbox GL JS

## Backend
Preferred:
- Quarkus with Java

Alternative allowed only if it significantly accelerates delivery:
- Rust with Axum

Choose one and stay consistent.

## Database
Use:
- PostgreSQL
- PostGIS enabled if practical

ORM / DB access:
- choose a solid, pragmatic option
- for Java: Hibernate ORM / Panache or jOOQ if appropriate
- keep complexity reasonable

## Storage
Use one of:
- AWS S3
- MinIO for local development
- or local filesystem with clean abstraction

## PDF
Use a simple reliable solution.

## Infrastructure
Build for local development first.
Docker Compose is preferred.

Include:
- app frontend
- backend
- postgres
- minio if used

---

# 4. Architecture Expectations

Use a clean monorepo or clearly structured repo.

Recommended structure:

/SiteLensHQ
  /apps
    /web
    /api
  /infra
  /docs

Or, if easier:

/web
/api
/docker-compose.yml
/README.md
/docs

Backend should have clear modules:
- auth
- projects
- captures
- images
- reports

Frontend should have clear route structure:
- /login
- /dashboard
- /projects
- /projects/[id]
- /projects/[id]/report

---

# 5. UX / UI Expectations

The UI should feel:
- premium
- dark or neutral professional
- clean
- modern
- Saudi enterprise friendly
- not playful

Design references:
- linear
- notion
- modern admin dashboards
- infrastructure / GIS professionalism

Project detail page should feel like the hero page of the app.

Suggested layout:
- top header with project title and actions
- left/main: map
- right: active capture summary
- below: capture timeline
- below or side: image gallery

Dashboard should show:
- active projects
- recent captures
- quick stats

Make the app impressive enough for a live demo.

---

# 6. Business Framing to Preserve in Copy

The product is NOT a “drone media app”.

Throughout UI copy and docs, frame it as:
- construction intelligence
- site visibility
- progress monitoring
- visual reporting
- infrastructure operations

Use language that sounds credible to:
- project managers
- engineering leadership
- infrastructure stakeholders
- government or quasi-government buyers

---

# 7. Delivery Priorities

Prioritize in this exact order:

1. project CRUD
2. capture CRUD
3. image upload
4. project detail page UX
5. timeline switching
6. map rendering with boundary
7. report generation
8. seed/demo data
9. polish
10. auth hardening only if time remains

Do not get stuck on perfect auth or enterprise permissions.

---

# 8. Implementation Rules

## Important Rules
- Do not over-engineer
- Do not introduce microservices
- Do not introduce Kafka
- Do not build AI yet
- Do not build flight planning
- Do not build real drone telemetry ingestion
- Do not spend too much time on orthomosaic generation
- Focus on a believable, clean, demoable MVP

## Code Quality Rules
- strongly typed code
- clean folder structure
- reusable components
- clear environment configuration
- production-style naming
- no placeholder junk code unless clearly marked
- comments only where useful
- include validation and error handling

## API Rules
- REST is fine
- return clean JSON
- document endpoints
- keep contracts consistent

## Frontend Rules
- no broken states
- loading states
- empty states
- clear forms
- polished buttons and tables/cards

---

# 9. What I Want You To Produce

Build the full codebase and also create the following files:

## Root README.md
Must include:
- what SiteLensHQ is
- stack
- setup instructions
- environment variables
- how to run locally
- demo credentials if applicable

## docs/PRD.md
Create a concise but real PRD.

## docs/ARCHITECTURE.md
Document the architecture.

## docs/API.md
List endpoints and payloads.

## docs/DEMO_SCRIPT.md
Provide a step-by-step demo flow I can use with Saudi contacts.

## docs/ROADMAP.md
Outline:
- MVP
- V1
- future AI roadmap

---

# 10. Demo Story to Support

The experience should support this demo narrative:

1. “Here is a Saudi construction project.”
2. “We define the site boundary.”
3. “We upload weekly drone captures.”
4. “We compare progress over time.”
5. “We centralize site reporting.”
6. “We generate stakeholder-ready reports.”
7. “This becomes the operating layer for construction intelligence.”

Everything in the app should reinforce this story.

---

# 11. Saudi-Oriented Sample Data

Use realistic demo content.

## Example project names
- Riyadh North Corridor Package A
- NEOM Logistics Zone Phase 1
- Jeddah Industrial Expansion West Yard

## Example capture notes
- Earthworks progressing in northwest section
- Utility trenching visible near southern boundary
- Stockpile volume increased from prior capture
- Access road alignment now clearly visible

## Example locations
- Riyadh
- NEOM
- Jeddah
- Dammam

---

# 12. Execution Plan

I want you to work in phases.

## Phase 1
Create project scaffolding and architecture.

## Phase 2
Implement backend entities, schema, and APIs.

## Phase 3
Implement frontend dashboard and project workflows.

## Phase 4
Implement upload flow, timeline, and map page.

## Phase 5
Implement report generation and seed data.

## Phase 6
Polish UI and docs.

After each major phase:
- summarize what was completed
- list any assumptions
- list next steps

---

# 13. Output Style

When generating code:
- create actual files
- be concrete
- do not stay abstract
- make pragmatic decisions
- avoid asking too many questions
- make best-effort assumptions and move forward

If a technical choice must be made, prefer:
- speed
- clarity
- demo quality
- future extensibility

---

# 14. Stretch Goal If Time Allows

If feasible, add one of these:
- before/after capture compare slider
- annotation pins on map
- executive summary cards
- project health indicator
- upload drag-and-drop UX polish

But only after core MVP is working.

---

# 15. Final Goal

At the end, I should have:
- a working local MVP
- a polished UI
- sample Saudi-focused demo data
- markdown docs
- something credible enough to show decision-makers in 2 weeks

Start now by:
1. proposing final repo structure
2. selecting the backend implementation path
3. generating the initial file tree
4. creating the first pass of the codebase