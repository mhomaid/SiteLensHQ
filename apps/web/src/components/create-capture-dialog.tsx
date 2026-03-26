"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import type { Capture, CaptureImage } from "@/types"
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
import { Textarea } from "@/components/ui/textarea"
import { PlusIcon, UploadIcon } from "lucide-react"

interface CreateCaptureDialogProps {
  projectId: string
  onCreated?: (captureId: string) => void
}

export function CreateCaptureDialog({ projectId, onCreated }: CreateCaptureDialogProps) {
  const { addCapture, addImages } = useStore()
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")
  const [files, setFiles] = useState<FileList | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const captureId = `cap-${Date.now()}`
    const capture: Capture = {
      id: captureId,
      project_id: projectId,
      capture_date: date,
      notes,
      created_at: new Date().toISOString(),
    }
    addCapture(capture)

    if (files && files.length > 0) {
      const newImages: CaptureImage[] = Array.from(files).map((file, i) => ({
        id: `img-${captureId}-${i + 1}`,
        capture_id: captureId,
        file_name: file.name,
        file_url: URL.createObjectURL(file),
        content_type: file.type,
        file_size: file.size,
        uploaded_at: new Date().toISOString(),
      }))
      addImages(newImages)
    }

    onCreated?.(captureId)
    setOpen(false)
    setDate(new Date().toISOString().split("T")[0])
    setNotes("")
    setFiles(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <PlusIcon className="size-4" />
        Add Capture
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Capture</DialogTitle>
            <DialogDescription>
              Log a new drone capture for this site.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="capture-date">Capture Date</Label>
              <Input
                id="capture-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="capture-notes">Site Notes</Label>
              <Textarea
                id="capture-notes"
                placeholder="Describe site conditions, progress observations..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="capture-images">Images</Label>
              <label
                htmlFor="capture-images"
                className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed p-6 text-center hover:bg-muted/50 transition-colors"
              >
                <UploadIcon className="size-6 text-muted-foreground" />
                <div className="text-sm">
                  {files && files.length > 0 ? (
                    <span className="text-foreground font-medium">
                      {files.length} file{files.length > 1 ? "s" : ""} selected
                    </span>
                  ) : (
                    <>
                      <span className="font-medium">Click to upload</span>
                      <span className="text-muted-foreground"> or drag and drop</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">JPG, PNG up to 50 MB each</p>
                <Input
                  id="capture-images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) => setFiles(e.target.files)}
                />
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Capture</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
