"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import type { Project, ProjectStatus } from "@/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PlusIcon } from "lucide-react"

const LOCATION_PRESETS: Record<string, { center: [number, number] }> = {
  Riyadh: { center: [46.7219, 24.8607] },
  NEOM: { center: [35.1837, 28.0339] },
  Jeddah: { center: [39.1568, 21.4979] },
  Dammam: { center: [50.1773, 26.4312] },
  "Al Khobar": { center: [50.2083, 26.2172] },
  Mecca: { center: [39.8262, 21.3891] },
  Medina: { center: [39.6142, 24.4686] },
}

export function CreateProjectDialog() {
  const { addProject } = useStore()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [status, setStatus] = useState<ProjectStatus>("active")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const preset = LOCATION_PRESETS[location]
    const project: Project = {
      id: `proj-${Date.now()}`,
      name,
      description,
      location_name: location,
      status,
      center: preset?.center ?? [46.7219, 24.8607],
      boundary_geojson: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    addProject(project)
    setOpen(false)
    setName("")
    setDescription("")
    setLocation("")
    setStatus("active")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <PlusIcon className="size-4" />
        New Project
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Add a new construction site to SiteLensHQ.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="e.g. Riyadh North Corridor Package B"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief scope description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Select value={location} onValueChange={(v) => setLocation(v ?? "")} required>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
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
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(v) => v && setStatus(v as ProjectStatus)}
              >
                <SelectTrigger id="status">
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name || !location}>
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
