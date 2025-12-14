import React, { useState } from 'react';
import { loginUser } from '../../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Users, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

  
    try {
      await loginUser(email, password);
      const userRes = await api.get('/auth/me'); 
      const role = userRes.data.role;

      if (role === 'CANDIDATE') {
        navigate('/candidate/jobs');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans">
    
      {/* --- Left Side (Dark) --- */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-between p-16 text-white relative overflow-hidden">
        <div className="z-10 flex items-center gap-3">
          <div className="bg-slate-800 p-2 rounded-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold">RecruitOps</span>
        </div>

        <div className="z-10 max-w-lg">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Streamline Your <br/> Recruitment Workflow
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Manage consultants, track submissions, and analyze performance all in one place.
          </p>
        </div>

        <div className="z-10 text-sm text-slate-500">
          © 2025 RecruitOps. All rights reserved.
        </div>
      </div>

      {/* --- Right Side (Form) --- */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
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
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-slate-500">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-100">
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


            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white text-base font-medium"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign in"}
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
              <p>Admin: <span className="font-mono text-slate-700">admin@recruitops.com / password123</span></p>
              <p>Manager: <span className="font-mono text-slate-700">manager@recruitops.com / password123</span></p>
              <p>Candidate: <span className="font-mono text-slate-700">candidate@recruitops.com / password123</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;