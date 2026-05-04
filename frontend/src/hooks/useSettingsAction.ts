import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ratesService } from '../api/rates.service';

export function useRates() {
  return useQuery({
    queryKey: ['rates'],
    queryFn: () => ratesService.getAll(),
  });
}

export function useCreateRate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ratesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rates'] });
    },
  });
}
