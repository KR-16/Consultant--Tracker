import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Users, FileText, BarChart, Shield, CheckCircle, ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      {/* --- Navbar --- */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-slate-900 p-1.5 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">RecruitOps</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Sign In
              </button>
              <Button onClick={() => navigate('/register')} className="bg-slate-900 text-white hover:bg-slate-800">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="pt-32 pb-20 px-4 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
          Manage Your Recruitment <br/>
          Workflow Efficiently
        </h1>
        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          A comprehensive recruitment workflow system to manage candidates, job submissions, 
          talent managers, and analytics all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="h-12 px-8 text-base bg-slate-900 hover:bg-slate-800" onClick={() => navigate('/register')}>
            Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="h-12 px-8 text-base">
            View Demo
          </Button>
        </div>
      </section>

      {/* --- Everything You Need (Grid) --- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Everything You Need</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Users, 
                title: "Candidate Management", 
                desc: "Track and manage your candidates with detailed profiles, skills, and availability status." 
              },
              { 
                icon: FileText, 
                title: "Job Submissions", 
                desc: "Manage job submissions with a visual pipeline from application to selection." 
              },
              { 
                icon: BarChart, 
                title: "Analytics & Reports", 
                desc: "Get insights with comprehensive reports on submissions, productivity, and performance." 
              },
              { 
                icon: Shield, 
                title: "Role-Based Access", 
                desc: "Secure access control with Admin, Talent Manager, and Candidate roles." 
              }
            ].map((feature, idx) => (
              <div key={idx} className="group cursor-default">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors">
                  <feature.icon className="h-6 w-6 text-slate-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Why Choose Section --- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">
                Why Choose RecruitOps?
              </h2>
              <div className="space-y-4">
                {[
                  "Streamlined recruitment workflow",
                  "Real-time status tracking",
                  "CSV import/export support",
                  "Comprehensive analytics dashboard",
                  "Mobile-responsive design",
                  "Dark/light mode support"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-slate-900" />
                    <span className="text-slate-600 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual (Skeleton Mockup) */}
            <div className="bg-slate-50 p-8 rounded-2xl space-y-4 shadow-inner">
              <div className="h-4 bg-slate-200 rounded w-1/3 mb-8"></div>
              <div className="h-8 bg-slate-200 rounded w-full"></div>
              <div className="h-8 bg-slate-200 rounded w-5/6"></div>
              
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="h-24 bg-slate-200 rounded-lg"></div>
                <div className="h-24 bg-slate-200 rounded-lg"></div>
                <div className="h-24 bg-slate-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Dark CTA Footer --- */}
      <section className="py-24 bg-slate-900 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-slate-400 mb-10 text-lg">
            Join thousands of recruitment teams using RecruitOps to streamline their workflow.
          </p>
          <Button 
            onClick={() => navigate('/register')}
            className="bg-white text-slate-900 hover:bg-slate-100 h-12 px-8 text-base font-semibold border-none"
          >
            Create Free Account
          </Button>
        </div>
      </section>

      <footer className="py-8 bg-white text-center text-sm text-slate-500 border-t border-slate-100">
        © 2025 RecruitOps. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;