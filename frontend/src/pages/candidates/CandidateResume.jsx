// frontend/src/pages/candidates/CandidateResume.jsx
import React from 'react';
import { Upload, FileText, User, Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../contexts/AuthContext';

const CandidateResume = () => {
  const { user } = useAuth();

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Resume & Profile</h1>
        <p className="text-slate-500">Manage your professional details and CV.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card */}
        <Card className="border-none shadow-md">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-3xl font-bold text-slate-600 mb-4">
              {user?.name?.charAt(0) || "U"}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-slate-500 mb-6">{user?.email}</p>
            
            <div className="w-full space-y-4 text-left">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin className="w-4 h-4" /> San Francisco, CA
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Phone className="w-4 h-4" /> +1 (555) 000-0000
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Briefcase className="w-4 h-4" /> 5 Years Experience
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Resume Upload & Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Resume Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Current Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="bg-blue-50 p-4 rounded-full mb-4">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Click to upload or drag and drop</h3>
                <p className="text-sm text-slate-500 mt-1">PDF, DOCX up to 10MB</p>
              </div>
              
              {/* Mock Existing File */}
              <div className="mt-4 flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">John_Smith_Resume.pdf</p>
                    <p className="text-xs text-slate-500">Uploaded on Dec 5, 2025</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
            </CardContent>
          </Card>

          {/* Tech Stack Input */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Primary Skills</Label>
                  <Input placeholder="e.g. React, Python, AWS" className="mt-1" />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["React", "Node.js", "FastAPI", "MongoDB"].map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button className="bg-slate-900 text-white">Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper icon
const Briefcase = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);

export default CandidateResume;