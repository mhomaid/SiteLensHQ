"use client"

import Image from "next/image"
import Link from "next/link"
import type { Project, Capture } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  MapPinIcon,
  CameraIcon,
  CalendarIcon,
  ArrowRightIcon,
  CircleIcon,
} from "lucide-react"

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "text-emerald-500" },
  on_hold: { label: "On Hold", color: "text-amber-500" },
  completed: { label: "Completed", color: "text-blue-500" },
}

interface ProjectListCardProps {
  project: Project
  captures: Capture[]
  isHighlighted?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export function ProjectListCard({
  project,
  captures,
  isHighlighted,
  onMouseEnter,
  onMouseLeave,
}: ProjectListCardProps) {
  const lastCapture = captures[0]
  const { label, color } = STATUS_CONFIG[project.status]

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "group flex gap-4 rounded-xl border bg-card p-4 transition-all duration-150",
        isHighlighted
          ? "border-primary shadow-md shadow-primary/10 ring-1 ring-primary/20"
          : "hover:border-border/80 hover:shadow-sm"
      )}
    >
      {/* Thumbnail */}
      <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-lg bg-muted">
        {project.cover_image ? (
          <Image
            src={project.cover_image}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="176px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <MapPinIcon className="size-8 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1 min-w-0">
            <h3 className="font-semibold text-base leading-tight truncate">
              {project.name}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPinIcon className="size-3.5 shrink-0" />
              <span>{project.location_name}</span>
            </div>
          </div>
          <div className={cn("flex items-center gap-1 shrink-0 text-xs font-medium", color)}>
            <CircleIcon className="size-2 fill-current" />
            {label}
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CameraIcon className="size-3.5" />
              {captures.length} capture{captures.length !== 1 ? "s" : ""}
            </span>
            {lastCapture && (
              <span className="flex items-center gap-1">
                <CalendarIcon className="size-3.5" />
                {new Date(lastCapture.capture_date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          <Button
            size="sm"
            variant="outline"
            className="shrink-0"
            render={<Link href={`/projects/${project.id}`} />}
          >
            View Project
            <ArrowRightIcon className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
