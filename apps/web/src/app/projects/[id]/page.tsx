"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ProjectMap } from "@/components/project-map"
import { CaptureTimeline } from "@/components/capture-timeline"
import { ImageGallery } from "@/components/image-gallery"
import { CreateCaptureDialog } from "@/components/create-capture-dialog"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import {
  MapPinIcon,
  CameraIcon,
  CalendarIcon,
  FileTextIcon,
  ExternalLinkIcon,
} from "lucide-react"

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  on_hold: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
}

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  on_hold: "On Hold",
  completed: "Completed",
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { getProject, updateProject, getCapturesForProject, getImagesForCapture } = useStore()
  const [activeCapture, setActiveCapture] = useState<string | null>(null)

  const project = getProject(id)
  const captures = project ? getCapturesForProject(id) : []

  useEffect(() => {
    if (captures.length > 0 && !activeCapture) {
      setActiveCapture(captures[0].id)
    }
  }, [captures, activeCapture])

  if (!project && typeof window !== "undefined") {
    notFound()
  }

  if (!project) return null

  const currentCapture = captures.find((c) => c.id === activeCapture) ?? captures[0]
  const currentImages = currentCapture ? getImagesForCapture(currentCapture.id) : []

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
        <SiteHeader title={project.name}>
          <Button
            variant="outline"
            size="sm"
            render={<Link href={`/projects/${id}/report`} />}
          >
            <FileTextIcon className="size-3.5" />
            Generate Report
            <ExternalLinkIcon className="size-3" />
          </Button>
        </SiteHeader>

        <div className="flex flex-1 flex-col gap-0">
          {/* Project Meta Bar */}
          <div className="flex flex-wrap items-center gap-3 px-6 py-3 border-b text-sm text-muted-foreground">
            <Badge
              variant="outline"
              className={STATUS_STYLES[project.status]}
            >
              {STATUS_LABELS[project.status]}
            </Badge>
            <div className="flex items-center gap-1.5">
              <MapPinIcon className="size-3.5" />
              {project.location_name}
            </div>
            <div className="flex items-center gap-1.5">
              <CameraIcon className="size-3.5" />
              {captures.length} captures
            </div>
            {currentCapture && (
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="size-3.5" />
                Active capture:{" "}
                {new Date(currentCapture.capture_date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            )}
          </div>

          {/* Map + Capture Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-0 border-b">
            {/* Map */}
            <div className="relative h-[420px] lg:h-[480px] border-r">
              <ProjectMap
                project={project}
                onBoundarySaved={(geojson) =>
                  updateProject({ ...project, boundary_geojson: geojson, updated_at: new Date().toISOString() })
                }
              />
            </div>

            {/* Capture Summary */}
            <div className="flex flex-col p-5 gap-4 overflow-y-auto">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Active Capture
                </h2>
                <CreateCaptureDialog
                  projectId={id}
                  onCreated={(captureId) => setActiveCapture(captureId)}
                />
              </div>

              {currentCapture ? (
                <>
                  <div className="flex flex-col gap-1">
                    <p className="text-xl font-semibold">
                      {new Date(currentCapture.capture_date).toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {currentImages.length} image{currentImages.length !== 1 ? "s" : ""} · Capture #{captures.indexOf(currentCapture) + 1} of {captures.length}
                    </p>
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-2">
                    <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Site Notes
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground">
                      {currentCapture.notes || "No notes recorded for this capture."}
                    </p>
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-2">
                    <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Project Scope
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4">
                      {project.description}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
                  <CameraIcon className="size-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    No captures yet. Add the first one.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Capture Timeline */}
          <div className="flex flex-col gap-3 px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Capture Timeline
              </h2>
              <span className="text-xs text-muted-foreground">
                {captures.length} capture{captures.length !== 1 ? "s" : ""}
              </span>
            </div>
            <CaptureTimeline
              captures={captures}
              activeId={activeCapture}
              onSelect={setActiveCapture}
            />
          </div>

          {/* Image Gallery */}
          <div className="flex flex-col gap-3 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Imagery
                {currentCapture && (
                  <span className="ml-2 normal-case font-normal text-muted-foreground/70">
                    — {new Date(currentCapture.capture_date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </h2>
              <span className="text-xs text-muted-foreground">
                {currentImages.length} image{currentImages.length !== 1 ? "s" : ""}
              </span>
            </div>
            <ImageGallery images={currentImages} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
