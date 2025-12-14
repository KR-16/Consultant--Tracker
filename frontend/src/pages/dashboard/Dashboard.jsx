import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Users, CheckCircle, FileText, Clock, ArrowUpRight, ArrowRight, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';

// API Imports
import { getMyApplications } from '../../api/candidates';
import { getJobs } from '../../api/jobs';
import { getAllUsers } from '../../api/auth';

// --- 1. Visual Components (Kept exactly as you designed) ---

const PipelineBarChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.count)) || 1; 
  
  return (
    <div className="flex items-end justify-between h-48 pt-6 gap-2">
      {data.map((item, i) => {
        const heightPercentage = Math.max((item.count / max) * 100, 5); 
        return (
          <div key={i} className="flex flex-col items-center gap-2 w-full group">
            <div className="w-full bg-slate-100 rounded-t-sm h-full relative overflow-hidden flex items-end">
              <div 
                style={{ height: `${heightPercentage}%` }} 
                className="w-full bg-slate-900 transition-all duration-500 hover:bg-slate-800"
              ></div>
            </div>
            <span className="text-xs text-slate-500 font-medium truncate w-16 text-center">{item.name}</span>
          </div>
        );
      })}
    </div>
  );
};

const StatusDonutChart = ({ total, label="Active" }) => (
  <div className="relative h-48 w-48 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
      <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="20" fill="transparent" />
      <circle cx="50" cy="50" r="40" stroke="#0f172a" strokeWidth="20" fill="transparent" strokeDasharray="100 251" />
      <circle cx="50" cy="50" r="40" stroke="#94a3b8" strokeWidth="20" fill="transparent" strokeDasharray="60 251" strokeDashoffset="-100" />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center flex-col">
      <span className="text-3xl font-bold text-slate-900">{total}</span>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  </div>
);

const ActivityLineChart = () => (
  <div className="relative h-48 w-full pt-4">
    <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-300">
      {[1, 2, 3, 4].map(i => <div key={i} className="border-b border-dashed border-slate-200 w-full h-0"></div>)}
    </div>
    <svg viewBox="0 0 500 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
      <path 
        d="M0,80 C50,60 100,60 150,50 C200,40 250,20 300,40 C350,60 400,80 500,90" 
        fill="none" stroke="#0f172a" strokeWidth="3" vectorEffect="non-scaling-stroke"
      />
    </svg>
    <div className="absolute bottom-[-20px] left-0 right-0 flex justify-between text-xs text-slate-400">
      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    'INTERVIEW': 'bg-orange-100 text-orange-700',
    'OFFER': 'bg-green-100 text-green-700',
    'SUBMITTED': 'bg-blue-100 text-blue-700',
    'REJECTED': 'bg-slate-100 text-slate-700',
    'APPLIED': 'bg-purple-100 text-purple-700'
  };
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

// --- 2. Main Dashboard Component ---

const Dashboard = () => {
  const { user } = useAuth();
  
  if (user?.role === 'CANDIDATE') {
    return <CandidateDashboard />;
  }

  return <ManagerDashboard />;
};

// --- 3. Role Specific Dashboards ---

const CandidateDashboard = () => {
  // Fetch Real Data: Candidate's Applications
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['myApplications'],
    queryFn: getMyApplications
  });

  // Calculate Pipeline Data from Real Submissions
  const getCount = (status) => submissions.filter(s => s.status === status).length;
  
  const pipelineData = [
    { name: "Applied", count: getCount("APPLIED") },
    { name: "Interview", count: getCount("INTERVIEW") },
    { name: "Offer", count: getCount("OFFER") },
    { name: "Rejected", count: getCount("REJECTED") },
  ];

  const stats = [
    { title: 'Total Applications', value: submissions.length, icon: FileText, trendColor: 'text-green-600' },
    { title: 'Interviews', value: getCount("INTERVIEW"), icon: Users, trendColor: 'text-blue-600' },
    { title: 'Offers', value: getCount("OFFER"), icon: CheckCircle, trendColor: 'text-green-600' },
    { title: 'Pending', value: getCount("APPLIED"), icon: Clock, trendColor: 'text-slate-500' },
  ];

  if (isLoading) return <div className="p-8">Loading Dashboard...</div>;

  return (
    <DashboardLayout 
      title="Candidate Dashboard" 
      stats={stats} 
      pipelineData={pipelineData} 
      donutTotal={submissions.length}
      donutLabel="Applications"
      recentItems={submissions}
      isCandidate={true}
    />
  );
};

const ManagerDashboard = () => {
  // Fetch Real Data: All Jobs & Users (Manager View)
  const { data: jobs = [] } = useQuery({ queryKey: ['jobs'], queryFn: getJobs });
  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: getAllUsers });

  const totalCandidates = users.filter(u => u.role === 'CANDIDATE').length;
  const activeJobs = jobs.filter(j => j.is_active).length;

  const pipelineData = [
    { name: "Jobs Open", count: activeJobs },
    { name: "Candidates", count: totalCandidates },
    { name: "Managers", count: users.filter(u => u.role === 'TALENT_MANAGER').length },
  ];

  const stats = [
    { title: 'Total Candidates', value: totalCandidates, icon: Users, trendColor: 'text-green-600' },
    { title: 'Active Jobs', value: activeJobs, icon: Briefcase, trendColor: 'text-blue-600' },
    { title: 'Total Users', value: users.length, icon: CheckCircle, trendColor: 'text-slate-500' },
    { title: 'System Load', value: 'Good', icon: Clock, trendColor: 'text-green-600' },
  ];

  return (
    <DashboardLayout 
      title="Manager Dashboard" 
      stats={stats} 
      pipelineData={pipelineData}
      donutTotal={activeJobs}
      donutLabel="Active Jobs"
      recentItems={jobs} // Showing jobs instead of submissions for manager recent list
      isCandidate={false}
    />
  );
};

// --- 4. Reusable Layout Wrapper (Keeps your exact design) ---

const DashboardLayout = ({ title, stats, pipelineData, donutTotal, donutLabel, recentItems, isCandidate }) => {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="text-slate-500 mt-1">Real-time overview from PostgreSQL Database</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</h3>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <stat.icon className="h-5 w-5 text-slate-900" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Row 1: Pipeline & Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <PipelineBarChart data={pipelineData} />
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center pt-4">
              <StatusDonutChart total={donutTotal} label={donutLabel} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Recent Activity List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Activity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityLineChart />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">
              {isCandidate ? "Recent Applications" : "Active Jobs"}
            </CardTitle>
            <Button variant="ghost" className="text-sm text-slate-500 hover:text-slate-900 p-0 h-auto">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentItems && recentItems.slice(0, 4).map((item, i) => (
                <div key={i} className="flex items-center justify-between group border-b pb-2 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                      {isCandidate ? "HR" : "JB"}
                    </div>
                    <div>
                      {/* Logic to handle different data shapes (Job vs Submission) */}
                      <p className="font-semibold text-slate-900">
                        {isCandidate ? `Job #${item.job_id}` : item.title}
                      </p>
                      <p className="text-sm text-slate-500">
                        {isCandidate ? `Applied: ${new Date(item.created_at).toLocaleDateString()}` : item.location || "Remote"}
                      </p>
                    </div>
                  </div>
                  {isCandidate ? (
                     <StatusBadge status={item.status} />
                  ) : (
                     <span className="text-sm font-bold text-slate-700">Open</span>
                  )}
                </div>
              ))}
              {(!recentItems || recentItems.length === 0) && (
                <div className="text-center text-slate-500 py-4">No recent activity found.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default Dashboard;