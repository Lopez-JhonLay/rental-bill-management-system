import { useState } from 'react';
import { Link } from 'react-router';
import { useRegister } from '../../hooks/useAuthActions';

export default function Register() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
  });

  const register = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate(form);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Extract error message from API response
  const getErrorMessage = () => {
    const error = register.error as any;
    if (!error) return null;
    return error?.response?.data?.message || 'Registration failed';
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card bg-base-100 w-full max-w-md shadow-xl">
        <div className="card-body">
          {/* Header */}
          <h1 className="text-2xl font-bold text-center">Rental Manager</h1>
          <p className="text-center text-base-content/60 mb-4">Create your landlord account</p>

          {/* Error Alert */}
          {register.isError && (
            <div className="alert alert-error">
              <span>{getErrorMessage()}</span>
            </div>
          )}

          {/* Success Alert */}
          {register.isSuccess && (
            <div className="alert alert-success">
              <span>Account created! Please login.</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="form-control">
              <div className="label">
                <span className="label-text">Full Name</span>
              </div>
              <input
                type="text"
                name="full_name"
                placeholder="Juan dela Cruz"
                className="input input-bordered w-full"
                value={form.full_name}
                onChange={handleChange}
                required
              />
            </label>

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
              <div className="label">
                <span className="label-text-alt text-base-content/60">
                  Min 8 characters, 1 uppercase, 1 special character
                </span>
              </div>
            </label>

            <button type="submit" className="btn btn-primary w-full mt-2" disabled={register.isPending}>
              {register.isPending ? <span className="loading loading-spinner" /> : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm mt-2">
            Already have an account?{' '}
            <Link to="/login" className="link link-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
