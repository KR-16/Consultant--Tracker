import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, Briefcase, Clock, CheckCircle, 
  Plus, Eye, BarChart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

// ==========================================
// 1. ADMIN DASHBOARD (System Wide)
// ==========================================
const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">System health and user management.</p>
        </div>
        <Button onClick={() => navigate('/admin/users')}>
            Manage Users
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900 text-white border-none">
          <CardContent className="p-6">
            <p className="text-slate-400 text-sm mb-1">Total Users</p>
            <h3 className="text-3xl font-bold">1,240</h3>
            <div className="flex items-center gap-2 mt-4 text-sm text-slate-300">
              <Users className="w-4 h-4" /> Across all roles
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-6">
             <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">System Load</p>
             <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Normal</h3>
             <div className="flex items-center gap-2 mt-4 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" /> All services operational
             </div>
          </CardContent>
        </Card>
         <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-6">
             <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Total Jobs Posted</p>
             <h3 className="text-3xl font-bold text-slate-900 dark:text-white">85</h3>
             <div className="flex items-center gap-2 mt-4 text-blue-600 text-sm">
                <Briefcase className="w-4 h-4" /> Active on platform
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// ==========================================
// 2. TALENT MANAGER DASHBOARD (Recruitment Focus)
// ==========================================
const TalentManagerDashboard = ({ user }) => {
  const navigate = useNavigate();

  // Mock Jobs Data (This would come from API: getMyJobs())
  const myJobs = [
    { id: 101, title: "Senior React Developer", applicants: 12, posted: "2 days ago", status: "Active" },
    { id: 102, title: "Backend Engineer (Python)", applicants: 5, posted: "5 days ago", status: "Active" },
    { id: 103, title: "UI/UX Designer", applicants: 28, posted: "1 week ago", status: "Closed" },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header with POST JOB Action */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Recruiter Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your jobs and candidates.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/reports')} variant="outline">
            <BarChart className="w-4 h-4 mr-2" /> Reports
          </Button>
          <Button onClick={() => navigate('/jobs/new')} className="bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            <Plus className="w-4 h-4 mr-2" /> Post a Job
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Active Jobs</p>
              <h3 className="text-2xl font-bold mt-1">12</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Briefcase className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
           <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Applicants</p>
              <h3 className="text-2xl font-bold mt-1">148</h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
           <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Interviews</p>
              <h3 className="text-2xl font-bold mt-1">8</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
           <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Hired (M)</p>
              <h3 className="text-2xl font-bold mt-1">3</h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: MY ACTIVE JOBS (The "Check Submissions" feature) --- */}
        <div className="lg:col-span-2 space-y-6">
           <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
            <CardHeader>
              <CardTitle>My Posted Jobs</CardTitle>
              <CardDescription>View performance and check applications per job.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">{job.title}</h4>
                      <div className="flex gap-4 text-xs text-slate-500 mt-1">
                        <span>Posted {job.posted}</span>
                        <span className={job.status === 'Active' ? 'text-green-600 font-medium' : 'text-slate-400'}>
                          ● {job.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right mr-4 hidden sm:block">
                        <p className="text-xl font-bold text-slate-900 dark:text-white">{job.applicants}</p>
                        <p className="text-xs text-slate-500">Applicants</p>
                      </div>
                      
                      {/* ✅ Action: View Submissions for this specific Job */}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => navigate(`/submissions?jobId=${job.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" /> View Submissions
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- RIGHT: CANDIDATE TRACKER UPDATES (Mini View) --- */}
        <div>
           <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 h-full">
            <CardHeader>
              <CardTitle>Candidates to Watch</CardTitle>
              <CardDescription>Quick updates for your assigned talent.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="flex gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer" onClick={() => navigate('/candidates')}>
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-xs">
                        JS
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-slate-900 dark:text-white">Jane Smith</p>
                        <p className="text-xs text-slate-500">Interview scheduled tomorrow</p>
                      </div>
                   </div>
                 ))}
                 <Button variant="link" className="w-full text-slate-500" onClick={() => navigate('/candidates')}>
                    View All Candidates
                 </Button>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: Candidate Dashboard (Fallback) ---
const CandidateDashboard = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className="p-8 text-center">
       <h1 className="text-2xl font-bold">Redirecting...</h1>
       <Button onClick={() => navigate('/candidate/jobs')} className="mt-4">Go to My Jobs</Button>
    </div>
  );
};

// --- MAIN WRAPPER ---
const Dashboard = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  if (user.role === 'ADMIN') return <AdminDashboard user={user} />;
  if (user.role === 'TALENT_MANAGER') return <TalentManagerDashboard user={user} />;
  return <CandidateDashboard user={user} />;
};

export default Dashboard;