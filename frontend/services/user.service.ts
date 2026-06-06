import api from "./api";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Customer";
  spent: number;
  status: "Active" | "Blocked";
  avatar?: string;
}

export const userService = {
  async getAll(): Promise<AdminUser[]> {
    const res = await api.get<AdminUser[]>("/users/");
    return res.data;
  },

  async update(id: string, data: Partial<Omit<AdminUser, "id">>): Promise<AdminUser> {
    const res = await api.put<AdminUser>(`/users/${id}`, data);
    return res.data;
  },

  async remove(id: string): Promise<{ msg: string }> {
    const res = await api.delete<{ msg: string }>(`/users/${id}`);
    return res.data;
  },
};
