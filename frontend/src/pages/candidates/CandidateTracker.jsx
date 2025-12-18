import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, Calendar, CheckCircle, XCircle, 
  Loader2, AlertCircle, ArrowRight 
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { getMyApplications } from '../../api/submissions';

const CandidateTracker = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getMyApplications();
        setApplications(data);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        setError("Failed to load application history.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  const getStatusColor = (status) => {
    switch (status) {
      case 'OFFER': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'REJECTED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'INTERVIEW': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-red-500 gap-2">
        <AlertCircle className="h-8 w-8" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Application Tracker</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Track the status of your {applications.length} applications.
          </p>
        </div>
        <Button onClick={() => navigate('/candidate/jobs')}>
          Browse More Jobs
        </Button>
      </div>

      {applications.length === 0 ? (
        <Card className="text-center py-12 border-dashed">
          <CardContent className="flex flex-col items-center gap-4">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
              <Briefcase className="h-8 w-8 text-slate-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">No applications yet</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                You haven't applied to any positions. Start your search today!
              </p>
            </div>
            <Button onClick={() => navigate('/candidate/jobs')} className="mt-4">
              Find a Job <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Card key={app.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                
                {/* Job Info */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Applied on {new Date(app.applied_at || app.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {app.job?.title || "Unknown Job Title"}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {app.job?.company || "RecruitOps Client"}
                  </p>
                </div>

                {/* Progress Bar / Steps */}
                <div className="flex-1 w-full md:max-w-sm">
                  <div className="relative flex items-center justify-between text-xs text-slate-500">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        ['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'].includes(app.status) 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100'
                      }`}>
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <span>Applied</span>
                    </div>

                    <div className="h-0.5 flex-1 bg-slate-200 mx-2" />

                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        ['INTERVIEW', 'OFFER'].includes(app.status)
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100'
                      }`}>
                        <Calendar className="h-4 w-4" />
                      </div>
                      <span>Interview</span>
                    </div>

                    <div className="h-0.5 flex-1 bg-slate-200 mx-2" />

                    <div className="flex flex-col items-center gap-1">
                       {app.status === 'REJECTED' ? (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500 text-white">
                            <XCircle className="h-4 w-4" />
                          </div>
                       ) : (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            app.status === 'OFFER' ? 'bg-green-600 text-white' : 'bg-slate-100'
                          }`}>
                            <CheckCircle className="h-4 w-4" />
                          </div>
                       )}
                      <span>Result</span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/candidate/jobs/${app.job_id}`)}>
                    View Job
                  </Button>
                </div>

              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateTracker;