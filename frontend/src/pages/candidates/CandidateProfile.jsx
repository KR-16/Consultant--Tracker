import React, { useState } from 'react';
import { 
  Upload, FileText, User, Mail, Trash2, 
  MapPin, CheckCircle, AlertCircle, Download, Loader2 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/use-toast';

const CandidateProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // State for resumes (Mock data usually fetched from API)
  const [resumes, setResumes] = useState([
    { id: 1, name: "John_Dev_Resume.pdf", size: "1.2 MB", date: "2024-01-15" }
  ]);
  const [isUploading, setIsUploading] = useState(false);

  // Handle File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation 1: Max 2 resumes
    if (resumes.length >= 2) {
      toast({
        variant: "destructive",
        title: "Limit Reached",
        description: "You can only store a maximum of 2 resumes.",
      });
      return;
    }

    // Validation 2: File Type
    if (file.type !== "application/pdf") {
      toast({
        variant: "destructive",
        title: "Invalid File",
        description: "Only PDF files are allowed.",
      });
      return;
    }

    // Simulate Upload API Call
    setIsUploading(true);
    setTimeout(() => {
      const newResume = {
        id: Date.now(),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        date: new Date().toISOString().split('T')[0]
      };
      
      setResumes([...resumes, newResume]);
      setIsUploading(false);
      toast({
        title: "Success",
        description: "Resume uploaded successfully.",
        className: "bg-green-50 border-green-200"
      });
    }, 1500);
  };

  // Handle Delete
  const handleDelete = (id) => {
    setResumes(resumes.filter(r => r.id !== id));
    toast({
      title: "Deleted",
      description: "Resume removed from your profile.",
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your personal information and documents.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: Personal Info --- */}
        <Card className="h-fit border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-8 flex flex-col items-center text-center">
            
            {/* Avatar / Initials */}
            <div className="w-28 h-28 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-4xl font-bold text-slate-600 dark:text-slate-300 mb-6 border-4 border-white dark:border-slate-700 shadow-sm">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name || "Candidate Name"}</h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              <CheckCircle className="w-3 h-3" /> Verified Candidate
            </div>

            <div className="w-full mt-8 space-y-4 text-left border-t border-slate-100 dark:border-slate-800 pt-6">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm">{user?.email || "email@example.com"}</span>
              </div>
              
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm">Remote / United States</span>
              </div>

              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm capitalize">{user?.role?.toLowerCase() || "Candidate"}</span>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-8 border-slate-200 dark:border-slate-700">
              Edit Profile Details
            </Button>
          </CardContent>
        </Card>

        {/* --- RIGHT COLUMN: Resume Manager --- */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Resume Library</CardTitle>
                  <CardDescription>Manage your CVs. You can upload up to 2 versions.</CardDescription>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  resumes.length >= 2 
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" 
                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                }`}>
                  {resumes.length} / 2 Used
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Upload Area - Only show if limit not reached */}
              {resumes.length < 2 ? (
                <div className="relative group">
                  <input 
                    type="file" 
                    accept=".pdf"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                  />
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition-all">
                    {isUploading ? (
                      <div className="flex flex-col items-center animate-pulse">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                        <p className="font-medium text-slate-900 dark:text-white">Uploading...</p>
                      </div>
                    ) : (
                      <>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white">Upload a new Resume</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">PDF files only, up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-lg flex items-center gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  Maximum resume limit reached. Delete an existing file to upload a new one.
                </div>
              )}

              {/* Resume List */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Your Documents</h4>
                
                {resumes.length === 0 && (
                   <p className="text-slate-400 italic text-sm">No resumes uploaded yet.</p>
                )}

                {resumes.map((resume) => (
                  <div key={resume.id} className="group flex items-center justify-between p-4 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{resume.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex gap-2">
                          <span>{resume.size}</span>
                          <span>•</span>
                          <span>Uploaded {resume.date}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(resume.id)}
                        className="text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;