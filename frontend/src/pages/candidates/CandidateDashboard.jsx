import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getMyApplications } from '../../api/submissions';
import { getJobs } from '../../api/jobs';
import { 
  Briefcase, 
  FileText, 
  CheckCircle, 
  Clock,  
  Search,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: applications = [] } = useQuery({
    queryKey: ['my-applications'],
    queryFn: getMyApplications,
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ['jobs'],
    queryFn: getJobs,
  });

  const activeApps = applications.filter(app => 
    ['Applied', 'Assessment', 'Interview'].includes(app.current_status || app.status)
  ).length;
  
  const interviews = applications.filter(app => 
    (app.current_status || app.status || '').includes('Interview')
  ).length;

  const offers = applications.filter(app => 
    (app.current_status || app.status) === 'Offer'
  ).length;

  return (
    <div className="p-8 space-y-8">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Welcome, {user?.first_name || 'Candidate'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Track your applications and find your next role.
          </p>
        </div>
        <Button onClick={() => navigate('/candidate/jobs')} className="bg-slate-900 text-white hover:bg-slate-800">
          <Search className="w-4 h-4 mr-2" /> Find Jobs
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard 
          title="Active Applications" 
          value={activeApps} 
          icon={FileText} 
          subtitle="In progress"
          iconColor="text-blue-600"
        />
        <StatsCard 
          title="Interviews" 
          value={interviews} 
          icon={Clock} 
          subtitle="Scheduled"
          iconColor="text-amber-600"
        />
        <StatsCard 
          title="Offers" 
          value={offers} 
          icon={CheckCircle} 
          subtitle="Received"
          iconColor="text-green-600"
        />
        <StatsCard 
          title="Open Jobs" 
          value={jobs.length} 
          icon={Briefcase} 
          subtitle="Apply now"
          iconColor="text-purple-600"
        />
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: RECENT APPLICATIONS TABLE */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-sm h-full">
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Status updates on your submissions.</CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                 <div className="text-center py-8 text-slate-500">
                   <p>No active applications.</p>
                   <Button variant="link" onClick={() => navigate('/candidate/jobs')} className="mt-2 text-blue-600">
                     Browse Jobs
                   </Button>
                 </div>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 4).map((app) => (
                    <div 
                      key={app.id} 
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800"
                    >
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {app.job?.title || app.job_title || `Job #${app.job_id}`}
                        </h4>
                        <div className="flex gap-4 text-xs text-slate-500 mt-1">
                          <span>Applied {new Date(app.created_at || app.applied_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border
                        ${(app.current_status || app.status) === 'Offer' ? 'bg-green-50 text-green-700 border-green-200' : 
                          (app.current_status || app.status)?.includes('Interview') ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {app.current_status || app.status || 'Applied'}
                      </div>
                    </div>
                  ))}
                  <Button variant="link" className="w-full text-slate-500" onClick={() => navigate('/candidate/applications')}>
                    View All Applications
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: PROFILE */}
        <div>
          <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 h-full shadow-sm">
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>Keep your info up to date.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                  {user?.first_name ? user.first_name[0] : 'C'}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/candidate/profile')} 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <User className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
                <Button 
                  onClick={() => navigate('/candidate/jobs')} 
                  className="w-full justify-start bg-slate-900 text-white hover:bg-slate-800"
                >
                  <Search className="mr-2 h-4 w-4" /> Browse Jobs
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
    <Card className={`border-none ${isDark ? 'bg-slate-900 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm'}`}>
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

export default CandidateDashboard;