import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, DollarSign, Clock, Briefcase, 
  ArrowLeft, CheckCircle, AlertCircle, Loader2 
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useToast } from '../../components/ui/use-toast';
import { getJob } from '../../api/jobs';
import { applyForJob } from '../../api/submissions';

const CandidateJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // 1. Fetch Job Data on Mount
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getJob(id);
        setJob(data);
        
      
      } catch (error) {
        console.error("Error fetching job:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load job details.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, toast]);

  // 2. Handle Application
  const handleApply = async () => {
    setApplying(true);
    try {
      await applyForJob(id);
      
      setHasApplied(true);
      toast({
        title: "Application Submitted!",
        description: `You have successfully applied for ${job.title}.`,
        className: "bg-green-50 border-green-200",
      });
      
    } catch (error) {
      console.error("Application error:", error);
      const errorMessage = error.response?.status === 400 
        ? "Please upload your resume in the Profile section first." 
        : "Failed to submit application. Please try again.";

      toast({
        variant: "destructive",
        title: "Application Failed",
        description: errorMessage,
      });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-bold">Job Not Found</h2>
        <Button variant="outline" onClick={() => navigate('/candidate/jobs')}>
          Back to Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Navigation */}
      <Button 
        variant="ghost" 
        onClick={() => navigate('/candidate/jobs')}
        className="pl-0 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Jobs
      </Button>

      {/* Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {job.title}
            </h1>
            <div className="flex items-center gap-2 text-lg text-slate-600 dark:text-slate-400 font-medium mb-4">
              <Briefcase className="h-5 w-5" />
              {job.company || "RecruitOps Client"}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                <MapPin className="h-4 w-4" /> {job.location || "Remote"}
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                <DollarSign className="h-4 w-4" /> {job.salary_range || "Competitive"}
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                <Clock className="h-4 w-4" /> {job.type || "Full-time"}
              </div>
            </div>
          </div>

          <div className="md:w-auto w-full">
            {hasApplied ? (
              <Button disabled className="w-full md:w-auto bg-green-600 text-white opacity-100">
                <CheckCircle className="mr-2 h-4 w-4" />
                Applied
              </Button>
            ) : (
              <Button 
                onClick={handleApply} 
                disabled={applying}
                className="w-full md:w-40 h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 dark:shadow-none"
              >
                {applying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Apply Now"
                )}
              </Button>
            )}
            <p className="text-xs text-center text-slate-400 mt-2">
              Uses your default profile resume
            </p>
          </div>
        </div>
      </div>

      {/* Description & Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">About the Role</h3>
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Requirements</h3>
            <ul className="space-y-3">
              {Array.isArray(job.requirements) ? (
                job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                    {req}
                  </li>
                ))
              ) : (
                 <p className="text-slate-600 dark:text-slate-300">{job.requirements || "No specific requirements listed."}</p>
              )}
            </ul>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Job Overview</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Posted Date</span>
                <span className="font-medium dark:text-slate-200">
                    {new Date(job.created_at || Date.now()).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Experience</span>
                <span className="font-medium dark:text-slate-200">3-5 Years</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Job ID</span>
                <span className="font-medium font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    #{job.id.toString().padStart(6, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateJobDetails;