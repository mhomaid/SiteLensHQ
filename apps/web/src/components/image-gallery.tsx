"use client"

import { useState } from "react"
import Image from "next/image"
import type { CaptureImage } from "@/types"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, XIcon, ExpandIcon } from "lucide-react"

interface ImageGalleryProps {
  images: CaptureImage[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  if (images.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">No images for this capture.</p>
      </div>
    )
  }

  const prev = () =>
    setLightboxIdx((i) => (i !== null ? (i - 1 + images.length) % images.length : 0))
  const next = () =>
    setLightboxIdx((i) => (i !== null ? (i + 1) % images.length : 0))

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {images.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => setLightboxIdx(idx)}
            className="group relative aspect-video overflow-hidden rounded-md border bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Image
              src={img.file_url}
              alt={img.file_name}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ExpandIcon className="size-4 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
            </div>
          </button>
        ))}
      </div>

      <Dialog open={lightboxIdx !== null} onOpenChange={() => setLightboxIdx(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
          {lightboxIdx !== null && (
            <div className="relative flex items-center justify-center min-h-[60vh]">
              <Image
                src={images[lightboxIdx].file_url}
                alt={images[lightboxIdx].file_name}
                fill
                className="object-contain"
                sizes="100vw"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-white hover:bg-white/20 z-10"
                onClick={() => setLightboxIdx(null)}
              >
                <XIcon className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 text-white hover:bg-white/20 z-10"
                onClick={prev}
              >
                <ChevronLeftIcon className="size-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 text-white hover:bg-white/20 z-10"
                onClick={next}
              >
                <ChevronRightIcon className="size-5" />
              </Button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/70 text-xs">
                {lightboxIdx + 1} / {images.length} &nbsp;·&nbsp; {images[lightboxIdx].file_name}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
