import { api } from "@/lib/api";
import type { AuthResponse, User } from "./types";

export const authApi = {
  register: async (input: {
    name: string;
    email: string;
    password: string;
  }) => {
    const result = await api.post<AuthResponse>("/auth/register", input);
    return result.data;
  },
  login: async (input: { email: string; password: string }) => {
    const result = await api.post<AuthResponse>("/auth/login", input);
    return result.data;
  },
  me: async () => (await api.get<{ user: User }>("/auth/me")).data.user,
};
