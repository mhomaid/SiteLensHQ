"use client"

import { use } from "react"
import Link from "next/link"
import Image from "next/image"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeftIcon,
  PrinterIcon,
  MapPinIcon,
  CalendarIcon,
  CameraIcon,
  ScanEyeIcon,
} from "lucide-react"

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  on_hold: "On Hold",
  completed: "Completed",
}

export default function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { getProject, getCapturesForProject, getImagesForCapture } = useStore()

  const project = getProject(id)
  const captures = project ? getCapturesForProject(id) : []
  const latestCapture = captures[0]
  const latestImages = latestCapture ? getImagesForCapture(latestCapture.id).slice(0, 6) : []
  const generatedAt = new Date().toLocaleString("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
  })

  if (!project) return null

  return (
    <>
      {/* Print controls — hidden on print */}
      <div className="print:hidden flex items-center gap-3 px-6 py-4 border-b bg-background sticky top-0 z-10">
        <Button variant="ghost" size="sm" render={<Link href={`/projects/${id}`} />}>
          <ArrowLeftIcon className="size-4" />
          Back to Project
        </Button>
        <Separator orientation="vertical" className="h-5" />
        <Button size="sm" onClick={() => window.print()}>
          <PrinterIcon className="size-4" />
          Print / Export PDF
        </Button>
        <span className="ml-auto text-xs text-muted-foreground">
          Use your browser's Print dialog to save as PDF
        </span>
      </div>

      {/* Report body */}
      <div className="max-w-4xl mx-auto px-8 py-10 print:px-12 print:py-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <ScanEyeIcon className="size-5 text-muted-foreground" />
            <span className="text-sm font-semibold tracking-tight">SiteLensHQ</span>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p>Site Intelligence Report</p>
            <p>Generated: {generatedAt}</p>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Project Title */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold leading-tight mb-2">{project.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPinIcon className="size-3.5" />
                  {project.location_name}
                </span>
                <span className="flex items-center gap-1.5">
                  <CameraIcon className="size-3.5" />
                  {captures.length} total captures
                </span>
                {latestCapture && (
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="size-3.5" />
                    Latest: {new Date(latestCapture.capture_date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>
            <Badge variant="outline" className="text-sm px-3 py-1">
              {STATUS_LABELS[project.status]}
            </Badge>
          </div>
        </div>

        {/* Project Description */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Project Scope
          </h2>
          <p className="text-sm leading-relaxed text-foreground">{project.description}</p>
        </section>

        <Separator className="mb-8" />

        {/* Latest Capture Summary */}
        {latestCapture && (
          <section className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Latest Capture Summary
            </h2>
            <div className="rounded-lg border p-4 bg-muted/30">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold text-base">
                    {new Date(latestCapture.capture_date).toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {getImagesForCapture(latestCapture.id).length} images captured
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Capture #{captures.length}
                </Badge>
              </div>
              <p className="text-sm leading-relaxed">{latestCapture.notes || "No notes recorded."}</p>
            </div>
          </section>
        )}

        {/* Capture History */}
        {captures.length > 1 && (
          <section className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Capture History
            </h2>
            <div className="flex flex-col gap-2">
              {captures.map((c, idx) => (
                <div
                  key={c.id}
                  className="flex items-start gap-4 text-sm py-2 border-b last:border-none"
                >
                  <span className="text-muted-foreground w-6 shrink-0 text-right">{idx + 1}</span>
                  <span className="font-medium w-40 shrink-0">
                    {new Date(c.capture_date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-muted-foreground line-clamp-2 flex-1">{c.notes}</span>
                  <span className="shrink-0 text-muted-foreground text-xs">
                    {getImagesForCapture(c.id).length} img
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <Separator className="mb-8" />

        {/* Image Grid */}
        {latestImages.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Site Imagery — Latest Capture
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {latestImages.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-video overflow-hidden rounded-md border bg-muted"
                >
                  <Image
                    src={img.file_url}
                    alt={img.file_name}
                    fill
                    className="object-cover"
                    sizes="33vw"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <Separator className="mb-6" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>SiteLensHQ — Construction Intelligence Platform</span>
          <span>Confidential — For internal use only</span>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </>
  )
}
