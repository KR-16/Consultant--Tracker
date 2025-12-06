import React, { useState } from 'react';
import { Search, Filter, Plus, MoreHorizontal, Mail, Phone } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';

const Candidates = () => {
  // Mock Data
  const [candidates] = useState([
    { id: 1, name: "John Smith", role: "React Developer", email: "john@example.com", status: "Active" },
    { id: 2, name: "Sarah Johnson", role: "Python Engineer", email: "sarah@example.com", status: "On Project" },
    { id: 3, name: "Michael Chen", role: "Java Architect", email: "michael@example.com", status: "Active" },
  ]);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Consultants</h1>
          <p className="text-slate-500">Manage your consultant pool</p>
        </div>
        <Button className="bg-slate-900 text-white hover:bg-slate-800">
          <Plus className="w-4 h-4 mr-2" /> Add Consultant
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input placeholder="Search consultants..." className="pl-10 bg-white" />
        </div>
        <Button variant="outline" className="flex gap-2 text-slate-600">
          <Filter className="h-4 w-4" /> Filters
        </Button>
      </div>

      <div className="grid gap-4">
        {candidates.map((c) => (
          <Card key={c.id} className="hover:shadow-md transition-shadow border-slate-200">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{c.name}</h3>
                  <p className="text-sm text-slate-500">{c.role}</p>
                </div>
              </div>
              
              <div className="hidden md:flex gap-8 text-sm text-slate-500">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {c.email}</div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> +1 234 567 890</div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {c.status}
                </span>
                <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4 text-slate-400" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Candidates;