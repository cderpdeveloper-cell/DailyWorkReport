import { api } from "./axios";
import type { Report, CreateReportDto } from "../types";

export const getReports = () => api.get<Report[]>("/reports");
export const getReportById = (id: number) => api.get<Report>(`/reports/${id}`);
export const createReport = (data: CreateReportDto) => api.post<Report>("/reports", data);
export const updateReport = (id: number, data: CreateReportDto) => api.put(`/reports/${id}`, data);
export const deleteReport = (id: number) => api.delete(`/reports/${id}`);
export const sendReportEmail = (id: number) => api.post(`/reports/${id}/send-email`);
