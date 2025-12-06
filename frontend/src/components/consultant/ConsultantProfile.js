import React, { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Calendar, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

const ConsultantProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        tech_stack: '',
        experience_years: '',
        available: true,
        location: '',
        visa_status: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/consultants/me');
            console.log('Profile data:', response.data);
            setProfile(response.data);
            setFormData({
                tech_stack: response.data.tech_stack?.join(', ') || '',
                experience_years: response.data.experience_years || '',
                available: response.data.available !== undefined ? response.data.available : true,
                location: response.data.location || '',
                visa_status: response.data.visa_status || '',
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
                tech_stack: formData.tech_stack.split(',').map(s => s.trim()).filter(s => s),
                experience_years: parseFloat(formData.experience_years) || 0,
                available: formData.available,
                location: formData.location || null,
                visa_status: formData.visa_status || null,
            };

            console.log('Submitting profile data:', data);
            await api.put('/consultants/me', data);
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
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const getAvailabilityBadge = () => {
        return formData.available ? 'success' : 'secondary';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">My Profile</h2>
                <p className="text-slate-600 mt-1">Manage your consultant profile information</p>
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
                                    style={{
                                        width: `${((formData.tech_stack ? 25 : 0) +
                                                (formData.experience_years ? 25 : 0) +
                                                (formData.location ? 25 : 0) +
                                                (formData.visa_status ? 25 : 0))
                                            }%`
                                    }}
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Fill in all fields to complete your profile
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
                            <div>
                                <Label htmlFor="tech_stack">
                                    Technical Skills <span className="text-red-500">*</span>
                                </Label>
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
                                    Enter your skills separated by commas
                                </p>
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

            {/* Skills Display */}
            {profile?.tech_stack && profile.tech_stack.length > 0 && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>My Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {profile.tech_stack.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Profile Tips */}
            {(!profile?.tech_stack || profile.tech_stack.length === 0) && (
                <Card className="mt-6 border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-blue-900 mb-1">Complete Your Profile</h3>
                                <p className="text-sm text-blue-700">
                                    Add your skills and experience to appear in recruiter searches and increase your chances of getting hired!
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