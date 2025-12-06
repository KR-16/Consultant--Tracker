// frontend/src/pages/candidates/CandidateTracker.jsx
import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const TrackerItem = ({ status, title, date, active }) => (
  <div className="flex gap-4 pb-8 last:pb-0 relative">
    {/* Line connector */}
    <div className="absolute left-[15px] top-8 bottom-0 w-px bg-slate-200 last:hidden"></div>
    
    <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
      active ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-300'
    }`}>
      {active ? <Clock className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
    </div>
    
    <div>
      <h4 className={`font-semibold ${active ? 'text-blue-600' : 'text-slate-900'}`}>{status}</h4>
      <p className="text-sm text-slate-600">{title}</p>
      <p className="text-xs text-slate-400 mt-1">{date}</p>
    </div>
  </div>
);

const CandidateTracker = () => {
  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Application Tracker</h1>
        <p className="text-slate-500">Live status updates on your active applications.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Active Application 1 */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-lg">
              <span>Senior React Developer</span>
              <span className="text-sm font-normal text-slate-500">TechCorp Inc.</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <TrackerItem status="Application Submitted" title="Profile sent to hiring manager" date="Dec 1, 2025" active={false} />
              <TrackerItem status="Resume Screened" title="Passed initial screening" date="Dec 3, 2025" active={false} />
              <TrackerItem status="Technical Interview" title="Scheduled with Lead Dev" date="Dec 6, 2025" active={true} />
              <TrackerItem status="Final Offer" title="Pending..." date="-" active={false} />
            </div>
          </CardContent>
        </Card>

        {/* Active Application 2 */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-lg">
              <span>Full Stack Engineer</span>
              <span className="text-sm font-normal text-slate-500">FinanceHub</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <TrackerItem status="Application Submitted" title="Received by HR" date="Nov 28, 2025" active={false} />
              <TrackerItem status="Resume Screened" title="Passed screening" date="Nov 30, 2025" active={false} />
              <TrackerItem status="Assessment" title="Code test submitted" date="Dec 2, 2025" active={true} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CandidateTracker;