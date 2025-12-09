import React, { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Calendar, Save, Loader2, CheckCircle2, AlertCircle, Phone, Link2, FileText, Upload, Download, X, Plus, TrendingUp, Award, GraduationCap, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import api, { consultantAPI } from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import { validateResumeFile } from '../../config';

const ConsultantProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [newCertification, setNewCertification] = useState('');
    const [newSkill, setNewSkill] = useState('');
    const [newSkillProficiency, setNewSkillProficiency] = useState('Intermediate');
    const [resumeFile, setResumeFile] = useState(null);
    
    const [formData, setFormData] = useState({
        tech_stack: '',
        experience_years: '',
        available: true,
        location: '',
        visa_status: '',
        professional_summary: '',
        linkedin_url: '',
        github_url: '',
        portfolio_url: '',
        phone: '',
        education: {
            degree: '',
            university: '',
            graduation_year: ''
        },
        certifications: [],
        tech_stack_proficiency: {}
    });

    useEffect(() => {
        fetchProfile();
        fetchStats();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/consultants/me');
            console.log('Profile data:', response.data);
            setProfile(response.data);
            
            // Initialize form data with profile data
            const proficiency = response.data.tech_stack_proficiency || {};
            const skillsWithProficiency = (response.data.tech_stack || []).map(skill => ({
                skill,
                proficiency: proficiency[skill] || 'Intermediate'
            }));
            
            setFormData({
                tech_stack: response.data.tech_stack?.join(', ') || '',
                experience_years: response.data.experience_years || '',
                available: response.data.available !== undefined ? response.data.available : true,
                location: response.data.location || '',
                visa_status: response.data.visa_status || '',
                professional_summary: response.data.professional_summary || '',
                linkedin_url: response.data.linkedin_url || '',
                github_url: response.data.github_url || '',
                portfolio_url: response.data.portfolio_url || '',
                phone: response.data.phone || '',
                education: response.data.education || {
                    degree: '',
                    university: '',
                    graduation_year: ''
                },
                certifications: response.data.certifications || [],
                tech_stack_proficiency: proficiency
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage({ type: 'error', text: 'Failed to load profile' });
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await consultantAPI.getStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setStatsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Process tech stack and proficiency
            const skills = formData.tech_stack.split(',').map(s => s.trim()).filter(s => s);
            const proficiency = { ...formData.tech_stack_proficiency };
            
            // Ensure all skills have proficiency levels
            skills.forEach(skill => {
                if (!proficiency[skill]) {
                    proficiency[skill] = 'Intermediate';
                }
            });
            
            // Remove proficiency for skills that are no longer in the list
            Object.keys(proficiency).forEach(skill => {
                if (!skills.includes(skill)) {
                    delete proficiency[skill];
                }
            });

            const data = {
                tech_stack: skills,
                experience_years: parseFloat(formData.experience_years) || 0,
                available: formData.available,
                location: formData.location || null,
                visa_status: formData.visa_status || null,
                professional_summary: formData.professional_summary || null,
                linkedin_url: formData.linkedin_url || null,
                github_url: formData.github_url || null,
                portfolio_url: formData.portfolio_url || null,
                phone: formData.phone || null,
                education: (formData.education.degree || formData.education.university || formData.education.graduation_year) 
                    ? formData.education : null,
                certifications: formData.certifications.length > 0 ? formData.certifications : null,
                tech_stack_proficiency: Object.keys(proficiency).length > 0 ? proficiency : null
            };

            console.log('Submitting profile data:', data);
            await consultantAPI.updateProfile(data);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });

            // Refresh profile data
            await fetchProfile();

            // Clear success message after 3 seconds
            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.detail || 'Failed to update profile'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('education.')) {
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                education: {
                    ...formData.education,
                    [field]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    const handleAddCertification = () => {
        if (newCertification.trim()) {
            setFormData({
                ...formData,
                certifications: [...formData.certifications, newCertification.trim()]
            });
            setNewCertification('');
        }
    };

    const handleRemoveCertification = (index) => {
        setFormData({
            ...formData,
            certifications: formData.certifications.filter((_, i) => i !== index)
        });
    };

    const handleAddSkillWithProficiency = () => {
        if (newSkill.trim()) {
            const skill = newSkill.trim();
            const skills = formData.tech_stack ? formData.tech_stack.split(',').map(s => s.trim()).filter(s => s) : [];
            if (!skills.includes(skill)) {
                setFormData({
                    ...formData,
                    tech_stack: formData.tech_stack ? `${formData.tech_stack}, ${skill}` : skill,
                    tech_stack_proficiency: {
                        ...formData.tech_stack_proficiency,
                        [skill]: newSkillProficiency
                    }
                });
            }
            setNewSkill('');
            setNewSkillProficiency('Intermediate');
        }
    };

    const handleUpdateSkillProficiency = (skill, proficiency) => {
        setFormData({
            ...formData,
            tech_stack_proficiency: {
                ...formData.tech_stack_proficiency,
                [skill]: proficiency
            }
        });
    };

    const handleResumeUpload = async () => {
        if (!resumeFile) {
            setMessage({ type: 'error', text: 'Please select a file to upload' });
            return;
        }

        const validation = validateResumeFile(resumeFile);
        if (!validation.valid) {
            setMessage({ type: 'error', text: validation.error });
            return;
        }

        setUploadingResume(true);
        setMessage({ type: '', text: '' });

        try {
            await consultantAPI.uploadResume(resumeFile);
            setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
            setResumeFile(null);
            await fetchProfile();
            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 3000);
        } catch (error) {
            console.error('Error uploading resume:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.detail || 'Failed to upload resume'
            });
        } finally {
            setUploadingResume(false);
        }
    };

    const handleDownloadResume = async () => {
        try {
            const response = await consultantAPI.downloadResume();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `resume_${user?.name || 'consultant'}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading resume:', error);
            setMessage({
                type: 'error',
                text: 'Failed to download resume'
            });
        }
    };

    const getAvailabilityBadge = () => {
        return formData.available ? 'success' : 'secondary';
    };

    const getProficiencyColor = (proficiency) => {
        switch (proficiency) {
            case 'Expert': return 'bg-purple-100 text-purple-800';
            case 'Advanced': return 'bg-blue-100 text-blue-800';
            case 'Intermediate': return 'bg-green-100 text-green-800';
            case 'Beginner': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const calculateProfileCompleteness = () => {
        let score = 0;
        if (formData.tech_stack) score += 10;
        if (formData.experience_years) score += 10;
        if (formData.location) score += 5;
        if (formData.visa_status) score += 5;
        if (formData.professional_summary) score += 10;
        if (formData.linkedin_url || formData.github_url || formData.portfolio_url) score += 10;
        if (formData.education.degree || formData.education.university) score += 10;
        if (formData.certifications.length > 0) score += 5;
        if (formData.phone) score += 5;
        if (profile?.resume_path) score += 10;
        if (Object.keys(formData.tech_stack_proficiency).length > 0) {
            const skills = formData.tech_stack.split(',').map(s => s.trim()).filter(s => s);
            const allHaveProficiency = skills.every(s => formData.tech_stack_proficiency[s]);
            if (allHaveProficiency && skills.length > 0) score += 10;
        }
        return Math.min(score, 100);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
            </div>
        );
    }

    const completeness = calculateProfileCompleteness();

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">My Profile</h2>
                <p className="text-slate-600 mt-1">Manage your consultant profile information</p>
            </div>

            {/* Application Statistics */}
            {!statsLoading && stats && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Application Statistics
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-slate-900">{stats.total || 0}</div>
                                <div className="text-xs text-slate-600">Total</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{stats.pending || 0}</div>
                                <div className="text-xs text-slate-600">Pending</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-600">{stats.interviews || 0}</div>
                                <div className="text-xs text-slate-600">Interviews</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{stats.offers || 0}</div>
                                <div className="text-xs text-slate-600">Offers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-emerald-600">{stats.joined || 0}</div>
                                <div className="text-xs text-slate-600">Joined</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">{stats.rejected || 0}</div>
                                <div className="text-xs text-slate-600">Rejected</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{stats.success_rate?.toFixed(1) || 0}%</div>
                                <div className="text-xs text-slate-600">Success Rate</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-900 to-slate-700 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                                <div className="font-medium text-slate-900">{user?.name}</div>
                                <div className="text-sm text-slate-600">{user?.role}</div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t">
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-600">{user?.email}</span>
                            </div>
                            {formData.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-slate-400" />
                                    <span className="text-slate-600">{formData.phone}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-sm">
                                <Briefcase className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-600">
                                    {formData.experience_years || 0} years experience
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <Badge variant={getAvailabilityBadge()}>
                                    {formData.available ? 'Available' : 'Not Available'}
                                </Badge>
                            </div>
                        </div>

                        {/* Profile Completeness */}
                        <div className="pt-4 border-t">
                            <div className="text-sm text-slate-600 mb-2">Profile Completeness</div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                    className="bg-slate-900 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${completeness}%` }}
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                {completeness}% Complete
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Edit Profile Form */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Edit Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {message.text && (
                            <div className={`p-3 rounded-lg mb-4 flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                                }`}>
                                {message.type === 'success' ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                    <AlertCircle className="h-5 w-5" />
                                )}
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Professional Summary */}
                            <div>
                                <Label htmlFor="professional_summary">Professional Summary</Label>
                                <textarea
                                    id="professional_summary"
                                    name="professional_summary"
                                    value={formData.professional_summary}
                                    onChange={handleChange}
                                    placeholder="Tell recruiters about yourself, your experience, and what you're looking for..."
                                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 min-h-[100px]"
                                    maxLength={2000}
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    {formData.professional_summary.length}/2000 characters
                                </p>
                            </div>

                            {/* Contact Links */}
                            <div>
                                <Label className="flex items-center gap-2 mb-3">
                                    <Link2 className="h-4 w-4" />
                                    Contact Links
                                </Label>
                                <div className="space-y-3">
                                    <div>
                                        <Input
                                            id="linkedin_url"
                                            name="linkedin_url"
                                            type="url"
                                            value={formData.linkedin_url}
                                            onChange={handleChange}
                                            placeholder="https://linkedin.com/in/yourprofile"
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            id="github_url"
                                            name="github_url"
                                            type="url"
                                            value={formData.github_url}
                                            onChange={handleChange}
                                            placeholder="https://github.com/yourusername"
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            id="portfolio_url"
                                            name="portfolio_url"
                                            type="url"
                                            value={formData.portfolio_url}
                                            onChange={handleChange}
                                            placeholder="https://yourportfolio.com"
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div>
                                <Label htmlFor="phone" className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    Phone Number
                                </Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 123-4567"
                                    className="mt-2"
                                />
                            </div>

                            {/* Education */}
                            <div>
                                <Label className="flex items-center gap-2 mb-3">
                                    <GraduationCap className="h-4 w-4" />
                                    Education
                                </Label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <select
                                            id="education.degree"
                                            name="education.degree"
                                            value={formData.education.degree}
                                            onChange={handleChange}
                                            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
                                        >
                                            <option value="">Degree</option>
                                            <option value="High School">High School</option>
                                            <option value="Associate's">Associate's</option>
                                            <option value="Bachelor's">Bachelor's</option>
                                            <option value="Master's">Master's</option>
                                            <option value="PhD">PhD</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Input
                                            id="education.university"
                                            name="education.university"
                                            value={formData.education.university}
                                            onChange={handleChange}
                                            placeholder="University Name"
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            id="education.graduation_year"
                                            name="education.graduation_year"
                                            type="number"
                                            value={formData.education.graduation_year}
                                            onChange={handleChange}
                                            placeholder="Year"
                                            min="1950"
                                            max="2030"
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Certifications */}
                            <div>
                                <Label className="flex items-center gap-2 mb-3">
                                    <Award className="h-4 w-4" />
                                    Certifications
                                </Label>
                                <div className="flex gap-2 mb-3">
                                    <Input
                                        value={newCertification}
                                        onChange={(e) => setNewCertification(e.target.value)}
                                        placeholder="Add certification"
                                        className="flex-1"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddCertification();
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAddCertification}
                                        variant="outline"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {formData.certifications.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.certifications.map((cert, index) => (
                                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                {cert}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveCertification(index)}
                                                    className="ml-1 hover:text-red-600"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Skills with Proficiency */}
                            <div>
                                <Label htmlFor="tech_stack">
                                    Technical Skills <span className="text-red-500">*</span>
                                </Label>
                                <div className="flex gap-2 mb-3">
                                    <Input
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        placeholder="Add skill"
                                        className="flex-1"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddSkillWithProficiency();
                                            }
                                        }}
                                    />
                                    <select
                                        value={newSkillProficiency}
                                        onChange={(e) => setNewSkillProficiency(e.target.value)}
                                        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Expert">Expert</option>
                                    </select>
                                    <Button
                                        type="button"
                                        onClick={handleAddSkillWithProficiency}
                                        variant="outline"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Input
                                    id="tech_stack"
                                    name="tech_stack"
                                    value={formData.tech_stack}
                                    onChange={handleChange}
                                    placeholder="React, Node.js, Python, AWS, Docker"
                                    className="mt-2"
                                    required
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Enter your skills separated by commas, or use the add button above
                                </p>
                                {formData.tech_stack && formData.tech_stack.split(',').filter(s => s.trim()).length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        <Label className="text-xs text-slate-600">Skill Proficiency Levels</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.tech_stack.split(',').map(skill => {
                                                const trimmedSkill = skill.trim();
                                                if (!trimmedSkill) return null;
                                                const proficiency = formData.tech_stack_proficiency[trimmedSkill] || 'Intermediate';
                                                return (
                                                    <div key={trimmedSkill} className="flex items-center gap-2">
                                                        <Badge variant="secondary">{trimmedSkill}</Badge>
                                                        <select
                                                            value={proficiency}
                                                            onChange={(e) => handleUpdateSkillProficiency(trimmedSkill, e.target.value)}
                                                            className="text-xs rounded border border-slate-300 px-2 py-1"
                                                        >
                                                            <option value="Beginner">Beginner</option>
                                                            <option value="Intermediate">Intermediate</option>
                                                            <option value="Advanced">Advanced</option>
                                                            <option value="Expert">Expert</option>
                                                        </select>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="experience_years">
                                        Years of Experience <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="experience_years"
                                        name="experience_years"
                                        type="number"
                                        step="0.5"
                                        value={formData.experience_years}
                                        onChange={handleChange}
                                        placeholder="5"
                                        className="mt-2"
                                        min="0"
                                        max="50"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="New York, NY"
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="visa_status">Visa Status</Label>
                                <select
                                    id="visa_status"
                                    name="visa_status"
                                    value={formData.visa_status}
                                    onChange={handleChange}
                                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
                                >
                                    <option value="">Select Visa Status</option>
                                    <option value="US Citizen">US Citizen</option>
                                    <option value="Green Card">Green Card</option>
                                    <option value="H1B">H1B</option>
                                    <option value="OPT">OPT</option>
                                    <option value="CPT">CPT</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Resume Upload */}
                            <div>
                                <Label className="flex items-center gap-2 mb-3">
                                    <FileText className="h-4 w-4" />
                                    Resume
                                </Label>
                                {profile?.resume_path ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                                            <FileText className="h-5 w-5 text-slate-600" />
                                            <span className="text-sm text-slate-700 flex-1">
                                                Resume uploaded: {profile.resume_path.split('/').pop()}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleDownloadResume}
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 mb-2">No resume uploaded</p>
                                )}
                                <div className="flex gap-2">
                                    <Input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => setResumeFile(e.target.files[0])}
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleResumeUpload}
                                        disabled={!resumeFile || uploadingResume}
                                        variant="outline"
                                    >
                                        {uploadingResume ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload
                                            </>
                                        )}
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    PDF, DOC, or DOCX files only. Max 10MB.
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="available"
                                    name="available"
                                    checked={formData.available}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-950"
                                />
                                <Label htmlFor="available" className="cursor-pointer">
                                    I am currently available for new opportunities
                                </Label>
                            </div>

                            <Button type="submit" disabled={saving} className="w-full">
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Profile
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Skills Display with Proficiency */}
            {profile?.tech_stack && profile.tech_stack.length > 0 && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>My Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {profile.tech_stack.map((skill, index) => {
                                const proficiency = profile.tech_stack_proficiency?.[skill] || 'Intermediate';
                                return (
                                    <div key={index} className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-sm px-3 py-1">
                                            {skill}
                                        </Badge>
                                        <Badge className={`text-xs px-2 py-0.5 ${getProficiencyColor(proficiency)}`}>
                                            {proficiency}
                                        </Badge>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Profile Tips */}
            {completeness < 50 && (
                <Card className="mt-6 border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-blue-900 mb-1">Complete Your Profile</h3>
                                <p className="text-sm text-blue-700">
                                    Add your skills, experience, education, and contact information to appear in recruiter searches and increase your chances of getting hired!
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ConsultantProfile;
