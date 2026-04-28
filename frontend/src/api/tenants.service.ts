import api from './axios';
import type { Tenant } from '../types';

type CreateTenantPayload = {
  unit_id: string;
  tenant_name: string;
  person_count: number;
};

type UpdateTenantPayload = {
  tenant_name?: string;
  person_count?: number;
};

export const tenantsService = {
  getAll: async (): Promise<Tenant[]> => {
    const { data } = await api.get('/api/tenants');
    return data;
  },

  getOne: async (id: string): Promise<Tenant> => {
    const { data } = await api.get(`/api/tenants/${id}`);
    return data;
  },

  create: async (payload: CreateTenantPayload): Promise<Tenant> => {
    const { data } = await api.post('/api/tenants', payload);
    return data;
  },

  update: async (id: string, payload: UpdateTenantPayload): Promise<Tenant> => {
    const { data } = await api.put(`/api/tenants/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/api/tenants/${id}`);
  },
};
