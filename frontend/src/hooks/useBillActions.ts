import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billsService } from '../api/bills.service';

export function useBills(month?: string) {
  return useQuery({
    queryKey: ['bills', month],
    queryFn: () => billsService.getAll(month),
  });
}

export function useBill(id: string) {
  return useQuery({
    queryKey: ['bills', id],
    queryFn: () => billsService.getOne(id),
    enabled: !!id,
  });
}

export function useCreateBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: billsService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      queryClient.invalidateQueries({ queryKey: ['units', data.unit_id] });
    },
  });
}

export function useUpdateBill(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { current_kwh?: number; previous_kwh?: number }) => billsService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills', id] });
    },
  });
}

export function useRecomputeBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: billsService.recompute,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bills', data.id] });
    },
  });
}

export function useConfirmBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, force }: { id: string; force?: boolean }) => billsService.confirm(id, force),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      queryClient.invalidateQueries({ queryKey: ['units', data.unit_id] });
    },
  });
}
