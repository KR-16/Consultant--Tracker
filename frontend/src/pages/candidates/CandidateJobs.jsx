// frontend/src/pages/candidates/CandidateJobs.jsx
import React from 'react';
import { Search, MapPin, Building, Clock } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';

const CandidateJobs = () => {
  // Mock Data: Jobs the candidate has applied to
  const myJobs = [
    { id: 1, role: "Senior React Developer", company: "TechCorp Inc.", location: "Remote", status: "Interviewing", date: "Applied 2 days ago" },
    { id: 2, role: "Full Stack Engineer", company: "FinanceHub", location: "New York, NY", status: "Submitted", date: "Applied 1 week ago" },
    { id: 3, role: "Frontend Lead", company: "StartupX", location: "San Francisco, CA", status: "Rejected", date: "Applied 2 weeks ago" },
  ];

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Interviewing': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Submitted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Rejected': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-8 max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Jobs</h1>
        <p className="text-slate-500">Track your applications and current opportunities.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input placeholder="Search your jobs..." className="pl-10 bg-white" />
      </div>

      <div className="space-y-4">
        {myJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-all border-slate-200 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-slate-900">{job.role}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Building className="w-3 h-3" /> {job.company}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.date}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(job.status)}`}>
                    {job.status}
                  </span>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 p-0 h-auto">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CandidateJobs;