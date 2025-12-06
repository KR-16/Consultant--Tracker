import React from 'react';
import { Search, Filter, MoreHorizontal } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

const Submissions = () => {
  const submissions = [
    { id: 1, candidate: "John Smith", client: "TechCorp", role: "Frontend Dev", status: "Interviewing", date: "2 mins ago" },
    { id: 2, candidate: "Sarah Johnson", client: "CloudFirst", role: "DevOps", status: "Selected", date: "1 hour ago" },
    { id: 3, candidate: "Michael Chen", client: "FinanceHub", role: "Backend Lead", status: "Submitted", date: "2 hours ago" },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Interviewing': return 'bg-orange-100 text-orange-700';
      case 'Selected': return 'bg-green-100 text-green-700';
      case 'Submitted': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Submissions</h1>
          <p className="text-slate-500">Track application status</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input placeholder="Search submissions..." className="pl-10 border-slate-200" />
          </div>
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
        </div>

        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">Candidate</th>
              <th className="px-6 py-4">Client / Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Applied</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {submissions.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{sub.candidate}</td>
                <td className="px-6 py-4">
                  <div className="text-slate-900">{sub.client}</div>
                  <div className="text-slate-500 text-xs">{sub.role}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sub.status)}`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{sub.date}</td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4 text-slate-400" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Submissions;