import { api } from "./axios";
import type { Project } from "../types";

export const getProjects = () => api.get<Project[]>("/projects");
export const createProject = (data: Partial<Project>) => api.post<Project>("/projects", data);
export const updateProject = (id: number, data: Partial<Project>) => api.put(`/projects/${id}`, data);
export const deleteProject = (id: number) => api.delete(`/projects/${id}`);
