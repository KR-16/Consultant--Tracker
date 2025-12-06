import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Loader2, AlertCircle, TrendingUp, Clock, CheckCircle, XCircle, Search } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import axios from 'axios';
import { format } from 'date-fns';

const ConsultantApplications = () => {
    const [submissions, setSubmissions] = useState([]);
    const [filteredSubmissions, setFilteredSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchSubmissions();
    }, []);

    useEffect(() => {
        filterSubmissions();
    }, [submissions, searchTerm, statusFilter]);

    const fetchSubmissions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/submissions/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Sort by most recent first
            const sorted = response.data.sort((a, b) =>
                new Date(b.created_at) - new Date(a.created_at)
            );
            setSubmissions(sorted);
            setFilteredSubmissions(sorted);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterSubmissions = () => {
        let filtered = [...submissions];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(sub =>
                (sub.jd_title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (sub.comments || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(sub => sub.status === statusFilter);
        }

        setFilteredSubmissions(filtered);
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'SUBMITTED': return 'default';
            case 'INTERVIEW': return 'warning';
            case 'OFFER': return 'success';
            case 'JOINED': return 'success';
            case 'REJECTED': return 'error';
            case 'ON_HOLD': return 'secondary';
            case 'WITHDRAWN': return 'secondary';
            default: return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'SUBMITTED': return Clock;
            case 'INTERVIEW': return Calendar;
            case 'OFFER':
            case 'JOINED': return CheckCircle;
            case 'REJECTED':
            case 'WITHDRAWN': return XCircle;
            case 'ON_HOLD': return TrendingUp;
            default: return FileText;
        }
    };

    const getStatusCount = (status) => {
        return submissions.filter(s => s.status === status).length;
    };

    const getStatusMessage = (status) => {
        const messages = {
            'SUBMITTED': 'Your application has been submitted and is pending review.',
            'INTERVIEW': 'Congratulations! You have been selected for an interview.',
            'OFFER': 'Great news! You have received a job offer.',
            'JOINED': 'Welcome aboard! You have successfully joined the company.',
            'REJECTED': 'Unfortunately, your application was not selected this time.',
            'WITHDRAWN': 'This application has been withdrawn.',
            'ON_HOLD': 'Your application is currently on hold.',
        };
        return messages[status] || 'Status unknown';
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
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">My Applications</h2>
                <p className="text-slate-600 mt-1">{submissions.length} total applications</p>
            </div>

            {/* Summary Cards */}
            {submissions.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <Card className="p-4 hover:shadow-md transition-shadow">
                        <div className="text-xs text-slate-600 mb-1">Total</div>
                        <div className="text-2xl font-bold text-slate-900">{submissions.length}</div>
                    </Card>
                    <Card className="p-4 hover:shadow-md transition-shadow">
                        <div className="text-xs text-slate-600 mb-1">Pending</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {getStatusCount('SUBMITTED') + getStatusCount('ON_HOLD')}
                        </div>
                    </Card>
                    <Card className="p-4 hover:shadow-md transition-shadow">
                        <div className="text-xs text-slate-600 mb-1">Interviews</div>
                        <div className="text-2xl font-bold text-yellow-600">
                            {getStatusCount('INTERVIEW')}
                        </div>
                    </Card>
                    <Card className="p-4 hover:shadow-md transition-shadow">
                        <div className="text-xs text-slate-600 mb-1">Offers</div>
                        <div className="text-2xl font-bold text-green-600">
                            {getStatusCount('OFFER')}
                        </div>
                    </Card>
                    <Card className="p-4 hover:shadow-md transition-shadow">
                        <div className="text-xs text-slate-600 mb-1">Joined</div>
                        <div className="text-2xl font-bold text-emerald-600">
                            {getStatusCount('JOINED')}
                        </div>
                    </Card>
                </div>
            )}

            {/* Search and Filter */}
            {submissions.length > 0 && (
                <Card className="mb-6">
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search by job title or comments..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
                            >
                                <option value="all">All Statuses</option>
                                <option value="SUBMITTED">Submitted</option>
                                <option value="INTERVIEW">Interview</option>
                                <option value="OFFER">Offer</option>
                                <option value="JOINED">Joined</option>
                                <option value="ON_HOLD">On Hold</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="WITHDRAWN">Withdrawn</option>
                            </select>
                        </div>
                    </div>
                </Card>
            )}

            {/* Applications List */}
            {filteredSubmissions.length === 0 ? (
                <Card className="p-12">
                    <div className="text-center">
                        <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">
                            {submissions.length === 0 ? 'No applications yet' : 'No matching applications'}
                        </h3>
                        <p className="text-slate-600">
                            {submissions.length === 0
                                ? 'Start applying to open positions to see them here'
                                : 'Try adjusting your search or filters'}
                        </p>
                        {(searchTerm || statusFilter !== 'all') && (
                            <Button
                                variant="outline"
                                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                                className="mt-4"
                            >
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredSubmissions.map((sub) => {
                        const StatusIcon = getStatusIcon(sub.status);
                        return (
                            <Card key={sub.id} className="hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <FileText className="h-5 w-5 text-slate-400" />
                                                <h3 className="text-lg font-semibold text-slate-900">
                                                    {sub.jd_title || 'Unknown Job'}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-600">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    Applied {format(new Date(sub.created_at), 'MMM dd, yyyy')}
                                                </span>
                                                {sub.updated_at && sub.updated_at !== sub.created_at && (
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        Updated {format(new Date(sub.updated_at), 'MMM dd, yyyy')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <StatusIcon className="h-5 w-5 text-slate-400" />
                                            <Badge variant={getStatusVariant(sub.status)}>
                                                {sub.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Status Message */}
                                    <div className={`p-3 rounded-lg mb-3 ${sub.status === 'OFFER' || sub.status === 'JOINED' ? 'bg-green-50 border border-green-200' :
                                            sub.status === 'INTERVIEW' ? 'bg-yellow-50 border border-yellow-200' :
                                                sub.status === 'REJECTED' ? 'bg-red-50 border border-red-200' :
                                                    'bg-blue-50 border border-blue-200'
                                        }`}>
                                        <p className={`text-sm ${sub.status === 'OFFER' || sub.status === 'JOINED' ? 'text-green-800' :
                                                sub.status === 'INTERVIEW' ? 'text-yellow-800' :
                                                    sub.status === 'REJECTED' ? 'text-red-800' :
                                                        'text-blue-800'
                                            }`}>
                                            {getStatusMessage(sub.status)}
                                        </p>
                                    </div>

                                    {/* Comments */}
                                    {sub.comments && (
                                        <div className="bg-slate-50 rounded-lg p-3">
                                            <p className="text-sm text-slate-600 font-medium mb-1">Your Comments:</p>
                                            <p className="text-sm text-slate-700">{sub.comments}</p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Tips for No Applications */}
            {submissions.length === 0 && (
                <Card className="mt-6 border-blue-200 bg-blue-50">
                    <div className="p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-blue-900 mb-1">Start Your Job Search</h3>
                                <p className="text-sm text-blue-700 mb-3">
                                    Browse open positions and submit your applications to start your journey!
                                </p>
                                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                                    <li>Make sure your profile is complete</li>
                                    <li>Upload an updated resume</li>
                                    <li>Write a compelling cover letter</li>
                                    <li>Apply to positions that match your skills</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ConsultantApplications;
