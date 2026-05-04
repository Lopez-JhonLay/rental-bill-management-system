import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useLogin } from '../../hooks/useAuthActions';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(form);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center relative overflow-hidden">
      {/* Dark Grid Lines Background */}
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(to right, #262626 1px, transparent 1px),
            linear-gradient(to bottom, #262626 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="w-full max-w-md relative z-10"
      >
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Header */}
            <h1 className="text-2xl font-bold text-center">Rental Manager</h1>
            <p className="text-center text-base-content/60 mb-4">Sign in to your account</p>

            {/* Error Alert */}
            {login.isError && (
              <div className="alert alert-error">
                <span>Invalid email or password</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="form-control">
                <div className="label pb-1">
                  <span className="label-text">Email</span>
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="juan@email.com"
                  className="input input-bordered w-full"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="form-control">
                <div className="label pb-1">
                  <span className="label-text">Password</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full pr-10"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </label>

              <button type="submit" className="btn btn-primary w-full mt-2" disabled={login.isPending}>
                {login.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm mt-2">
              Don't have an account?{' '}
              <Link to="/register" className="link link-primary">
                Register
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
