import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getAllUsers } from '../../api/admin';
import { getJobs } from '../../api/jobs';
import { 
  Users, Briefcase, FileText, TrendingUp, 
  UserPlus, Settings, ChevronRight 
} from 'lucide-react';

const AdminDashboard = () => {
  const { data: users = [] } = useQuery({ queryKey: ['admin-users'], queryFn: () => getAllUsers() });
  const { data: jobs = [] } = useQuery({ queryKey: ['jobs'], queryFn: getJobs });

  const managers = users.filter(u => u.role === 'HIRING_MANAGER').length;
  const candidates = users.filter(u => u.role === 'CANDIDATE').length;

  return (
    <div className="p-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back. Here is what's happening in Talentra today.</p>
        </div>
        <Link 
          to="/admin/users" 
          className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Manage Users
        </Link>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{users.length}</h3>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +12% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex gap-2 text-xs text-gray-500">
            <span className="px-2 py-1 bg-gray-100 rounded">{managers} Managers</span>
            <span className="px-2 py-1 bg-gray-100 rounded">{candidates} Candidates</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Jobs</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{jobs.length}</h3>
              <p className="text-xs text-gray-500 mt-1">Across all departments</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
        </div>

      </div>

      {/* Quick Links Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Management Link */}
        <Link to="/admin/users" className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">User Management</h3>
                <p className="text-sm text-gray-500">Create users, assign managers, and manage roles.</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-600" />
          </div>
        </Link>

        {/* Reports Link */}
        <Link to="/reports" className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">System Reports</h3>
                <p className="text-sm text-gray-500">View hiring metrics, placements, and download CSVs.</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-orange-600" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;