import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPipelineSubmissions } from '../../api/submissions';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Loader2, Briefcase, MoreHorizontal } from 'lucide-react';

const STAGES = [
  "Applied",
  "Online Assessment",
  "Technical Interview",
  "Manager Round",
  "Offer Letter"
];

const Pipeline = () => {
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['pipeline'],
    queryFn: getPipelineSubmissions
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Recruitment Pipeline</h1>
        <p className="text-slate-500">Track candidate progress across all active roles.</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[70vh]">
        {STAGES.map(stage => (
          <div key={stage} className="flex-shrink-0 w-80 bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-700 mb-4 flex justify-between items-center">
              {stage}
              <Badge variant="secondary" className="bg-white">
                {submissions.filter(s => s.status === stage).length}
              </Badge>
            </h3>
            
            <div className="space-y-3">
              {submissions
                .filter(submission => submission.status === stage)
                .map(submission => (
                  <PipelineCard key={submission.id} submission={submission} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PipelineCard = ({ submission }) => (
  <Card className="shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
    <CardContent className="p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
            {submission.candidate_name ? submission.candidate_name[0] : 'C'}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{submission.candidate_name}</p>
            <p className="text-[10px] text-slate-500 flex items-center gap-1">
              <Briefcase className="h-2.5 w-2.5" /> {submission.job_title}
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </CardContent>
  </Card>
);

export default Pipeline;