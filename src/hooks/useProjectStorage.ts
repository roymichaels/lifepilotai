import { useState, useEffect, useCallback } from 'react'
import { Project } from '@/types/project'
import { electric } from '@/lib/electric'
import {
  getProjects as apiGetProjects,
  createProject as apiCreateProject,
  updateProject as apiUpdateProject,
  deleteProject as apiDeleteProject
} from '@/api/projects'

/**
 * Stores projects in the local database. On first load any
 * projects found in localStorage will be migrated into the database.
 */
export function useProjectStorage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // initial load + migration + remote fetch
  useEffect(() => {
    const init = async () => {
      try {
        const remote = await apiGetProjects()
        if (remote && remote.length > 0) {
          await electric.projects.clear()
          await electric.projects.bulkPut(remote)
        }
      } catch (err) {
        console.error('Failed to fetch projects from API', err)
      }

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

      const activeSetting = await electric.settings.get('activeProjectId')
      let activeId: string | null = null
      if (!activeSetting && localStorage.getItem('lifepilot_active_project')) {
        const id = localStorage.getItem('lifepilot_active_project') as string
        await electric.settings.put({ key: 'activeProjectId', value: id })
        localStorage.removeItem('lifepilot_active_project')
        activeId = id
      } else {
        activeId = activeSetting?.value ?? null
      }

      if (!activeId && all.length > 0) {
        activeId = all[0].id
        await electric.settings.put({ key: 'activeProjectId', value: activeId })
      }

      setActiveProjectId(activeId)
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
    const newProject = await apiCreateProject(projectData)
    await electric.projects.add(newProject)
    await electric.settings.put({ key: 'activeProjectId', value: newProject.id })
    setActiveProjectId(newProject.id)
    reload()
    return newProject
  }, [reload])

  const updateProject = useCallback(async (projectId: string, updates: Partial<Project>) => {
    const updated = await apiUpdateProject(projectId, updates)
    await electric.projects.put(updated)
    reload()
  }, [reload])

  const deleteProject = useCallback(async (projectId: string) => {
    await apiDeleteProject(projectId)
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
