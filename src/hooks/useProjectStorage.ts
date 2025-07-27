import { useState, useEffect, useCallback } from 'react'
import { Project } from '@/types/project'
import { run, all, get } from '@/lib/db'
import {
  getProjects as apiGetProjects,
  createProject as apiCreateProject,
  updateProject as apiUpdateProject,
  deleteProject as apiDeleteProject
} from '@/api/projects'

/**
 * Stores projects in the local ElectricSQL database. On first load any
 * projects found in localStorage will be migrated into the database.
 */
function rowToProject(row: any): Project {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    category: row.category,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
    profile: row.profile ? JSON.parse(row.profile) : { vision: '', metrics: [], objective: '' },
    character: row.character ? JSON.parse(row.character) : { role: '', level: 0, xp: 0, xpToNext: 0, jobPerk: '' },
    milestones: row.milestones ? JSON.parse(row.milestones) : [],
    widgets: row.widgets ? JSON.parse(row.widgets) : [],
    chatHistory: row.chatHistory ? JSON.parse(row.chatHistory) : []
  }
}

async function insertProject(project: Project) {
  await run(
    'INSERT OR REPLACE INTO projects (id,name,icon,category,createdAt,updatedAt,profile,character,milestones,widgets,chatHistory) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
    [
      project.id,
      project.name,
      project.icon,
      project.category,
      project.createdAt.toString(),
      project.updatedAt.toString(),
      JSON.stringify(project.profile),
      JSON.stringify(project.character),
      JSON.stringify(project.milestones),
      JSON.stringify(project.widgets),
      JSON.stringify(project.chatHistory)
    ]
  )
}

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
          await run('DELETE FROM projects')
          for (const p of remote) {
            await insertProject(p)
          }
        }
      } catch (err) {
        console.error('Failed to fetch projects from API', err)
      }

      const allRows = await all<any>('SELECT * FROM projects')
      let all = allRows.map(rowToProject)
      if (all.length === 0) {
        const stored = localStorage.getItem('lifepilot_projects')
        if (stored) {
          try {
            const parsed: Project[] = JSON.parse(stored)
            for (const p of parsed) await insertProject(p)
            all = parsed
            localStorage.removeItem('lifepilot_projects')
          } catch (e) {
            console.error('Project migration failed', e)
          }
        }
      }

      const activeSetting = await get<{ value: string }>(
        'SELECT value FROM settings WHERE key = ?',
        ['activeProjectId']
      )
      let activeId: string | null = null
      if (!activeSetting && localStorage.getItem('lifepilot_active_project')) {
        const id = localStorage.getItem('lifepilot_active_project') as string
        await run('INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)', [
          'activeProjectId',
          id
        ])
        localStorage.removeItem('lifepilot_active_project')
        activeId = id
      } else {
        activeId = activeSetting?.value ?? null
      }

      if (!activeId && all.length > 0) {
        activeId = all[0].id
        await run('INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)', [
          'activeProjectId',
          activeId
        ])
      }

      setActiveProjectId(activeId)
      setProjects(all)
      setIsLoading(false)
    }

    init()
  }, [])

  // helper to reload
  const reload = useCallback(async () => {
    const rows = await all<any>('SELECT * FROM projects')
    setProjects(rows.map(rowToProject))
  }, [])

  const createProject = useCallback(async (projectData: Partial<Project>) => {
    const newProject = await apiCreateProject(projectData)
    await insertProject(newProject)
    await run('INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)', [
      'activeProjectId',
      newProject.id
    ])
    setActiveProjectId(newProject.id)
    reload()
    return newProject
  }, [reload])

  const updateProject = useCallback(async (projectId: string, updates: Partial<Project>) => {
    const updated = await apiUpdateProject(projectId, updates)
    await insertProject(updated)
    reload()
  }, [reload])

  const deleteProject = useCallback(async (projectId: string) => {
    await apiDeleteProject(projectId)
    await run('DELETE FROM projects WHERE id = ?', [projectId])
    const remainingRows = await all<any>('SELECT * FROM projects')
    const remaining = remainingRows.map(rowToProject)
    if (activeProjectId === projectId) {
      const first = remaining[0]?.id ?? null
      setActiveProjectId(first)
      if (first)
        await run('INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)', [
          'activeProjectId',
          first
        ])
    }
    setProjects(remaining)
  }, [activeProjectId])

  const switchProject = useCallback(async (projectId: string) => {
    await run('INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)', [
      'activeProjectId',
      projectId
    ])
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
