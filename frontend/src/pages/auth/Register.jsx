import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api'; // Using your new centralized api.js
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Users, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Default to MANAGER since text says "Join Recruitment Teams"
  const [role, setRole] = useState('TALENT_MANAGER'); 

  const [formData, setFormData] = useState({
    name: '',
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

    setLoading(true);

    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role // Send selected role
      });
      // Redirect on success
      navigate('/login');
    } catch (err) {
      console.error("Registration Error:", err);
      
      // --- ROBUST ERROR HANDLING ---
      // 1. Check if backend sent a specific detail message
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        
        // Case A: Detail is an array (Pydantic validation error)
        if (Array.isArray(detail)) {
          // Extract the first error message from the list
          setError(detail[0].msg || "Invalid input data");
        } 
        // Case B: Detail is a simple string (HTTPException)
        else if (typeof detail === 'string') {
          setError(detail);
        }
        // Case C: Detail is an object or unknown type
        else {
          setError("Registration failed. Please check your inputs.");
        }
      } else {
        // 2. Fallback for network errors or server crashes
        setError("Registration failed. Server might be down or unreachable.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans relative">
      {/* --- Left Side (Dark) --- */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-between p-16 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 p-2 rounded-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold">RecruitOps</span>
        </div>

        <div className="max-w-lg">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Join Thousands of <br/> Recruitment Teams
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Start managing your consultants and submissions more efficiently today.
          </p>
        </div>

        <div className="text-sm text-slate-500">
          © 2025 RecruitOps. All rights reserved.
        </div>
      </div>

      {/* --- Right Side (Form) --- */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 overflow-y-auto relative">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="absolute top-6 right-6 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <div className="w-full max-w-md space-y-8">
          
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Create account</h2>
            <p className="mt-2 text-slate-500">Enter your details to get started</p>
          </div>

          {/* Subtle Role Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setRole('TALENT_MANAGER')}
              className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-all ${
                role === 'TALENT_MANAGER' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Recruiter / Manager
            </button>
            <button
              type="button"
              onClick={() => setRole('CANDIDATE')}
              className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-all ${
                role === 'CANDIDATE' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Job Seeker
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Smith"
                required
                className="h-11"
                onChange={handleChange}
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
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  required
                  className="h-11 pr-10"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                required
                className="h-11"
                onChange={handleChange}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white text-base font-medium mt-2"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create account"}
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