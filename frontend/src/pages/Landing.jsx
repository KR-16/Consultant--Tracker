import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { 
  Users, BarChart, Shield, CheckCircle, 
  ArrowRight, Zap 
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === 'CANDIDATE') {
        navigate('/candidate/jobs'); 
      } else {
        navigate('/dashboard'); 
      }
    }
  }, [user, navigate]);

 
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 flex flex-col font-sans text-slate-900 dark:text-white">
      
      {/* ==================== NAVBAR ==================== */}
      <nav className="fixed w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-50 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="bg-slate-900 dark:bg-white p-1.5 rounded-lg">
                <Users className="h-5 w-5 text-white dark:text-slate-900" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">RecruitOps</span>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </button>
              <Button 
                onClick={() => navigate('/register')} 
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* ==================== HERO SECTION ==================== */}
      <section className="pt-32 pb-20 px-4 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
          The Operating System for <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Modern Hiring</span>
        </h1>
        
        <p className="text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          RecruitOps replaces your messy spreadsheets with a powerful, automated applicant tracking system. Source, screen, and hire 3x faster.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="h-14 px-8 text-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 shadow-xl shadow-blue-900/10" 
              onClick={() => navigate('/register')}
            >
                Start Hiring Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="h-14 px-8 text-lg border-slate-200 dark:border-slate-800 dark:text-white dark:hover:bg-slate-800"
              onClick={scrollToPricing}
            >
                View Plans & Pricing
            </Button>
        </div>

      </section>

      {/* ==================== FEATURES GRID ==================== */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Everything You Need to Scale</h2>
            <p className="text-slate-500 mt-4">Powerful features designed for recruiting agencies and in-house HR teams.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Users, 
                title: "Candidate Pipeline", 
                desc: "Kanban-style tracking from 'Applied' to 'Hired'. Never lose a resume again." 
              },
              { 
                icon: Zap, 
                title: "AI Resume Parsing", 
                desc: "Automatically extract skills and experience from PDF resumes in seconds." 
              },
              { 
                icon: BarChart, 
                title: "Hiring Analytics", 
                desc: "Track time-to-hire, source effectiveness, and team productivity metrics." 
              },
              { 
                icon: Shield, 
                title: "Role-Based Security", 
                desc: "Granular permissions for Admins, Recruiters, and Interviewers." 
              }
            ].map((feature, idx) => (
              <div key={idx} className="group p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PRICING SECTION ==================== */}
      <section id="pricing" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              Choose the plan that fits your recruitment volume. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* --- Starter Plan --- */}
            <div className="relative p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-300 transition-colors">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Starter</h3>
              <div className="mt-4 flex items-baseline text-slate-900 dark:text-white">
                <span className="text-4xl font-bold tracking-tight">Free</span>
                <span className="ml-1 text-xl font-semibold text-slate-500">/forever</span>
              </div>
              <p className="mt-6 text-slate-500 text-sm">Perfect for freelancers and small startups.</p>
              
              <ul className="mt-6 space-y-4">
                {[
                  "5 Active Job Postings",
                  "50 Candidate Profiles",
                  "Basic Kanban Board",
                  "Email Support"
                ].map((feature) => (
                  <li key={feature} className="flex text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button onClick={() => navigate('/register')} variant="outline" className="w-full mt-8 h-12 border-slate-200 dark:border-slate-700">
                Get Started Free
              </Button>
            </div>

            {/* --- Pro Plan (Highlighted) --- */}
            <div className="relative p-8 bg-slate-900 dark:bg-slate-800 rounded-2xl border border-slate-800 shadow-2xl transform md:-translate-y-4">
              <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold text-white">Professional</h3>
              <div className="mt-4 flex items-baseline text-white">
                <span className="text-4xl font-bold tracking-tight">$49</span>
                <span className="ml-1 text-xl font-semibold text-slate-400">/mo</span>
              </div>
              <p className="mt-6 text-slate-400 text-sm">For growing agencies needing automation.</p>
              
              <ul className="mt-6 space-y-4">
                {[
                  "Unlimited Job Postings",
                  "1,000 Candidate Profiles",
                  "Advanced Analytics Dashboard",
                  "Bulk Resume Parsing (500/mo)",
                  "Priority Chat Support"
                ].map((feature) => (
                  <li key={feature} className="flex text-sm text-white">
                    <CheckCircle className="h-5 w-5 text-blue-400 shrink-0 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button onClick={() => navigate('/register')} className="w-full mt-8 h-12 bg-blue-600 hover:bg-blue-700 text-white border-none">
                Start 14-Day Free Trial
              </Button>
            </div>

            {/* --- Enterprise Plan --- */}
            <div className="relative p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-300 transition-colors">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Enterprise</h3>
              <div className="mt-4 flex items-baseline text-slate-900 dark:text-white">
                <span className="text-4xl font-bold tracking-tight">$199</span>
                <span className="ml-1 text-xl font-semibold text-slate-500">/mo</span>
              </div>
              <p className="mt-6 text-slate-500 text-sm">For large organizations with strict needs.</p>
              
              <ul className="mt-6 space-y-4">
                {[
                  "Unlimited Everything",
                  "Custom API Access",
                  "SSO (Single Sign-On)",
                  "Dedicated Account Manager",
                  "Custom Data Export"
                ].map((feature) => (
                  <li key={feature} className="flex text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button onClick={() => navigate('/register')} variant="outline" className="w-full mt-8 h-12 border-slate-200 dark:border-slate-700">
                Contact Sales
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== CTA FOOTER ==================== */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Ready to streamline your hiring?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg">
            Join 10,000+ recruiters who are saving 20 hours a week with RecruitOps.
          </p>
          <Button 
            onClick={() => navigate('/register')}
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 h-12 px-8 text-base font-semibold"
          >
            Create Your Free Account
          </Button>
        </div>
      </section>

      <footer className="py-8 bg-white dark:bg-slate-950 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
        © 2025 RecruitOps. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;