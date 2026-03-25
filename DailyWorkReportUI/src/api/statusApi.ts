import { api } from "./axios";
import type { Status } from "../types";

export const getStatuses = () => api.get<Status[]>("/status");
export const createStatus = (data: Partial<Status>) => api.post<Status>("/status", data);
export const updateStatus = (id: number, data: Partial<Status>) => api.put(`/status/${id}`, data);
export const deleteStatus = (id: number) => api.delete(`/status/${id}`);
