import React, { useState } from 'react';
import { register } from '../../api/auth'; 
import { useNavigate, Link } from 'react-router-dom';
import { Users, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('CANDIDATE');

  const [formData, setFormData] = useState({
    first_name: '', 
    last_name: '', 
    email: '', 
    password: '', 
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        role: role 
      };

      await register(payload);
      navigate('/login');
      
    } catch (err) {
      console.error("Registration Error:", err);
      
      // Safe Error Handling
      let msg = "Registration failed. Please try again.";
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (typeof detail === 'string') msg = detail;
        else if (Array.isArray(detail)) msg = detail.map(d => d.msg).join(', ');
        else if (typeof detail === 'object') msg = JSON.stringify(detail);
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans bg-white">
      
      {/* --- Left Side (Dark Branding) --- */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-between p-16 text-white relative overflow-hidden">
        <div className="z-10 flex items-center gap-3">
          <div className="bg-slate-800 p-2 rounded-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold">Talentra</span>
        </div>

        <div className="z-10 max-w-lg">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Join Thousands of <br/> Recruitment Teams
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Start managing your consultants and submissions more efficiently today.
          </p>
        </div>

        <div className="z-10 text-sm text-slate-500">
          © 2025 Talentra. All rights reserved.
        </div>
      </div>

      {/* --- Right Side (Form) --- */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 relative overflow-y-auto">
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 right-6 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 h-10 px-4 py-2 text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>

        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Create account</h2>
            <p className="mt-2 text-slate-500">Enter your details to get started</p>
          </div>

          {/* --- Role Toggle Buttons (The UI you wanted) --- */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setRole('HIRING_MANAGER')}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition-all duration-200 ${
                role === 'HIRING_MANAGER' 
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
             Hiring Manager
            </button>
            <button
              type="button"
              onClick={() => setRole('CANDIDATE')}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition-all duration-200 ${
                role === 'CANDIDATE' 
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Candidate
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100 break-words">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">First Name</label>
                <input
                  name="first_name"
                  placeholder="John"
                  required
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Last Name</label>
                <input
                  name="last_name"
                  placeholder="Doe"
                  required
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Email</label>
              <input
                name="email"
                type="email"
                placeholder="name@company.com"
                required
                onChange={handleChange}
                className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  required
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                required
                onChange={handleChange}
                className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-11 px-8 w-full mt-2"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create account"}
            </button>
          </form>

          <div className="text-center text-sm">
            <span className="text-slate-500">Already have an account? </span>
            <Link to="/login" className="font-medium text-slate-900 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;