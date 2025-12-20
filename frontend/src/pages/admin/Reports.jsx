import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '../../api/admin';
import { getJobs } from '../../api/jobs';
import { BarChart3, Users, Briefcase, FileCheck, Download } from 'lucide-react';

const Reports = () => {
  const { data: users = [] } = useQuery({ queryKey: ['admin-users'], queryFn: () => getAllUsers() });
  const { data: jobs = [] } = useQuery({ queryKey: ['jobs'], queryFn: getJobs });
  const candidatesCount = users.filter(u => u.role === 'CANDIDATE').length;
  const managersCount = users.filter(u => u.role === 'HIRING_MANAGER').length;
  const activeJobs = jobs.length;
  const placements = [
    { id: 1, candidate: "Alice Cooper", job: "Senior React Dev", date: "2024-03-15", status: "Offer Accepted" },
    { id: 2, candidate: "Bob Smith", job: "Python Backend", date: "2024-03-10", status: "Joined" },
  ];

  const handleDownloadCSV = () => {
    alert("Downloading Report.csv... (Backend endpoint needed for real file)");
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Reports</h1>
          <p className="text-gray-500">Overview of platform performance and hiring metrics.</p>
        </div>
        <button 
          onClick={handleDownloadCSV}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Candidates</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{candidatesCount}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Hiring Managers</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{managersCount}</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Jobs</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{activeJobs}</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-600">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Placements</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">12</h3> {/* Mock Data */}
            </div>
            <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
              <FileCheck className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Placements Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Recent Placements</h3>
        </div>
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-900 font-semibold border-b">
            <tr>
              <th className="p-4">Candidate</th>
              <th className="p-4">Job Role</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {placements.map((p) => (
              <tr key={p.id}>
                <td className="p-4 font-medium text-gray-900">{p.candidate}</td>
                <td className="p-4">{p.job}</td>
                <td className="p-4">{p.date}</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;