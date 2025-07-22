import { useState, useEffect, useCallback } from 'react'
import { Project } from '@/types/project'
import { electric } from '@/lib/electric'

/**
 * Stores projects in the local ElectricSQL database. On first load any
 * projects found in localStorage will be migrated into the database.
 */
export function useProjectStorage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // initial load + migration
  useEffect(() => {
    const init = async () => {
      let all = await electric.projects.toArray()
      if (all.length === 0) {
        const stored = localStorage.getItem('lifepilot_projects')
        if (stored) {
          try {
            const parsed: Project[] = JSON.parse(stored)
            await electric.projects.bulkAdd(parsed)
            all = parsed
            localStorage.removeItem('lifepilot_projects')
          } catch (e) {
            console.error('Project migration failed', e)
          }
        }
      }

      const active = await electric.settings.get('activeProjectId')
      if (!active && localStorage.getItem('lifepilot_active_project')) {
        const id = localStorage.getItem('lifepilot_active_project') as string
        await electric.settings.put({ key: 'activeProjectId', value: id })
        localStorage.removeItem('lifepilot_active_project')
        setActiveProjectId(id)
      } else {
        setActiveProjectId(active?.value ?? null)
      }

      setProjects(all)
      setIsLoading(false)
    }

    init()
  }, [])

  // helper to reload
  const reload = useCallback(async () => {
    const all = await electric.projects.toArray()
    setProjects(all)
  }, [])

  const createProject = useCallback(async (projectData: Partial<Project>) => {
    const newProject: Project = {
      ...projectData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    } as Project
    await electric.projects.add(newProject)
    await electric.settings.put({ key: 'activeProjectId', value: newProject.id })
    setActiveProjectId(newProject.id)
    reload()
    return newProject
  }, [reload])

  const updateProject = useCallback(async (projectId: string, updates: Partial<Project>) => {
    const existing = await electric.projects.get(projectId)
    if (existing) {
      await electric.projects.put({ ...existing, ...updates, updatedAt: new Date() })
      reload()
    }
  }, [reload])

  const deleteProject = useCallback(async (projectId: string) => {
    await electric.projects.delete(projectId)
    const remaining = await electric.projects.toArray()
    if (activeProjectId === projectId) {
      const first = remaining[0]?.id ?? null
      setActiveProjectId(first)
      if (first) await electric.settings.put({ key: 'activeProjectId', value: first })
    }
    setProjects(remaining)
  }, [activeProjectId])

  const switchProject = useCallback(async (projectId: string) => {
    await electric.settings.put({ key: 'activeProjectId', value: projectId })
    setActiveProjectId(projectId)
  }, [])

  const getActiveProject = useCallback(() => {
    return projects.find(p => p.id === activeProjectId) || null
  }, [projects, activeProjectId])

  return {
    projects,
    activeProjectId,
    activeProject: getActiveProject(),
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    switchProject
  }
}
