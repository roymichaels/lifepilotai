import { useState, useEffect, useCallback } from 'react';
import { Project } from '@/types/project';

export function useProjectStorage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load projects from localStorage on mount
  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem('lifepilot_projects');
      const storedActiveId = localStorage.getItem('lifepilot_active_project');
      
      if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects);
        setProjects(parsedProjects);
      }
      
      if (storedActiveId) {
        setActiveProjectId(storedActiveId);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('lifepilot_projects', JSON.stringify(projects));
    }
  }, [projects, isLoading]);

  // Save active project ID
  useEffect(() => {
    if (activeProjectId) {
      localStorage.setItem('lifepilot_active_project', activeProjectId);
    }
  }, [activeProjectId]);

  const createProject = useCallback((projectData: Partial<Project>) => {
    console.log("useProjectStorage - createProject called with:", projectData);
    
    try {
      const newProject: Project = {
        ...projectData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      console.log("useProjectStorage - Created new project:", newProject);
      
      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      setActiveProjectId(newProject.id);
      
      console.log("useProjectStorage - Updated projects list, new active project:", newProject.name);
      
      // Save to localStorage
      localStorage.setItem('lifepilot_projects', JSON.stringify(updatedProjects));
      localStorage.setItem('lifepilot_active_project', newProject.id);
      
      console.log("useProjectStorage - Saved to localStorage");
      
      return newProject;
    } catch (error) {
      console.error("useProjectStorage - Error creating project:", error);
      throw error;
    }
  }, [projects]);

  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, ...updates, updatedAt: new Date() }
        : project
    ));
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
    if (activeProjectId === projectId) {
      const remainingProjects = projects.filter(p => p.id !== projectId);
      setActiveProjectId(remainingProjects.length > 0 ? remainingProjects[0].id : null);
    }
  }, [activeProjectId, projects]);

  const getActiveProject = useCallback(() => {
    return projects.find(project => project.id === activeProjectId) || null;
  }, [projects, activeProjectId]);

  const switchProject = useCallback((projectId: string) => {
    setActiveProjectId(projectId);
  }, []);

  return {
    projects,
    activeProjectId,
    activeProject: getActiveProject(),
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    switchProject,
  };
}