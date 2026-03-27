"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ProjectListCard } from "@/components/project-list-card"
import { ProjectsMapPanel } from "@/components/projects-map-panel"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { PlusIcon, FolderKanbanIcon, SlidersHorizontalIcon } from "lucide-react"

const STATUS_FILTERS = ["All", "Active", "On Hold", "Completed"] as const
type StatusFilter = (typeof STATUS_FILTERS)[number]

export default function ProjectsPage() {
  const { projects, getCapturesForProject } = useStore()
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All")
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const filtered = projects.filter((p) => {
    if (statusFilter === "All") return true
    if (statusFilter === "Active") return p.status === "active"
    if (statusFilter === "On Hold") return p.status === "on_hold"
    if (statusFilter === "Completed") return p.status === "completed"
    return true
  })

  const handleMarkerClick = (id: string) => {
    setHighlightedId(id)
    const el = cardRefs.current.get(id)
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="flex flex-col overflow-hidden">
        <SiteHeader title="Projects">
          <Button size="sm" render={<Link href="/projects/new" />}>
            <PlusIcon className="size-4" />
            New Project
          </Button>
        </SiteHeader>

        {/* Filter bar */}
        <div className="flex items-center gap-3 border-b px-6 py-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontalIcon className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter:</span>
          </div>
          {STATUS_FILTERS.map((f) => {
            const count =
              f === "All"
                ? projects.length
                : projects.filter((p) => {
                    if (f === "Active") return p.status === "active"
                    if (f === "On Hold") return p.status === "on_hold"
                    if (f === "Completed") return p.status === "completed"
                    return false
                  }).length
            return (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={[
                  "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  statusFilter === f
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground",
                ].join(" ")}
              >
                {f}
                <Badge
                  variant="outline"
                  className={[
                    "px-1.5 py-0 text-[10px] h-4 rounded-full border-0",
                    statusFilter === f
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  {count}
                </Badge>
              </button>
            )
          })}
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Split layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left — scrollable project list */}
          <div className="flex w-[520px] shrink-0 flex-col overflow-y-auto border-r">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-24 text-center px-8">
                <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                  <FolderKanbanIcon className="size-7 text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">No projects found</p>
                  <p className="text-sm text-muted-foreground">
                    {statusFilter !== "All"
                      ? `No ${statusFilter.toLowerCase()} projects.`
                      : "Create your first construction site to get started."}
                  </p>
                </div>
                {statusFilter === "All" && (
                  <Button render={<Link href="/projects/new" />}>
                    <PlusIcon className="size-4" />
                    Create your first project
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3 p-4">
                {filtered.map((project) => (
                  <div
                    key={project.id}
                    ref={(el) => {
                      if (el) cardRefs.current.set(project.id, el)
                      else cardRefs.current.delete(project.id)
                    }}
                  >
                    <ProjectListCard
                      project={project}
                      captures={getCapturesForProject(project.id)}
                      isHighlighted={highlightedId === project.id}
                      onMouseEnter={() => setHighlightedId(project.id)}
                      onMouseLeave={() => setHighlightedId(null)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — sticky map */}
          <div className="flex-1 relative">
            <ProjectsMapPanel
              projects={filtered}
              highlightedId={highlightedId}
              onMarkerClick={handleMarkerClick}
              onMarkerHover={setHighlightedId}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
