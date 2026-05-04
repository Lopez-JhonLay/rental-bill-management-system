import { useState } from 'react';
import { Link } from 'react-router';
import { Loader2 } from 'lucide-react';
import { useLogin } from '../../hooks/useAuthActions';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

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

      <div className="card bg-base-100 w-full max-w-md shadow-xl relative z-10">
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
              <div className="label">
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
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                value={form.password}
                onChange={handleChange}
                required
              />
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
    </div>
  );
}
