import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMe } from '../../api/auth';
import { getMyResumes, uploadResume, updateProfile, deleteResume } from '../../api/candidates';
import { 
  Upload, FileText, Mail, Trash2, 
  MapPin, CheckCircle, Download, Loader2, 
  Phone, Save, X, PenSquare, Briefcase, Globe 
} from 'lucide-react';

const Profile = () => {
  const queryClient = useQueryClient();
  const { data: user } = useQuery({ queryKey: ['me'], queryFn: getMe });
  const { data: resumes = [] } = useQuery({ queryKey: ['my-resumes'], queryFn: getMyResumes });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    current_city: "", 
    visa_status: "",
    experience_level: "",
    primary_skills: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        current_city: user.profile?.current_city || "", 
        visa_status: user.profile?.visa_status || "",
        experience_level: user.profile?.experience_level || "Fresher",
        primary_skills: user.profile?.primary_skills || ""
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: (data) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['me']);
      setIsEditing(false);
    },
    onError: (err) => alert("Failed to update: " + (err.response?.data?.detail || err.message))
  });

  const uploadResumeMutation = useMutation({
    mutationFn: ({ file }) => uploadResume(file, resumes.length === 0),
    onSuccess: () => queryClient.invalidateQueries(['my-resumes']),
    onError: (err) => alert(err.response?.data?.detail || "Upload failed")
  });

  const deleteResumeMutation = useMutation({
    mutationFn: (id) => deleteResume(id),
    onSuccess: () => queryClient.invalidateQueries(['my-resumes']),
    onError: (err) => alert("Failed to delete")
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) uploadResumeMutation.mutate({ file });
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your professional details and documents.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: Profile Details --- */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                
                {/* Avatar & Basic Info */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 mb-4">
                        {formData.first_name?.charAt(0) || "U"}
                    </div>
                    {!isEditing && (
                        <>
                            <h2 className="text-xl font-bold text-gray-900">{formData.first_name} {formData.last_name}</h2>
                            <p className="text-sm text-gray-500">{formData.current_city || "No Location Set"}</p>
                            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {formData.experience_level || "Fresher"}
                            </div>
                        </>
                    )}
                </div>

                <div className="space-y-4">
                    {/* First Name */}
                    {isEditing && (
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">First Name</label>
                            <input name="first_name" value={formData.first_name} onChange={handleInputChange} className="w-full mt-1 px-3 py-2 border rounded-md" />
                        </div>
                    )}
                    
                    {/* Last Name */}
                    {isEditing && (
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">Last Name</label>
                            <input name="last_name" value={formData.last_name} onChange={handleInputChange} className="w-full mt-1 px-3 py-2 border rounded-md" />
                        </div>
                    )}

                    {/* Email (Read Only) */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
                        <div className="flex items-center mt-1 text-gray-700 bg-gray-50 px-3 py-2 rounded-md">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {formData.email}
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
                        {isEditing ? (
                            <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full mt-1 px-3 py-2 border rounded-md" />
                        ) : (
                            <div className="flex items-center mt-1 text-gray-700">
                                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                {formData.phone || "N/A"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* --- MIDDLE COLUMN: Professional Details --- */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Professional Info Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Professional Details</h3>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                            <PenSquare className="w-4 h-4 mr-1" /> Edit
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Current City */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Current City</label>
                        {isEditing ? (
                            <input name="current_city" value={formData.current_city} onChange={handleInputChange} className="w-full mt-1 px-3 py-2 border rounded-md" />
                        ) : (
                            <div className="flex items-center mt-1 text-gray-700 bg-gray-50 px-3 py-2 rounded-md">
                                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                {formData.current_city || "Not specified"}
                            </div>
                        )}
                    </div>

                    {/* Visa Status */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Visa Status</label>
                        {isEditing ? (
                            <input name="visa_status" value={formData.visa_status} onChange={handleInputChange} placeholder="e.g. Citizen, H1B, GC" className="w-full mt-1 px-3 py-2 border rounded-md" />
                        ) : (
                            <div className="flex items-center mt-1 text-gray-700 bg-gray-50 px-3 py-2 rounded-md">
                                <Globe className="w-4 h-4 mr-2 text-gray-400" />
                                {formData.visa_status || "Not specified"}
                            </div>
                        )}
                    </div>

                    {/* Experience Level (Dropdown) */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Experience Level</label>
                        {isEditing ? (
                            <select name="experience_level" value={formData.experience_level} onChange={handleInputChange} className="w-full mt-1 px-3 py-2 border rounded-md bg-white">
                                <option value="Fresher">Fresher</option>
                                <option value="1-3 Years">1-3 Years</option>
                                <option value="3-5 Years">3-5 Years</option>
                                <option value="5+ Years">5+ Years</option>
                            </select>
                        ) : (
                            <div className="flex items-center mt-1 text-gray-700 bg-gray-50 px-3 py-2 rounded-md">
                                <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                                {formData.experience_level || "Fresher"}
                            </div>
                        )}
                    </div>

                    {/* Primary Skills */}
                    <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Primary Skills</label>
                        {isEditing ? (
                            <input name="primary_skills" value={formData.primary_skills} onChange={handleInputChange} placeholder="e.g. Python, React, AWS" className="w-full mt-1 px-3 py-2 border rounded-md" />
                        ) : (
                            <div className="mt-1 flex flex-wrap gap-2">
                                {formData.primary_skills ? (
                                    formData.primary_skills.split(',').map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                                            {skill.trim()}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-400 italic">No skills listed</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <div className="flex gap-3 mt-6 justify-end">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
                        <button onClick={handleSave} disabled={updateProfileMutation.isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                            {updateProfileMutation.isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            {/* Resume Section (Keep existing code) */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Resume Library</h3>
                    <div className="relative">
                        <input type="file" accept=".pdf,.docx" onChange={handleFileUpload} className="hidden" id="resume-upload" disabled={resumes.length >= 2} />
                        <label htmlFor="resume-upload" className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg cursor-pointer ${resumes.length >= 2 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                            <Upload className="w-4 h-4 mr-2" /> Upload New
                        </label>
                    </div>
                </div>

                <div className="space-y-3">
                    {resumes.map((resume) => (
                        <div key={resume.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-lg">
                            <div className="flex items-center">
                                <FileText className="w-8 h-8 text-red-500 mr-3" />
                                <div>
                                    <p className="font-medium text-gray-900">{resume.file_name}</p>
                                    {resume.is_primary && <span className="text-xs text-green-600 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Primary</span>}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <a href={resume.file_url} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-blue-600"><Download className="w-4 h-4" /></a>
                                <button onClick={() => { if(window.confirm("Delete resume?")) deleteResumeMutation.mutate(resume.id) }} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                    {resumes.length === 0 && <p className="text-gray-500 italic text-center py-4">No resumes uploaded.</p>}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;