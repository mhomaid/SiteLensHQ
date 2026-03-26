"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartData = [
  { date: "2025-10-01", riyadh: 14, neom: 8 },
  { date: "2025-10-08", riyadh: 18, neom: 11 },
  { date: "2025-10-15", riyadh: 12, neom: 9 },
  { date: "2025-10-22", riyadh: 21, neom: 14 },
  { date: "2025-10-29", riyadh: 16, neom: 10 },
  { date: "2025-11-05", riyadh: 24, neom: 17 },
  { date: "2025-11-12", riyadh: 19, neom: 13 },
  { date: "2025-11-19", riyadh: 28, neom: 20 },
  { date: "2025-11-26", riyadh: 22, neom: 15 },
  { date: "2025-12-03", riyadh: 31, neom: 22 },
  { date: "2025-12-10", riyadh: 26, neom: 18 },
  { date: "2025-12-17", riyadh: 34, neom: 24 },
  { date: "2025-12-24", riyadh: 20, neom: 12 },
  { date: "2025-12-31", riyadh: 29, neom: 21 },
  { date: "2026-01-07", riyadh: 38, neom: 27 },
  { date: "2026-01-14", riyadh: 33, neom: 23 },
  { date: "2026-01-21", riyadh: 41, neom: 30 },
  { date: "2026-01-28", riyadh: 36, neom: 25 },
  { date: "2026-02-04", riyadh: 44, neom: 32 },
  { date: "2026-02-11", riyadh: 39, neom: 28 },
  { date: "2026-02-18", riyadh: 47, neom: 34 },
  { date: "2026-02-25", riyadh: 42, neom: 31 },
  { date: "2026-03-04", riyadh: 51, neom: 37 },
  { date: "2026-03-11", riyadh: 46, neom: 33 },
  { date: "2026-03-18", riyadh: 54, neom: 40 },
  { date: "2026-03-25", riyadh: 49, neom: 36 },
]

const chartConfig = {
  captures: {
    label: "Images",
  },
  riyadh: {
    label: "Riyadh North Corridor",
    color: "var(--primary)",
  },
  neom: {
    label: "NEOM Logistics Zone",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2026-03-25")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Capture Activity</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Images uploaded across active sites
          </span>
          <span className="@[540px]/card:hidden">Images by site</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            multiple={false}
            value={timeRange ? [timeRange] : []}
            onValueChange={(value) => {
              setTimeRange(value[0] ?? "90d")
            }}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={timeRange}
            onValueChange={(value) => {
              if (value !== null) {
                setTimeRange(value)
              }
            }}
          >
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="neom"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-neom)"
              stackId="a"
            />
            <Area
              dataKey="riyadh"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-riyadh)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
