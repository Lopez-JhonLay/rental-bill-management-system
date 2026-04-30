import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsService } from '../api/tenants.service';

export function useCreateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tenantsService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['units', data.unit_id] });
    },
  });
}

export function useUpdateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { tenant_name?: string; person_count?: number } }) =>
      tenantsService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['units', data.unit_id] });
    },
  });
}

export function useDeleteTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tenantsService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });
}
