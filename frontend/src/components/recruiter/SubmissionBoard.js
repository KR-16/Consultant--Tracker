import React, { useState, useEffect } from 'react';
import { Calendar, User, FileText, Download, MoreVertical, Loader2, ClipboardList } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import axios from 'axios';
import { format } from 'date-fns';

const SubmissionBoard = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(null);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/submissions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubmissions(response.data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (submissionId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/submissions/${submissionId}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchSubmissions();
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setMenuOpen(null);
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
            case 'ON_HOLD': return 'secondary';
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
                <h2 className="text-2xl font-bold text-slate-900">Submissions</h2>
                <p className="text-slate-600 mt-1">{submissions.length} total submissions</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <Card className="p-4">
                    <div className="text-sm text-slate-600">Total</div>
                    <div className="text-2xl font-bold text-slate-900 mt-1">{submissions.length}</div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-slate-600">Submitted</div>
                    <div className="text-2xl font-bold text-blue-600 mt-1">
                        {submissions.filter(s => s.status === 'SUBMITTED').length}
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-slate-600">Interview</div>
                    <div className="text-2xl font-bold text-yellow-600 mt-1">
                        {submissions.filter(s => s.status === 'INTERVIEW').length}
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-slate-600">Offers</div>
                    <div className="text-2xl font-bold text-green-600 mt-1">
                        {submissions.filter(s => s.status === 'OFFER').length}
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-slate-600">Joined</div>
                    <div className="text-2xl font-bold text-emerald-600 mt-1">
                        {submissions.filter(s => s.status === 'JOINED').length}
                    </div>
                </Card>
            </div>

            {/* Submissions Table */}
            {submissions.length === 0 ? (
                <Card className="p-12">
                    <div className="text-center">
                        <ClipboardList className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No submissions yet</h3>
                        <p className="text-slate-600">Submissions will appear here when consultants apply to jobs</p>
                    </div>
                </Card>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Consultant
                                    </th>
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
                                        Resume
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {submissions.map((sub) => (
                                    <tr
                                        key={sub.id}
                                        className={`hover:bg-slate-50 transition-colors ${!sub.recruiter_read ? 'bg-blue-50/30' : ''}`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <User className="h-5 w-5 text-slate-400 mr-3" />
                                                <div className="text-sm font-medium text-slate-900">
                                                    {sub.consultant_name || 'Unknown'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FileText className="h-5 w-5 text-slate-400 mr-3" />
                                                <div className="text-sm text-slate-900">
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
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    alert(`Resume path: ${sub.resume_path}\n(File download not implemented in this demo)`);
                                                }}
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                View
                                            </Button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    onClick={() => setMenuOpen(menuOpen === sub.id ? null : sub.id)}
                                                    className="px-3 py-2 hover:bg-slate-100 rounded-md"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    open={menuOpen === sub.id}
                                                    onClose={() => setMenuOpen(null)}
                                                >
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(sub.id, 'UNDER_REVIEW')}>
                                                        Under Review
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(sub.id, 'INTERVIEW')}>
                                                        Move to Interview
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(sub.id, 'OFFER')}>
                                                        Make Offer
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(sub.id, 'JOINED')}>
                                                        Joined
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(sub.id, 'ON_HOLD')}>
                                                        On Hold
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(sub.id, 'REJECTED')}>
                                                        Reject
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmissionBoard;
