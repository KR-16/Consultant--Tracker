import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getJobs } from '../../api/jobs';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Clock, Loader2 } from 'lucide-react';

const JobBoard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  
  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: getJobs,
  });

  useEffect(() => {
    if (jobs.length > 0) {
      const results = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJobs(results);
    } else {
      setFilteredJobs([]);
    }
  }, [searchTerm, jobs]);

  if (isLoading) return (
    <div className="flex justify-center items-center p-20">
      <Loader2 className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400" />
    </div>
  );
  
  if (error) return (
    <div className="text-center py-20">
      <div className="text-red-500 mb-2">Failed to load jobs</div>
      <p className="text-gray-500">Please try again later</p>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Jobs</h1>
          <p className="text-slate-500 dark:text-slate-400">Discover opportunities curated for you</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative max-w-2xl w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search by role, company, or location..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-800">
          <Briefcase className="h-12 w-12 mx-auto text-slate-400 mb-4" />
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium mb-2">
            {searchTerm ? 'No jobs found matching your search' : 'No jobs available'}
          </p>
          {searchTerm && (
            <p className="text-slate-400">Try different keywords or check back later</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <Link 
              key={job.id} 
              to={`/candidate/jobs/${job.id}`}
              className="block group"
            >
              <div className="h-full p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-lg transition-all duration-300 group-hover:border-blue-300 dark:group-hover:border-blue-700">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded mb-1">
                      {job.type || 'Full-time'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(job.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                    {job.company || 'Tech Corporation'}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                    <span className="line-clamp-1">{job.location || 'Remote'}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                    <Clock className="w-4 h-4 mr-2 text-slate-400" />
                    <span>{job.experience_required || 'Experience not specified'}</span>
                  </div>
                </div>

                {job.salary_range && (
                  <div className="mb-6">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm font-medium">
                      {job.salary_range}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    View Details
                  </span>
                  <span className="text-slate-400 group-hover:text-blue-500 transition-colors">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Stats Bar */}
      {filteredJobs.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Showing {filteredJobs.length} of {jobs.length} jobs</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {searchTerm ? 'Search Results' : 'All Jobs'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobBoard;