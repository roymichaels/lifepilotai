import api from './api';
import type { Project } from '@/types/project';

export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await api.get('/projects');
    return response.data as Project[];
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

export const createProject = async (project: Partial<Project>): Promise<Project> => {
  try {
    const response = await api.post('/projects', project);
    return response.data as Project;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

export const updateProject = async (
  projectId: string,
  updates: Partial<Project>
): Promise<Project> => {
  try {
    const response = await api.put(`/projects/${projectId}`, updates);
    return response.data as Project;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    await api.delete(`/projects/${projectId}`);
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};
