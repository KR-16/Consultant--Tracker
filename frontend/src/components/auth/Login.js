import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Users, Loader2, Eye, EyeOff, ArrowLeft, Briefcase, TrendingUp, Shield } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      const errData = result.error;
      let msg = "Invalid email or password";

      if (errData) {
        if (typeof errData === 'string') {
          msg = errData;
        }
        else if (Array.isArray(errData) && errData.length > 0) {
          const firstError = errData[0]
          if (firstError.loc && firstError.loc.includes('email')) {
            msg = "Invalid email address";
          } else {
            msg = firstError.msg;
          }
        }
        else if (errData.detail) {
          if (Array.isArray(errData.detail)) {
            const firstDetail = errData.detail[0];
            if (firstDetail.loc && firstDetail.loc.includes('email')) {
              msg = "Invalid email address";
            } else {
              msg = firstDetail.msg;
            }
          } else {
            msg = errData.detail;
          }
        }
      }

      setError(msg);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex font-sans">

      {/* --- Left Side (Dark) --- */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-col justify-between p-16 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="z-10 flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-white/20">
            <Users className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold">Consultant Tracker</span>
        </div>

        <div className="z-10 max-w-lg space-y-8">
          <h1 className="text-5xl font-bold leading-tight">
            Streamline Your <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Recruitment Workflow
            </span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Manage consultants, track submissions, and analyze performance all in one powerful platform.
          </p>

          {/* Feature highlights */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-slate-300">Consultant Management</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-slate-300">Real-time Analytics</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-slate-300">Secure & Reliable</span>
            </div>
          </div>
        </div>

        <div className="z-10 text-sm text-slate-400">
          © 2025 Consultant Tracker. All rights reserved.
        </div>
      </div>

      {/* --- Right Side (Form) --- */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 relative">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="absolute top-6 right-6 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="w-full max-w-md space-y-8">

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-slate-500">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 flex items-center gap-2">
                <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                required
                className="h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  className="h-11 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white text-base font-medium transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-slate-500">Don't have an account? </span>
            <Link to="/register" className="font-medium text-slate-900 hover:underline">
              Sign up
            </Link>
          </div>

          {/* Demo Credentials Section */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Demo Credentials
            </p>
            <div className="space-y-2 text-xs text-slate-500">
              <p className="flex items-center justify-between">
                <span className="font-medium">Admin:</span>
                <span className="font-mono text-slate-700">admin@example.com / admin123</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="font-medium">Recruiter:</span>
                <span className="font-mono text-slate-700">recruiter@example.com / recruiter123</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="font-medium">Consultant:</span>
                <span className="font-mono text-slate-700">consultant@example.com / consultant123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
