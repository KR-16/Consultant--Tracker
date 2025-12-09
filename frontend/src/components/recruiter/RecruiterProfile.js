import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building2, MapPin, Link2, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import api, { recruiterAPI } from '../../api';
import { useAuth } from '../../contexts/AuthContext';

const RecruiterProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        company_name: '',
        phone: '',
        linkedin_url: '',
        bio: '',
        location: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await recruiterAPI.getProfile();
            console.log('Profile data:', response.data);
            setProfile(response.data);
            setFormData({
                company_name: response.data.company_name || '',
                phone: response.data.phone || '',
                linkedin_url: response.data.linkedin_url || '',
                bio: response.data.bio || '',
                location: response.data.location || '',
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage({ type: 'error', text: 'Failed to load profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const data = {
                company_name: formData.company_name || null,
                phone: formData.phone || null,
                linkedin_url: formData.linkedin_url || null,
                bio: formData.bio || null,
                location: formData.location || null,
            };

            console.log('Submitting profile data:', data);
            await recruiterAPI.updateProfile(data);
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
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const calculateProfileCompleteness = () => {
        let score = 0;
        if (formData.company_name) score += 25;
        if (formData.phone) score += 20;
        if (formData.linkedin_url) score += 15;
        if (formData.bio) score += 20;
        if (formData.location) score += 20;
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
                <p className="text-slate-600 mt-1">Manage your recruiter profile information</p>
            </div>

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
                            {formData.company_name && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Building2 className="h-4 w-4 text-slate-400" />
                                    <span className="text-slate-600">{formData.company_name}</span>
                                </div>
                            )}
                            {formData.location && (
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                    <span className="text-slate-600">{formData.location}</span>
                                </div>
                            )}
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
                            {/* Company Name */}
                            <div>
                                <Label htmlFor="company_name" className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    Company/Organization Name
                                </Label>
                                <Input
                                    id="company_name"
                                    name="company_name"
                                    value={formData.company_name}
                                    onChange={handleChange}
                                    placeholder="Your Company Name"
                                    className="mt-2"
                                />
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

                            {/* Location */}
                            <div>
                                <Label htmlFor="location" className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Location
                                </Label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="City, State or Country"
                                    className="mt-2"
                                />
                            </div>

                            {/* LinkedIn URL */}
                            <div>
                                <Label htmlFor="linkedin_url" className="flex items-center gap-2">
                                    <Link2 className="h-4 w-4" />
                                    LinkedIn Profile
                                </Label>
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

                            {/* Bio */}
                            <div>
                                <Label htmlFor="bio">Bio/About</Label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell consultants about yourself, your company, and what you're looking for..."
                                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 min-h-[120px]"
                                    maxLength={1000}
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    {formData.bio.length}/1000 characters
                                </p>
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

            {/* Profile Tips */}
            {completeness < 50 && (
                <Card className="mt-6 border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-blue-900 mb-1">Complete Your Profile</h3>
                                <p className="text-sm text-blue-700">
                                    Add your company information, contact details, and bio to help consultants learn more about you and your organization!
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default RecruiterProfile;

