import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import axios from 'axios';
import { format } from 'date-fns';

const ConsultantApplications = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/submissions/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubmissions(response.data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'SUBMITTED': return 'default';
            case 'UNDER_REVIEW': return 'info';
            case 'INTERVIEW': return 'warning';
            case 'OFFER': return 'success';
            case 'JOINED': return 'success';
            case 'REJECTED': return 'error';
            case 'WITHDRAWN': return 'secondary';
            default: return 'default';
        }
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
                <h2 className="text-2xl font-bold text-slate-900">My Applications</h2>
                <p className="text-slate-600 mt-1">{submissions.length} total applications</p>
            </div>

            {submissions.length === 0 ? (
                <Card className="p-12">
                    <div className="text-center">
                        <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No applications yet</h3>
                        <p className="text-slate-600">Start applying to open positions to see them here</p>
                    </div>
                </Card>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Job Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Submitted On
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Comments
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {submissions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FileText className="h-5 w-5 text-slate-400 mr-3" />
                                                <div className="text-sm font-medium text-slate-900">
                                                    {sub.jd_title || 'Unknown Job'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-slate-600">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                {format(new Date(sub.created_at), 'MMM dd, yyyy')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={getStatusVariant(sub.status)}>
                                                {sub.status.replace('_', ' ')}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-600 max-w-xs truncate">
                                                {sub.comments || '-'}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            {submissions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <Card className="p-4">
                        <div className="text-sm text-slate-600">Total Applications</div>
                        <div className="text-2xl font-bold text-slate-900 mt-1">{submissions.length}</div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-sm text-slate-600">Under Review</div>
                        <div className="text-2xl font-bold text-blue-600 mt-1">
                            {submissions.filter(s => s.status === 'UNDER_REVIEW').length}
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-sm text-slate-600">Interviews</div>
                        <div className="text-2xl font-bold text-yellow-600 mt-1">
                            {submissions.filter(s => s.status === 'INTERVIEW').length}
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-sm text-slate-600">Offers</div>
                        <div className="text-2xl font-bold text-green-600 mt-1">
                            {submissions.filter(s => s.status === 'OFFER' || s.status === 'JOINED').length}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ConsultantApplications;
