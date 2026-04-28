import api from './axios';
import type { User } from '../types';

type RegisterPayload = {
  full_name: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterResponse = {
  message: string;
  userId: string;
};

type AuthResponse = {
  user: User;
  dev_token?: string;
};

export const authService = {
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const { data } = await api.post('/api/auth/register', payload);
    return data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post('/api/auth/login', payload);
    return data;
  },

  logout: async (): Promise<{ message: string }> => {
    const { data } = await api.post('/api/auth/logout');
    return data;
  },
};
