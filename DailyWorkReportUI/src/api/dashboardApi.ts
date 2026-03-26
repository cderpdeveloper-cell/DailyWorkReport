import { api } from "./axios";

export interface DashboardStats {
  activeReports: number;
  completedProjects: number;
  totalHours: string;
}

export const getDashboardStats = () => api.get<DashboardStats>("/dashboard/stats");
