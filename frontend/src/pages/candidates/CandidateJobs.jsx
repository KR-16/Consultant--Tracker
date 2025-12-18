import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Briefcase, Loader2 } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { getJobs } from '../../api/jobs';

const CandidateJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch Open Jobs
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const data = await getJobs();
        setJobs(data);
        setFilteredJobs(data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Unable to load open positions.");
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  // 2. Search Filter
  useEffect(() => {
    const results = jobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(results);
  }, [searchTerm, jobs]);

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;
  if (error) return <div className="text-center text-red-500 p-10">{error}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Open Positions</h1>
        <p className="text-slate-500 dark:text-slate-400">Find your next opportunity from our curated job list.</p>
      </div>

      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
        <Input 
          placeholder="Search by title, company, or location..." 
          className="pl-10 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-800">
           <Briefcase className="h-10 w-10 mx-auto text-slate-400 mb-3" />
           <p className="text-slate-500">No jobs found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-all border-slate-200 dark:border-slate-800 dark:bg-slate-900 cursor-pointer group">
              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">
                      {new Date(job.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                      {job.company || "RecruitOps Client"}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 shrink-0" /> {job.location || "Remote"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0" /> {job.type || "Full-time"}
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => navigate(`/candidate/jobs/${job.id}`)}
                  className="w-full mt-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateJobs;