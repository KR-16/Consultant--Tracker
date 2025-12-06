import React, { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Calendar, Save, Loader2, CheckCircle2 } from 'lucide-react';
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
        skills: '',
        experience: '',
        availability: 'AVAILABLE',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/consultants/me');
            setProfile(response.data);
            setFormData({
                skills: response.data.skills?.join(', ') || '',
                experience: response.data.experience || '',
                availability: response.data.availability || 'AVAILABLE',
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
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
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
                experience: parseInt(formData.experience) || 0,
                availability: formData.availability,
            };

            await api.put('/consultants/me', data);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            fetchProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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
                            <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center text-2xl font-bold">
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
                                <span className="text-slate-600">{formData.experience || 0} years experience</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <Badge variant={formData.availability === 'AVAILABLE' ? 'success' : 'secondary'}>
                                    {formData.availability}
                                </Badge>
                            </div>
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
                            <div className={`p-3 rounded-lg mb-4 flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                                }`}>
                                {message.type === 'success' ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                    <User className="h-5 w-5" />
                                )}
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="skills">Skills (comma-separated)</Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="React, Node.js, Python, AWS"
                                    className="mt-2"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Enter your skills separated by commas
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="experience">Years of Experience</Label>
                                <Input
                                    id="experience"
                                    name="experience"
                                    type="number"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    placeholder="5"
                                    className="mt-2"
                                    min="0"
                                />
                            </div>

                            <div>
                                <Label htmlFor="availability">Availability</Label>
                                <select
                                    id="availability"
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleChange}
                                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
                                >
                                    <option value="AVAILABLE">Available</option>
                                    <option value="BUSY">Busy</option>
                                    <option value="NOT_AVAILABLE">Not Available</option>
                                </select>
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
            {profile?.skills && profile.skills.length > 0 && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>My Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-sm">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ConsultantProfile;