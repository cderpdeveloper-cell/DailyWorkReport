import { api } from "./axios";

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
}

export const login = (data: LoginDto) => api.post<AuthResponse>("/auth/login", data);
export const register = (data: RegisterDto) => api.post<{ message: string }>("/auth/register", data);
