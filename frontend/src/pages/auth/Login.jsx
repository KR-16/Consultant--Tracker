import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(''); 
  
  const { login, loading } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    try {
      const user = await login(email, password);
      const role = user.role.toLowerCase(); 
      if (role === 'candidate') {
        navigate('/candidate/dashboard'); 
      } else if (role === 'hiring_manager') {
        navigate('/hiring/dashboard');
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/'); 
      }

    } catch (err) {
      console.error("Login Flow Error:", err);
      let msg = 'Invalid email or password';
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (typeof detail === 'string') msg = detail;
        else if (Array.isArray(detail)) msg = detail.map(d => d.msg).join(', ');
        else if (typeof detail === 'object') msg = JSON.stringify(detail);
      }
      setLocalError(msg);
    }
  };
  const fillDemo = (e, u, p) => {
    e.preventDefault();
    setEmail(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen w-full flex font-sans bg-white">
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-between p-16 text-white relative overflow-hidden">
        <div className="z-10 flex items-center gap-3">
          <div className="bg-slate-800 p-2 rounded-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold">Talentra</span>
        </div>
        <div className="z-10 max-w-lg">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Streamline Your <br/> Recruitment Workflow
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Manage candidates, track submissions, and analyze performance all in one place.
          </p>
        </div>
        <div className="z-10 text-sm text-slate-500">
          © 2025 Talentra. All rights reserved.
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 relative">
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 right-6 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 h-10 px-4 py-2 text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>

        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-slate-500">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {localError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100 break-words">
                {localError}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                required
                className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-11 px-8 w-full"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign in"}
            </button>
          </form>

          <div className="text-center text-sm">
            <span className="text-slate-500">Don't have an account? </span>
            <Link to="/register" className="font-medium text-slate-900 hover:underline">
              Sign up
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Demo Credentials (Click to fill)
            </p>
            <div className="space-y-2 text-xs text-slate-500">
              <p className="cursor-pointer hover:text-blue-600 transition-colors" onClick={(e) => fillDemo(e, 'admin@example.com', 'admin123')}>
                Admin: <span className="font-mono text-slate-700">admin@example.com / admin123</span>
              </p>
              <p className="cursor-pointer hover:text-blue-600 transition-colors" onClick={(e) => fillDemo(e, 'manager@example.com', 'manager123')}>
                Hiring Manager: <span className="font-mono text-slate-700">manager@example.com / manager123</span>
              </p>
              <p className="cursor-pointer hover:text-blue-600 transition-colors" onClick={(e) => fillDemo(e, 'candidate@example.com', 'candidate123')}>
                Candidate: <span className="font-mono text-slate-700">candidate@example.com / candidate123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;