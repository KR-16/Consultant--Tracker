import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, CheckCircle, FileText, Clock, ArrowUpRight, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
// Import your mock data
import { candidates as mockCandidates, submissions as mockSubmissions } from '../../data/mockData';

// --- 1. Custom Visual Components (No Recharts needed) ---

const PipelineBarChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.count)) || 1; // Avoid divide by zero
  
  return (
    <div className="flex items-end justify-between h-48 pt-6 gap-2">
      {data.map((item, i) => {
        const heightPercentage = Math.max((item.count / max) * 100, 5); // Min 5% height
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

const StatusDonutChart = ({ total }) => (
  <div className="relative h-48 w-48 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
      {/* Background Circle */}
      <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="20" fill="transparent" />
      {/* Segment 1 (Dark) */}
      <circle cx="50" cy="50" r="40" stroke="#0f172a" strokeWidth="20" fill="transparent" strokeDasharray="100 251" />
      {/* Segment 2 (Grey) */}
      <circle cx="50" cy="50" r="40" stroke="#94a3b8" strokeWidth="20" fill="transparent" strokeDasharray="60 251" strokeDashoffset="-100" />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center flex-col">
      <span className="text-3xl font-bold text-slate-900">{total}</span>
      <span className="text-xs text-slate-500">Active</span>
    </div>
  </div>
);

const ActivityLineChart = () => (
  <div className="relative h-48 w-full pt-4">
    {/* Grid Lines */}
    <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-300">
      {[1, 2, 3, 4].map(i => <div key={i} className="border-b border-dashed border-slate-200 w-full h-0"></div>)}
    </div>
    {/* The Line */}
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
    'Interviewing': 'bg-orange-100 text-orange-700',
    'Selected': 'bg-green-100 text-green-700',
    'Submitted': 'bg-blue-100 text-blue-700',
    'Rejected': 'bg-slate-100 text-slate-700',
    'Applied': 'bg-purple-100 text-purple-700'
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

  // --- Logic calculated from Mock Data ---
  const totalConsultants = mockCandidates ? mockCandidates.length : 0;
  const activeSubmissions = mockSubmissions ? mockSubmissions.length : 0;
  
  // Calculate counts for pipeline
  const getStatusCount = (status) => mockSubmissions ? mockSubmissions.filter(s => s.stage === status).length : 0;

  const pipelineData = [
    { name: "Applied", count: getStatusCount("Applied") + 5 }, // +5 fake for visual demo
    { name: "Submitted", count: getStatusCount("Submitted") + 12 },
    { name: "Interview", count: getStatusCount("Technical Round") + 8 },
    { name: "Selected", count: getStatusCount("Selected") + 3 },
    { name: "Rejected", count: 4 },
  ];

  const stats = [
    { title: 'Total Candidates', value: totalConsultants, trend: '+2 this week', icon: Users, trendColor: 'text-green-600' },
    { title: 'Available', value: '45', trend: '60% of total', icon: CheckCircle, trendColor: 'text-slate-500' },
    { title: 'Total Submissions', value: activeSubmissions, trend: '+5 this week', icon: FileText, trendColor: 'text-green-600' },
    { title: 'Interviewing', value: '12', trend: 'Active interviews', icon: Clock, trendColor: 'text-blue-600' },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back! Here's your overview.</p>
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
                  <div className={`flex items-center mt-2 text-xs font-medium ${stat.trendColor}`}>
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {stat.trend}
                  </div>
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
        {/* Pipeline Chart */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Submission Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <PipelineBarChart data={pipelineData} />
          </CardContent>
        </Card>

        {/* Status Donut */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center pt-4">
              <StatusDonutChart total={activeSubmissions} />
              <div className="flex gap-4 mt-8 text-xs text-slate-500">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-900"></div> Submitted</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-400"></div> Selected</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Line Chart & Recent List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityLineChart />
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Recent Submissions</CardTitle>
            <Button variant="ghost" className="text-sm text-slate-500 hover:text-slate-900 p-0 h-auto">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockSubmissions && mockSubmissions.slice(0, 4).map((sub, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                      {/* Initials */}
                      CS
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{sub.client}</p>
                      <p className="text-sm text-slate-500">{sub.role}</p>
                    </div>
                  </div>
                  {/* Map "Technical Round" etc to badge style */}
                  <StatusBadge status={i % 2 === 0 ? 'Interviewing' : 'Submitted'} />
                </div>
              ))}
              {(!mockSubmissions || mockSubmissions.length === 0) && (
                <div className="text-center text-slate-500 py-4">No recent activity</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default Dashboard;