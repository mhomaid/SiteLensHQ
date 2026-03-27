"use client"

import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ProjectCard } from "@/components/project-card"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { PlusIcon, FolderKanbanIcon } from "lucide-react"

export default function ProjectsPage() {
  const { projects, getCapturesForProject } = useStore()

  const active = projects.filter((p) => p.status === "active")
  const other = projects.filter((p) => p.status !== "active")

  const locations = [...new Set(projects.map((p) => p.location_name))]

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
      <SidebarInset>
        <SiteHeader title="Projects" />
        <div className="flex flex-1 flex-col gap-6 p-6">

          {/* Header row */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">All Projects</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {projects.length} project{projects.length !== 1 ? "s" : ""}
                {locations.length > 0 && ` · ${locations.join(", ")}`}
              </p>
            </div>
            <Button render={<Link href="/projects/new" />}>
              <PlusIcon className="size-4" />
              New Project
            </Button>
          </div>

          {/* Active projects */}
          {active.length > 0 && (
            <section className="flex flex-col gap-3">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Active ({active.length})
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {active.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    captures={getCapturesForProject(project.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* On hold / completed */}
          {other.length > 0 && (
            <section className="flex flex-col gap-3">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Other ({other.length})
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {other.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    captures={getCapturesForProject(project.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {projects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                <FolderKanbanIcon className="size-7 text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium">No projects yet</p>
                <p className="text-sm text-muted-foreground">
                  Create your first construction site to get started.
                </p>
              </div>
              <Button render={<Link href="/projects/new" />}>
                <PlusIcon className="size-4" />
                Create your first project
              </Button>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
