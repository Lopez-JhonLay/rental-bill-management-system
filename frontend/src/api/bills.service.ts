import api from './axios';
import type { Bill } from '../types';

type CreateBillPayload = {
  unit_id: string;
  billing_month: string;
  current_kwh: number;
};

type UpdateBillPayload = {
  current_kwh?: number;
  previous_kwh?: number;
};

export const billsService = {
  getAll: async (month?: string): Promise<Bill[]> => {
    const { data } = await api.get('/api/bills', {
      params: { month },
    });
    return data;
  },

  getOne: async (id: string): Promise<Bill> => {
    const { data } = await api.get(`/api/bills/${id}`);
    return data;
  },

  create: async (payload: CreateBillPayload): Promise<Bill> => {
    const { data } = await api.post('/api/bills', payload);
    return data;
  },

  update: async (id: string, payload: UpdateBillPayload): Promise<Bill> => {
    const { data } = await api.put(`/api/bills/${id}`, payload);
    return data;
  },

  recompute: async (id: string): Promise<Bill> => {
    const { data } = await api.put(`/api/bills/${id}/recompute`);
    return data;
  },

  confirm: async (id: string, force?: boolean): Promise<Bill> => {
    const { data } = await api.put(`/api/bills/${id}/confirm`, null, {
      params: { force },
    });
    return data;
  },
};
