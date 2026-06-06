export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  avatar_initials?: string;
  member_status?: string;
  member_since?: string | null;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_updates: boolean;
  created_at: string;
  updated_at: string;
}