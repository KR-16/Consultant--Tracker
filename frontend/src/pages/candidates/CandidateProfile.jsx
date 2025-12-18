import React, { useState, useEffect } from 'react';
import { 
  Upload, FileText, Mail, Trash2, 
  MapPin, CheckCircle, AlertCircle, Download, Loader2, 
  Phone, Save, X, PenSquare 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/use-toast';

const CandidateProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // --- 1. Profile Edit State ---
  const [isEditing, setIsEditing] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "Remote / United States",
    phone: "+1 (555) 012-3456",
    role: ""
  });

  
  const [originalData, setOriginalData] = useState(null);

 
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        role: user.role || "Candidate"
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStartEdit = () => {
    setOriginalData({ ...formData });
    setIsEditing(true);
  };


  const handleCancelEdit = () => {
    setFormData(originalData); 
    setIsEditing(false);
  };

  const handleSaveProfile = () => {
    setLoadingSave(true);
    // Simulate API Call
    setTimeout(() => {
      setLoadingSave(false);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your personal details have been saved.",
        className: "bg-green-50 border-green-200"
      });
    }, 1000);
  };

  // --- 2. Resume Logic (Existing) ---
  const [resumes, setResumes] = useState([
    { id: 1, name: "John_Dev_Resume.pdf", size: "1.2 MB", date: "2024-01-15" }
  ]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (resumes.length >= 2) {
      toast({ variant: "destructive", title: "Limit Reached", description: "Max 2 resumes allowed." });
      return;
    }
    if (file.type !== "application/pdf") {
      toast({ variant: "destructive", title: "Invalid File", description: "Only PDF files allowed." });
      return;
    }

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
      toast({ title: "Success", description: "Resume uploaded successfully.", className: "bg-green-50 border-green-200" });
    }, 1500);
  };

  const handleDelete = (id) => {
    setResumes(resumes.filter(r => r.id !== id));
    toast({ title: "Deleted", description: "Resume removed." });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your personal information and documents.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: Personal Info (Editable) --- */}
        <Card className="h-fit border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-8">
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-28 h-28 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-4xl font-bold text-slate-600 dark:text-slate-300 mb-4 border-4 border-white dark:border-slate-700 shadow-sm relative group">
                {formData.name.charAt(0).toUpperCase() || "U"}
              </div>
              
              {!isEditing && (
                <>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{formData.name}</h2>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                    <CheckCircle className="w-3 h-3" /> Verified Candidate
                  </div>
                </>
              )}
            </div>

            {/* Editable Fields */}
            <div className="space-y-4">
              
              {/* Name Field */}
              {isEditing && (
                <div className="space-y-2 text-left">
                  <Label>Full Name</Label>
                  <Input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    className="bg-white dark:bg-slate-950"
                  />
                </div>
              )}

              {/* Email Field (Read-only) */}
              <div className={isEditing ? "space-y-2 text-left" : "flex items-center gap-3 text-slate-600 dark:text-slate-400"}>
                {isEditing ? (
                  <>
                    <Label>Email Address</Label>
                    <Input 
                      name="email" 
                      value={formData.email} 
                      disabled 
                      className="bg-slate-100 dark:bg-slate-800 cursor-not-allowed opacity-70"
                    />
                  </>
                ) : (
                  <>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-sm truncate">{formData.email}</span>
                  </>
                )}
              </div>
              
              {/* Location Field */}
              <div className={isEditing ? "space-y-2 text-left" : "flex items-center gap-3 text-slate-600 dark:text-slate-400"}>
                {isEditing ? (
                  <>
                    <Label>Location</Label>
                    <Input 
                      name="location" 
                      value={formData.location} 
                      onChange={handleInputChange}
                      className="bg-white dark:bg-slate-950"
                    />
                  </>
                ) : (
                  <>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{formData.location}</span>
                  </>
                )}
              </div>

              {/* Phone Field */}
              <div className={isEditing ? "space-y-2 text-left" : "flex items-center gap-3 text-slate-600 dark:text-slate-400"}>
                {isEditing ? (
                  <>
                    <Label>Phone Number</Label>
                    <Input 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange}
                      className="bg-white dark:bg-slate-950"
                    />
                  </>
                ) : (
                  <>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{formData.phone}</span>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              {isEditing ? (
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={loadingSave}
                    className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                  >
                    {loadingSave ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancelEdit} 
                    disabled={loadingSave}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={handleStartEdit} 
                  className="w-full border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <PenSquare className="w-4 h-4 mr-2" />
                  Edit Profile Details
                </Button>
              )}
            </div>

          </CardContent>
        </Card>

        {/* --- RIGHT COLUMN: Resume Manager--- */}
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
              
              {/* Upload Area */}
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
                
                {resumes.length === 0 && <p className="text-slate-400 italic text-sm">No resumes uploaded yet.</p>}

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