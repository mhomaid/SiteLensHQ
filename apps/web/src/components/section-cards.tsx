"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import { useStore } from "@/lib/store"

export function SectionCards() {
  const { projects, captures, images } = useStore()

  const activeProjects = projects.filter((p) => p.status === "active").length
  const now = new Date()
  const thisMonth = captures.filter((c) => {
    const d = new Date(c.capture_date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
  const lastMonth = captures.filter((c) => {
    const d = new Date(c.capture_date)
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return d.getMonth() === prev.getMonth() && d.getFullYear() === prev.getFullYear()
  }).length
  const captureGrowth = lastMonth > 0
    ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
    : 0
  const totalImages = images.length
  const locations = [...new Set(projects.map((p) => p.location_name))]

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Projects</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {activeProjects}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              {projects.length} total
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {activeProjects} site{activeProjects !== 1 ? "s" : ""} under monitoring{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {locations.join(" · ")}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Captures This Month</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {thisMonth}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {captureGrowth >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
              {captureGrowth >= 0 ? "+" : ""}{captureGrowth}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {captureGrowth >= 0 ? "Up" : "Down"} vs last month{" "}
            {captureGrowth >= 0 ? <TrendingUpIcon className="size-4" /> : <TrendingDownIcon className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            {captures.length} captures total across all sites
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Images Uploaded</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalImages}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              +18%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong capture volume <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Avg {captures.length > 0 ? Math.round(totalImages / captures.length) : 0} images per capture
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Captures</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {captures.length}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              All time
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Across {projects.length} project{projects.length !== 1 ? "s" : ""}{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {thisMonth} captured this month
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
