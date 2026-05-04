import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authService } from '../api/auth.service';
import { useAuth } from '../context/AuthContext';

export function useLogin() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      // Set user from login response
      setUser(data.user);
      // Navigate to dashboard
      navigate('/dashboard');
      // Optionally refetch user data to ensure it's fresh
      try {
        const freshUser = await authService.me();
        setUser(freshUser);
      } catch (error) {
        // If refetch fails, we still have the user from login
        console.error('Failed to refetch user data:', error);
      }
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      navigate('/login');
    },
  });
}

export function useLogout() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      setUser(null);
      navigate('/login');
    },
  });
}
