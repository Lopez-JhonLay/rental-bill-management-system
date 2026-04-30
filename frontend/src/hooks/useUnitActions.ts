import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { unitsService } from '../api/units.service';

// GET all units
export function useUnits() {
  return useQuery({
    queryKey: ['units'],
    queryFn: () => unitsService.getAll(),
  });
}

// GET one unit
export function useUnit(id: string) {
  return useQuery({
    queryKey: ['units', id],
    queryFn: () => unitsService.getOne(id),
    enabled: !!id, // only fetch if id exists
  });
}

// CREATE unit
export function useCreateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unitsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });
}

// UPDATE unit
export function useUpdateUnit(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { unit_name?: string; monthly_rent?: number }) => unitsService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['units', id] });
    },
  });
}

// DELETE unit
export function useDeleteUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unitsService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });
}
