import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, assignCandidate } from '../../api/admin'; 
import { register } from '../../api/auth'; 
import { 
  Users, UserPlus, Link as LinkIcon, Search, 
  Briefcase, CheckCircle, AlertCircle, Loader2 
} from 'lucide-react';

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('users'); 
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // --- Data Fetching ---
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => getAllUsers(), 
  });

  // Filter lists
  const managers = users.filter(u => u.role === 'HIRING_MANAGER');
  const candidates = users.filter(u => u.role === 'CANDIDATE');

  // --- Mutations ---
  const createUserMutation = useMutation({
    mutationFn: (data) => register(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      setShowCreateModal(false);
      alert("User created successfully!");
    },
    onError: (err) => alert(err.response?.data?.detail || "Failed to create user")
  });

  const assignMutation = useMutation({
    mutationFn: ({ managerId, candidateId }) => assignCandidate(managerId, candidateId),
    onSuccess: () => {
      alert("Candidate assigned successfully!");
    },
    onError: (err) => alert(err.response?.data?.detail || "Assignment failed")
  });

  // --- Components ---

  const CreateUserModal = () => {
    const [formData, setFormData] = useState({ 
      email: '', password: '', first_name: '', last_name: '', role: 'CANDIDATE' 
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      createUserMutation.mutate(formData);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <h2 className="text-xl font-bold mb-4">Create New User</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input 
                placeholder="First Name" 
                className="border p-2 rounded" 
                required
                onChange={e => setFormData({...formData, first_name: e.target.value})}
              />
              <input 
                placeholder="Last Name" 
                className="border p-2 rounded" 
                required
                onChange={e => setFormData({...formData, last_name: e.target.value})}
              />
            </div>
            <input 
              type="email" 
              placeholder="Email" 
              className="border p-2 rounded w-full" 
              required
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="border p-2 rounded w-full" 
              required
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
            <select 
              className="border p-2 rounded w-full"
              onChange={e => setFormData({...formData, role: e.target.value})}
              value={formData.role}
            >
              <option value="CANDIDATE">Candidate</option>
              <option value="HIRING_MANAGER">Hiring Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
            
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                {createUserMutation.isLoading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const AssignmentPanel = () => {
    const [selectedManager, setSelectedManager] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState('');

    const handleAssign = () => {
      if(!selectedManager || !selectedCandidate) return alert("Select both users");
      assignMutation.mutate({ managerId: selectedManager, candidateId: selectedCandidate });
    };

    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-2xl">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <LinkIcon className="w-5 h-5 mr-2 text-blue-600" />
          Assign Candidate to Manager
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Select a Hiring Manager and a Candidate to link them. The manager will then be able to view and manage this candidate.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Manager</label>
            <select 
              className="w-full border p-2 rounded-lg"
              onChange={(e) => setSelectedManager(e.target.value)}
              value={selectedManager}
            >
              <option value="">-- Choose Manager --</option>
              {managers.map(m => (
                <option key={m.id} value={m.id}>{m.first_name} {m.last_name} ({m.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Candidate</label>
            <select 
              className="w-full border p-2 rounded-lg"
              onChange={(e) => setSelectedCandidate(e.target.value)}
              value={selectedCandidate}
            >
              <option value="">-- Choose Candidate --</option>
              {candidates.map(c => (
                <option key={c.id} value={c.id}>{c.first_name} {c.last_name} ({c.email})</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          onClick={handleAssign}
          disabled={assignMutation.isLoading || !selectedManager || !selectedCandidate}
          className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50"
        >
          {assignMutation.isLoading ? 'Assigning...' : 'Confirm Assignment'}
        </button>
      </div>
    );
  };

  if (isLoading) return <div className="p-10 text-center">Loading users...</div>;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500">Manage system users and assignments</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          All Users
        </button>
        <button 
          onClick={() => setActiveTab('assignments')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'assignments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Assignments
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'users' ? (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-900 font-semibold border-b">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{user.first_name} {user.last_name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'HIRING_MANAGER' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-green-600 flex items-center text-xs font-bold">
                        <CheckCircle className="w-3 h-3 mr-1" /> Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <AssignmentPanel />
        )}
      </div>

      {showCreateModal && <CreateUserModal />}
    </div>
  );
};

export default UserManagement;