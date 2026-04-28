import api from './axios';
import type { RateSetting } from '../types';

type CreateRatePayload = {
  electricity_rate: number;
  water_rate: number;
  effective_from: string;
};

export const ratesService = {
  getAll: async (): Promise<RateSetting[]> => {
    const { data } = await api.get('/api/settings/rates');
    return data;
  },

  create: async (payload: CreateRatePayload): Promise<RateSetting> => {
    const { data } = await api.post('/api/settings/rates', payload);
    return data;
  },
};
