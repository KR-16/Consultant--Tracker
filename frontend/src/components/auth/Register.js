import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Users, Loader2, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CONSULTANT'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(formData);

    if (result.success) {
      navigate('/login');
    } else {
      const errData = result.error;
      let msg = "Registration failed. Please try again.";

      if (errData) {
        if (typeof errData === 'string') {
          msg = errData;
        }
        else if (Array.isArray(errData) && errData.length > 0) {
          msg = errData[0].msg || msg;
        }
        else if (errData.detail) {
          if (Array.isArray(errData.detail)) {
            msg = errData.detail[0].msg || msg;
          } else {
            msg = errData.detail;
          }
        }
      }

      setError(msg);
    }

    setLoading(false);
  };

  const roles = [
    { value: 'ADMIN', label: 'Admin', description: 'Full system access' },
    { value: 'RECRUITER', label: 'Recruiter', description: 'Manage consultants & submissions' },
    { value: 'CONSULTANT', label: 'Consultant', description: 'View jobs & applications' }
  ];

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
            Join Our <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Growing Platform
            </span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Create your account and start managing your recruitment workflow efficiently.
          </p>

          {/* Benefits */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="text-slate-300">Easy consultant management</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="text-slate-300">Track submissions in real-time</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="text-slate-300">Comprehensive analytics</span>
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
            <h2 className="text-3xl font-bold text-slate-900">Create an account</h2>
            <p className="text-slate-500">Enter your details to get started</p>
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
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                className="h-11"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                required
                className="h-11"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  required
                  className="h-11 pr-10"
                  value={formData.password}
                  onChange={handleChange}
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
              <p className="text-xs text-slate-500">Minimum 6 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="grid grid-cols-1 gap-3">
                {roles.map((role) => (
                  <label
                    key={role.value}
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.role === role.value
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={handleChange}
                      className="mt-1 mr-3"
                      disabled={loading}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{role.label}</div>
                      <div className="text-sm text-slate-500">{role.description}</div>
                    </div>
                  </label>
                ))}
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
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
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
