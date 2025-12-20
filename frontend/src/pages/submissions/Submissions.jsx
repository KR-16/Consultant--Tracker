import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJobSubmissions, updateSubmissionStatus } from '../../api/submissions'; 
import { getJobs } from '../../api/jobs'; 
import { 
  CheckCircle, XCircle, Clock, FileText, 
  MessageSquare, ChevronRight, AlertCircle 
} from 'lucide-react';

const Submissions = () => {
  const queryClient = useQueryClient();
  const [selectedJobId, setSelectedJobId] = useState('');
  const [editingId, setEditingId] = useState(null); 
  const [statusForm, setStatusForm] = useState({ status: '', notes: '' });
  const { data: jobs = [] } = useQuery({ queryKey: ['jobs'], queryFn: getJobs });
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['submissions', selectedJobId],
    queryFn: () => getJobSubmissions(selectedJobId),
    enabled: !!selectedJobId, 
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, notes }) => updateSubmissionStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries(['submissions']);
      setEditingId(null);
    },
    onError: (err) => alert("Failed to update: " + err.message)
  });

  const handleUpdateClick = (submission) => {
    setEditingId(submission.id);
    setStatusForm({ status: submission.current_status, notes: submission.manager_notes || '' });
  };

  const saveUpdate = () => {
    if (!statusForm.status) return;
    updateMutation.mutate({ 
      id: editingId, 
      status: statusForm.status, 
      notes: statusForm.notes 
    });
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Submissions Tracker</h1>
          <p className="text-gray-500">Manage candidate applications and hiring stages.</p>
        </div>
        
        {/* Job Selector */}
        <select 
          className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
        >
          <option value="">-- Select a Job to View --</option>
          {jobs.map(job => (
            <option key={job.id} value={job.id}>{job.title}</option>
          ))}
        </select>
      </div>

      {!selectedJobId ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Select a Job</h3>
          <p className="text-gray-500">Please select a job from the dropdown above to view applications.</p>
        </div>
      ) : isLoading ? (
        <div className="text-center p-10">Loading submissions...</div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No applications received for this job yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-900 font-semibold border-b">
              <tr>
                <th className="p-4">Candidate</th>
                <th className="p-4">Resume</th>
                <th className="p-4">Current Stage</th>
                <th className="p-4">Manager Notes</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">
                    Candidate #{sub.candidate_id} 
                  </td>
                  <td className="p-4">
                    <span className="text-blue-600 underline cursor-pointer">View Resume</span>
                  </td>
                  <td className="p-4">
                    {editingId === sub.id ? (
                      <select 
                        className="border rounded px-2 py-1 w-full"
                        value={statusForm.status}
                        onChange={(e) => setStatusForm({...statusForm, status: e.target.value})}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Assessment">Assessment</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    ) : (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        sub.current_status === 'Offer' ? 'bg-green-100 text-green-800' :
                        sub.current_status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {sub.current_status}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                     {editingId === sub.id ? (
                       <input 
                         className="border rounded px-2 py-1 w-full"
                         placeholder="Add notes..."
                         value={statusForm.notes}
                         onChange={(e) => setStatusForm({...statusForm, notes: e.target.value})}
                       />
                     ) : (
                       <span className="text-gray-500 truncate max-w-xs block">{sub.manager_notes || '-'}</span>
                     )}
                  </td>
                  <td className="p-4 text-right">
                    {editingId === sub.id ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingId(null)} className="text-gray-500 text-xs">Cancel</button>
                        <button 
                          onClick={saveUpdate} 
                          disabled={updateMutation.isLoading}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleUpdateClick(sub)}
                        className="text-blue-600 hover:underline text-xs font-medium"
                      >
                        Update Status
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Submissions;