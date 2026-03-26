"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import type { Project, Capture, CaptureImage } from "@/types"
import {
  MOCK_PROJECTS,
  MOCK_CAPTURES,
  MOCK_IMAGES,
} from "@/lib/mock-data"

interface StoreState {
  projects: Project[]
  captures: Capture[]
  images: CaptureImage[]
  addProject: (project: Project) => void
  updateProject: (project: Project) => void
  addCapture: (capture: Capture) => void
  addImages: (images: CaptureImage[]) => void
  getCapturesForProject: (projectId: string) => Capture[]
  getImagesForCapture: (captureId: string) => CaptureImage[]
  getProject: (id: string) => Project | undefined
}

const StoreContext = createContext<StoreState | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [captures, setCaptures] = useState<Capture[]>([])
  const [images, setImages] = useState<CaptureImage[]>([])

  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem("sitelens_projects")
      const savedCaptures = localStorage.getItem("sitelens_captures")
      const savedImages = localStorage.getItem("sitelens_images")
      setProjects(savedProjects ? JSON.parse(savedProjects) : MOCK_PROJECTS)
      setCaptures(savedCaptures ? JSON.parse(savedCaptures) : MOCK_CAPTURES)
      setImages(savedImages ? JSON.parse(savedImages) : MOCK_IMAGES)
    } catch {
      setProjects(MOCK_PROJECTS)
      setCaptures(MOCK_CAPTURES)
      setImages(MOCK_IMAGES)
    }
  }, [])

  useEffect(() => {
    if (projects.length > 0) localStorage.setItem("sitelens_projects", JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    if (captures.length > 0) localStorage.setItem("sitelens_captures", JSON.stringify(captures))
  }, [captures])

  useEffect(() => {
    if (images.length > 0) localStorage.setItem("sitelens_images", JSON.stringify(images))
  }, [images])

  const addProject = (project: Project) =>
    setProjects((prev) => [project, ...prev])

  const updateProject = (project: Project) =>
    setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)))

  const addCapture = (capture: Capture) =>
    setCaptures((prev) => [capture, ...prev])

  const addImages = (newImages: CaptureImage[]) =>
    setImages((prev) => [...prev, ...newImages])

  const getCapturesForProject = (projectId: string) =>
    captures
      .filter((c) => c.project_id === projectId)
      .sort((a, b) => b.capture_date.localeCompare(a.capture_date))

  const getImagesForCapture = (captureId: string) =>
    images.filter((i) => i.capture_id === captureId)

  const getProject = (id: string) => projects.find((p) => p.id === id)

  return (
    <StoreContext.Provider
      value={{
        projects,
        captures,
        images,
        addProject,
        updateProject,
        addCapture,
        addImages,
        getCapturesForProject,
        getImagesForCapture,
        getProject,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
