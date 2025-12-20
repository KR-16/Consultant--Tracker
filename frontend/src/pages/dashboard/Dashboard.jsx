import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Users, Briefcase, Clock, CheckCircle, 
  Plus, Eye, BarChart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';


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
        <StatsCard 
          title="Total Users" 
          value="1,240" 
          icon={Users} 
          subtitle="Across all roles" 
          theme="dark"
        />
        <StatsCard 
          title="System Load" 
          value="Normal" 
          icon={CheckCircle} 
          subtitle="All services operational" 
          iconColor="text-green-600"
        />
        <StatsCard 
          title="Total Jobs Posted" 
          value="85" 
          icon={Briefcase} 
          subtitle="Active on platform" 
          iconColor="text-blue-600"
        />
      </div>
    </div>
  );
};


const HiringManagerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const myJobs = [
    { id: 101, title: "Senior React Developer", applicants: 12, posted: "2 days ago", status: "Active" },
    { id: 102, title: "Backend Engineer (Python)", applicants: 5, posted: "5 days ago", status: "Active" },
    { id: 103, title: "UI/UX Designer", applicants: 28, posted: "1 week ago", status: "Closed" },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Recruiter Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your jobs and candidates.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/reports')} variant="outline">
            <BarChart className="w-4 h-4 mr-2" /> Reports
          </Button>
          <Button onClick={() => navigate('/jobs/new')} className="bg-slate-900 text-white hover:bg-slate-800">
            <Plus className="w-4 h-4 mr-2" /> Post a Job
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard title="Active Jobs" value="12" icon={Briefcase} color="bg-blue-50 text-blue-600" iconColor="text-blue-600" />
        <StatsCard title="Total Applicants" value="148" icon={Users} color="bg-purple-50 text-purple-600" iconColor="text-purple-600" />
        <StatsCard title="Interviews" value="8" icon={Clock} color="bg-amber-50 text-amber-600" iconColor="text-amber-600" />
        <StatsCard title="Hired (M)" value="3" icon={CheckCircle} color="bg-green-50 text-green-600" iconColor="text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: MY ACTIVE JOBS */}
        <div className="lg:col-span-2 space-y-6">
           <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <CardHeader>
              <CardTitle>My Posted Jobs</CardTitle>
              <CardDescription>View performance and check applications.</CardDescription>
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
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => navigate(`/submissions?jobId=${job.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" /> View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: CANDIDATES TO WATCH */}
        <div>
           <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 h-full shadow-sm">
            <CardHeader>
              <CardTitle>Candidates to Watch</CardTitle>
              <CardDescription>Upcoming interviews.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="flex gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer" onClick={() => navigate('/hiring/my-candidates')}>
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">
                        JS
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-slate-900 dark:text-white">Jane Smith</p>
                        <p className="text-xs text-slate-500">Interview tomorrow</p>
                      </div>
                   </div>
                 ))}
                 <Button variant="link" className="w-full text-slate-500" onClick={() => navigate('/hiring/my-candidates')}>
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

const StatsCard = ({ title, value, icon: Icon, subtitle, iconColor, theme = 'light' }) => {
  const isDark = theme === 'dark';
  return (
    <Card className={`border-none ${isDark ? 'bg-slate-900 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}`}>
      <CardContent className="p-6">
        <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{title}</p>
        <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{value}</h3>
        {subtitle && (
           <div className={`flex items-center gap-2 mt-4 text-sm ${isDark ? 'text-slate-300' : iconColor || 'text-slate-600'}`}>
             {Icon && <Icon className="w-4 h-4" />} {subtitle}
           </div>
        )}
      </CardContent>
    </Card>
  );
};

const CandidateRedirect = () => {
  const navigate = useNavigate();
  React.useEffect(() => { navigate('/candidate/dashboard'); }, [navigate]);
  return <div className="p-8">Redirecting...</div>;
};

const Dashboard = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  const role = user.role ? user.role.toLowerCase() : '';

  if (role === 'admin') return <AdminDashboard user={user} />;
  if (role === 'hiring_manager' || role === 'talent_manager') {
    return <HiringManagerDashboard user={user} />;
  }
  
  return <CandidateRedirect />;
};

export default Dashboard;