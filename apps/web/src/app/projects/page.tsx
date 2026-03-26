"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ProjectCard } from "@/components/project-card"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useStore } from "@/lib/store"

export default function ProjectsPage() {
  const { projects, getCapturesForProject } = useStore()

  const active = projects.filter((p) => p.status === "active")
  const other = projects.filter((p) => p.status !== "active")

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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">All Projects</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {projects.length} project{projects.length !== 1 ? "s" : ""} across{" "}
                {[...new Set(projects.map((p) => p.location_name))].join(", ")}
              </p>
            </div>
            <CreateProjectDialog />
          </div>

          {active.length > 0 && (
            <section className="flex flex-col gap-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
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

          {other.length > 0 && (
            <section className="flex flex-col gap-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
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

          {projects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
              <p className="text-muted-foreground">No projects yet.</p>
              <CreateProjectDialog />
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
