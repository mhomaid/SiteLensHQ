"use client"

import type { Capture } from "@/types"
import { cn } from "@/lib/utils"
import { CheckCircle2Icon, CircleDotIcon } from "lucide-react"

interface CaptureTimelineProps {
  captures: Capture[]
  activeId: string | null
  onSelect: (id: string) => void
}

export function CaptureTimeline({ captures, activeId, onSelect }: CaptureTimelineProps) {
  if (captures.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        No captures yet.
      </p>
    )
  }

  const sorted = [...captures].sort((a, b) => a.capture_date.localeCompare(b.capture_date))

  return (
    <div className="relative flex items-start gap-0 overflow-x-auto pb-2">
      {/* connecting line */}
      <div className="absolute top-[18px] left-6 right-6 h-px bg-border" />

      {sorted.map((capture, idx) => {
        const isActive = capture.id === activeId
        const isLatest = idx === sorted.length - 1
        const date = new Date(capture.capture_date)

        return (
          <button
            key={capture.id}
            onClick={() => onSelect(capture.id)}
            className={cn(
              "relative flex flex-col items-center gap-2 min-w-[90px] flex-1 px-2 group",
              "focus:outline-none"
            )}
          >
            <div
              className={cn(
                "relative z-10 flex size-9 items-center justify-center rounded-full border-2 transition-all",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-md"
                  : isLatest
                  ? "border-primary/50 bg-background text-primary hover:border-primary"
                  : "border-border bg-background text-muted-foreground hover:border-muted-foreground"
              )}
            >
              {isActive ? (
                <CircleDotIcon className="size-4" />
              ) : (
                <CheckCircle2Icon className="size-4" />
              )}
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span
                className={cn(
                  "text-xs font-medium leading-none",
                  isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                {date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {date.getFullYear()}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
