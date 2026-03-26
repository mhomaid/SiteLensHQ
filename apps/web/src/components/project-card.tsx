import Link from "next/link"
import type { Project, Capture } from "@/types"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPinIcon, CameraIcon, CalendarIcon, ArrowRightIcon } from "lucide-react"

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

interface ProjectCardProps {
  project: Project
  captures: Capture[]
}

export function ProjectCard({ project, captures }: ProjectCardProps) {
  const lastCapture = captures[0]
  const captureCount = captures.length

  return (
    <Link href={`/projects/${project.id}`} className="group block">
      <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/30 group-hover:-translate-y-0.5">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-snug font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {project.name}
            </CardTitle>
            <Badge
              variant="outline"
              className={`shrink-0 text-xs ${STATUS_STYLES[project.status]}`}
            >
              {STATUS_LABELS[project.status]}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2 text-sm mt-1">
            {project.description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="pt-0 flex flex-col gap-2">
          <div className="w-full border-t pt-3 flex flex-col gap-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPinIcon className="size-3.5 shrink-0" />
              <span>{project.location_name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CameraIcon className="size-3.5 shrink-0" />
              <span>{captureCount} {captureCount === 1 ? "capture" : "captures"}</span>
            </div>
            {lastCapture && (
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="size-3.5 shrink-0" />
                <span>
                  Last capture:{" "}
                  {new Date(lastCapture.capture_date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
          <div className="w-full flex items-center justify-end gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
            <span>View project</span>
            <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
