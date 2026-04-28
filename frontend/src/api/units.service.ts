import api from './axios';
import type { Unit } from '../types';

type CreateUnitPayload = {
  unit_name: string;
  monthly_rent: number;
};

type UpdateUnitPayload = {
  unit_name?: string;
  monthly_rent?: number;
};

export const unitsService = {
  getAll: async (): Promise<Unit[]> => {
    const { data } = await api.get('/api/units');
    return data;
  },

  getOne: async (id: string): Promise<Unit> => {
    const { data } = await api.get(`/api/units/${id}`);
    return data;
  },

  create: async (payload: CreateUnitPayload): Promise<Unit> => {
    const { data } = await api.post('/api/units', payload);
    return data;
  },

  update: async (id: string, payload: UpdateUnitPayload): Promise<Unit> => {
    const { data } = await api.put(`/api/units/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/api/units/${id}`);
  },
};
