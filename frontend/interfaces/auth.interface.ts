import { User } from "./user.interface";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: "bearer";
  user: User;
}

export interface MessageResponse {
  msg: string;
}

export interface VerifyOtpRequest {
  email: string;
  code: string;
  purpose: "signup" | "reset_password";
}