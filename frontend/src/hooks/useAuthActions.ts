import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authService } from '../api/auth.service';
import { useAuth } from '../context/AuthContext';

export function useLogin() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setUser(data.user);
      navigate('/dashboard');
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
