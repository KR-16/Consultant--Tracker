import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyApplications } from '../../api/submissions';
import { CheckCircle, Clock, XCircle, FileText, Calendar } from 'lucide-react';

const getStatusColor = (status) => {
  switch (status) {
    case 'Applied': return 'bg-blue-100 text-blue-800';
    case 'Assessment': return 'bg-purple-100 text-purple-800';
    case 'Interview': return 'bg-orange-100 text-orange-800';
    case 'Offer': return 'bg-green-100 text-green-800';
    case 'Rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const TimelineItem = ({ event, isLast }) => (
  <div className="relative pl-8 pb-8 last:pb-0">
    {/* Vertical Line */}
    {!isLast && (
      <div className="absolute left-3.5 top-8 bottom-0 w-0.5 bg-gray-200"></div>
    )}
    
    {/* Dot */}
    <div className="absolute left-0 top-1 w-7 h-7 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center">
      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
    </div>

    {/* Content */}
    <div>
      <p className="text-sm font-bold text-gray-900">{event.stage}</p>
      <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}</p>
      {event.notes && (
        <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
          "{event.notes}"
        </p>
      )}
    </div>
  </div>
);

const MyApplications = () => {
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: getMyApplications,
  });

  if (isLoading) return <div className="p-10 text-center">Loading tracker...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Application Tracker</h1>
        <p className="text-gray-500">Track the status of your submissions in real-time.</p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
          <p className="text-gray-500">Head over to the Job Board to apply for your first role!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {applications.map((app) => (
            <div key={app.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{app.job_title}</h2>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    Applied on {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center w-fit ${getStatusColor(app.current_status)}`}>
                  {app.current_status === 'Offer' && <CheckCircle className="w-4 h-4 mr-2" />}
                  {app.current_status === 'Rejected' && <XCircle className="w-4 h-4 mr-2" />}
                  {app.current_status === 'Interview' && <Clock className="w-4 h-4 mr-2" />}
                  {app.current_status}
                </div>
              </div>

              {/* Card Body - Timeline */}
              <div className="p-6 bg-gray-50/50">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Hiring Timeline</h3>
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  {app.timeline_history && app.timeline_history.map((event, index) => (
                    <TimelineItem 
                      key={index} 
                      event={event} 
                      isLast={index === app.timeline_history.length - 1} 
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;