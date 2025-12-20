import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyCandidates } from '../../api/hiring';
import { Search, Filter, Mail, Phone, MapPin, Briefcase } from 'lucide-react';

const MyCandidates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: candidates = [], isLoading, error } = useQuery({
    queryKey: ['my-candidates'],
    queryFn: getMyCandidates,
  });

  const filteredCandidates = candidates.filter(c => 
    (c.first_name + " " + c.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.primary_skills && c.primary_skills.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) return <div className="p-10 text-center">Loading your candidates...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error loading candidates.</div>;

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Candidates</h1>
          <p className="text-gray-500">Candidates assigned to you for evaluation</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by name, email, or skills..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
          <Filter className="h-4 w-4" /> Filters
        </button>
      </div>

      {/* Candidates Grid */}
      <div className="grid gap-4">
        {filteredCandidates.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No candidates found.</div>
        ) : (
            filteredCandidates.map((c) => (
            <div key={c.id} className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Profile Info */}
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                    {c.first_name?.charAt(0)}
                    </div>
                    <div>
                    <h3 className="font-bold text-gray-900">{c.first_name} {c.last_name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Briefcase className="w-3 h-3 mr-1" />
                        {c.experience_level || "Fresher"} 
                        {c.visa_status && <span className="mx-2">• {c.visa_status}</span>}
                    </div>
                    </div>
                </div>
                
                {/* Contact Details */}
                <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" /> {c.email}
                    </div>
                    {c.phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" /> {c.phone}
                        </div>
                    )}
                    {c.current_city && (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" /> {c.current_city}
                        </div>
                    )}
                </div>

                {/* Skills & Status */}
                <div className="flex items-center gap-4">
                    <div className="flex flex-wrap gap-2 max-w-xs justify-end">
                        {c.primary_skills ? (
                            c.primary_skills.split(',').slice(0, 3).map((skill, i) => (
                                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs text-gray-400">No skills listed</span>
                        )}
                    </div>
                    <button className="text-blue-600 font-medium text-sm hover:underline">
                        View Profile
                    </button>
                </div>

                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default MyCandidates;