"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useStore } from "@/lib/store"
import type { Project, ProjectStatus } from "@/types"
import { ArrowLeftIcon, SaveIcon } from "lucide-react"

const LOCATION_PRESETS: Record<string, { center: [number, number] }> = {
  Riyadh: { center: [46.7219, 24.8607] },
  NEOM: { center: [35.1837, 28.0339] },
  Jeddah: { center: [39.1568, 21.4979] },
  Dammam: { center: [50.1773, 26.4312] },
  "Al Khobar": { center: [50.2083, 26.2172] },
  Mecca: { center: [39.8262, 21.3891] },
  Medina: { center: [39.6142, 24.4686] },
}

export default function NewProjectPage() {
  const { addProject } = useStore()
  const router = useRouter()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [status, setStatus] = useState<ProjectStatus>("active")
  const [saving, setSaving] = useState(false)

  const canSubmit = name.trim() !== "" && location !== ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setSaving(true)

    const preset = LOCATION_PRESETS[location]
    const project: Project = {
      id: `proj-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      location_name: location,
      status,
      center: preset?.center ?? [46.7219, 24.8607],
      boundary_geojson: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    addProject(project)

    // Small delay for perceived save feedback
    await new Promise((r) => setTimeout(r, 300))
    router.push(`/projects/${project.id}`)
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
      <SidebarInset>
        <SiteHeader title="New Project" />

        <div className="flex flex-1 flex-col items-start px-6 py-8 max-w-2xl w-full mx-auto gap-8">

          {/* Back link */}
          <Button variant="ghost" size="sm" render={<Link href="/projects" />}>
            <ArrowLeftIcon className="size-4" />
            All Projects
          </Button>

          <div className="flex flex-col gap-1.5 w-full">
            <h1 className="text-2xl font-bold tracking-tight">Create Project</h1>
            <p className="text-sm text-muted-foreground">
              Set up a new construction site for drone capture and progress monitoring.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">

            {/* Project Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Project Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Riyadh North Corridor Package B"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                className="h-10"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Briefly describe the project scope, location, and key objectives..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                This will appear on the project detail page and in reports.
              </p>
            </div>

            {/* Location + Status row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Location <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={location}
                  onValueChange={(v) => setLocation(v ?? "")}
                >
                  <SelectTrigger id="location" className="h-10">
                    <SelectValue placeholder="Select city / region" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(LOCATION_PRESETS).map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select
                  value={status}
                  onValueChange={(v) => v && setStatus(v as ProjectStatus)}
                >
                  <SelectTrigger id="status" className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Divider + hint */}
            <div className="rounded-lg border border-dashed p-4 bg-muted/20 text-sm text-muted-foreground">
              After creating the project you can define the site boundary on the map and add drone captures.
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={!canSubmit || saving}
                className="min-w-32"
              >
                {saving ? (
                  <>
                    <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    <SaveIcon className="size-4" />
                    Create Project
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                render={<Link href="/projects" />}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
