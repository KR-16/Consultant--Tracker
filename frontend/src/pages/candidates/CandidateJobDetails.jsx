import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJobDetails } from '../../api/jobs';
import { applyForJob } from '../../api/submissions';
import { getMyResumes } from '../../api/candidates';
import { MapPin, DollarSign, Briefcase, Calendar, AlertCircle } from 'lucide-react';

const CandidateJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => getJobDetails(id),
  });


  const { data: resumes = [] } = useQuery({
    queryKey: ['my-resumes'],
    queryFn: getMyResumes,
  });


  const applyMutation = useMutation({
    mutationFn: () => applyForJob(id, selectedResumeId),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-applications']);
      setIsModalOpen(false);
      navigate('/candidate/dashboard'); 
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.detail || "Failed to apply");
    }
  });

  const handleApplyClick = () => {
    if (resumes.length === 0) {
      alert("You need to upload a resume in your Profile before applying!");
      navigate('/candidate/profile');
      return;
    }
    const primary = resumes.find(r => r.is_primary) || resumes[0];
    if (primary) setSelectedResumeId(primary.id);
    
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (!job) return <div className="p-10 text-center text-red-500">Job not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-lg text-gray-500 mt-2">{job.company || 'Tech Company'}</p>
          </div>
          <button 
            onClick={handleApplyClick}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Now
          </button>
        </div>

        <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2 text-gray-400" />
            {job.location}
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign className="w-5 h-5 mr-2 text-gray-400" />
            {job.salary_range}
          </div>
          <div className="flex items-center text-gray-600">
            <Briefcase className="w-5 h-5 mr-2 text-gray-400" />
            {job.job_type || 'Full-time'}
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-5 h-5 mr-2 text-gray-400" />
            Posted {new Date(job.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
        <div className="prose max-w-none text-gray-600">
          {job.description}
        </div>
        
        {job.requirements && (
          <>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Requirements</h2>
            <div className="prose max-w-none text-gray-600">
              {job.requirements}
            </div>
          </>
        )}
      </div>

      {/* Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Apply for {job.title}</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Resume</label>
              <select 
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                {resumes.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.file_name} {r.is_primary ? '(Primary)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {errorMsg}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={() => applyMutation.mutate()}
                disabled={applyMutation.isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {applyMutation.isLoading ? 'Applying...' : 'Confirm Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateJobDetails;