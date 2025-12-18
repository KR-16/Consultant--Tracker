import React from 'react';
import { 
  BarChart3, Download, FileText, 
  Users, Briefcase, Calendar 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';

const Reports = () => {
  const { user } = useAuth();

  
  const downloadReport = (reportType) => {
    let data = [];
    let filename = '';

    if (reportType === 'candidates') {
      filename = 'candidates_report.csv';
      data = [
        ['ID', 'Name', 'Email', 'Role', 'Status', 'Applied Date'],
        ['101', 'John Doe', 'john@test.com', 'Dev', 'Interview', '2023-10-01'],
        ['102', 'Jane Smith', 'jane@test.com', 'Design', 'Hired', '2023-09-15']
      ];
    } else if (reportType === 'jobs') {
      filename = 'jobs_report.csv';
      data = [
        ['Job ID', 'Title', 'Applicants', 'Status', 'Posted Date'],
        ['1', 'React Dev', '15', 'Active', '2023-11-01'],
        ['2', 'Python Dev', '8', 'Closed', '2023-10-20']
      ];
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + data.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Export system data and analyze recruitment performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Report 1: Candidates */}
        <Card className="hover:border-blue-300 transition-colors border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle>Candidate Pipeline Report</CardTitle>
            <CardDescription>
              Export a list of all candidates including their current status, contact info, and application dates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => downloadReport('candidates')} className="w-full">
              <Download className="w-4 h-4 mr-2" /> Download CSV
            </Button>
          </CardContent>
        </Card>

        {/* Report 2: Jobs */}
        <Card className="hover:border-purple-300 transition-colors border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-2">
              <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle>Job Performance Report</CardTitle>
            <CardDescription>
              Analyze active jobs, applicant counts per job, and time-to-fill metrics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => downloadReport('jobs')} className="w-full" variant="outline">
              <Download className="w-4 h-4 mr-2" /> Download CSV
            </Button>
          </CardContent>
        </Card>

        {/* Report 3: Tracker Audit (Admin Only) */}
        {user?.role === 'ADMIN' && (
          <Card className="hover:border-amber-300 transition-colors border-slate-200 dark:border-slate-800 dark:bg-slate-900">
            <CardHeader>
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle>System Activity Audit</CardTitle>
              <CardDescription>
                Detailed logs of user logins, role changes, and system errors for security auditing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button disabled className="w-full" variant="secondary">
                 Generate Audit Log (Processing...)
              </Button>
            </CardContent>
          </Card>
        )}
        
      </div>
    </div>
  );
};

export default Reports;