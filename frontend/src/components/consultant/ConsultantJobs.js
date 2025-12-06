import React, { useState, useEffect } from 'react';
import { MapPin, Briefcase, Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import api, { jobAPI } from '../../api';

const ConsultantJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applyDialogOpen, setApplyDialogOpen] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [comments, setComments] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [mySubmissions, setMySubmissions] = useState([]);

    useEffect(() => {
        fetchJobs();
        fetchMySubmissions();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await jobAPI.getAll();
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMySubmissions = async () => {
        try {
            const response = await api.get('/submissions/me');
            setMySubmissions(response.data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        }
    };

    const hasApplied = (jobId) => {
        return mySubmissions.some(sub => sub.jd_id === jobId);
    };

    const handleApplyClick = (job) => {
        setSelectedJob(job);
        setApplyDialogOpen(true);
        setMessage({ type: '', text: '' });
        setResumeFile(null);
        setComments('');
    };

    const handleFileChange = (e) => {
        setResumeFile(e.target.files[0]);
    };

    const handleApplySubmit = async () => {
        if (!resumeFile) {
            setMessage({ type: 'error', text: 'Please upload a resume' });
            return;
        }

        setSubmitting(true);
        const formData = new FormData();
        formData.append('jd_id', selectedJob.id);
        formData.append('resume', resumeFile);
        if (comments) formData.append('comments', comments);

        try {
            await api.post('/submissions/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage({ type: 'success', text: 'Application submitted successfully!' });
            fetchMySubmissions();
            setTimeout(() => {
                setApplyDialogOpen(false);
            }, 1500);
        } catch (error) {
            console.error('Error submitting application:', error);
            setMessage({ type: 'error', text: 'Failed to submit application' });
        } finally {
            setSubmitting(false);
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
                <h2 className="text-2xl font-bold text-slate-900">Open Positions</h2>
                <p className="text-slate-600 mt-1">{jobs.length} positions available</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                    <Card key={job.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{job.title}</CardTitle>
                                {hasApplied(job.id) && (
                                    <Badge variant="success">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Applied
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600 mt-2">
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {job.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Briefcase className="h-4 w-4" />
                                    {job.experience_required}+ Years
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {job.tech_required.map((tech) => (
                                    <Badge key={tech} variant="secondary">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                            <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                                {job.description}
                            </p>
                            <Button
                                onClick={() => handleApplyClick(job)}
                                className="w-full"
                            >
                                {hasApplied(job.id) ? 'Apply Again' : 'Apply Now'}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {jobs.length === 0 && (
                <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No open positions</h3>
                    <p className="text-slate-600">Check back later for new opportunities</p>
                </div>
            )}

            <Dialog open={applyDialogOpen} onClose={() => setApplyDialogOpen(false)}>
                <DialogHeader>
                    <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
                </DialogHeader>
                <DialogContent>
                    {message.text && (
                        <div className={`p-3 rounded-lg mb-4 flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                            }`}>
                            {message.type === 'success' ? (
                                <CheckCircle2 className="h-5 w-5" />
                            ) : (
                                <AlertCircle className="h-5 w-5" />
                            )}
                            {message.text}
                        </div>
                    )}

                    {hasApplied(selectedJob?.id) && (
                        <div className="p-3 rounded-lg mb-4 bg-blue-50 text-blue-800 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            You have already applied to this position. You can submit another application to update your resume.
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="resume">Resume (PDF/DOC/DOCX)</Label>
                            <div className="mt-2">
                                <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-slate-300 border-dashed rounded-lg appearance-none cursor-pointer hover:border-slate-400 focus:outline-none">
                                    <span className="flex items-center space-x-2">
                                        <Upload className="h-6 w-6 text-slate-600" />
                                        <span className="font-medium text-slate-600">
                                            {resumeFile ? resumeFile.name : 'Click to upload resume'}
                                        </span>
                                    </span>
                                    <input
                                        id="resume"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="comments">Comments (Optional)</Label>
                            <textarea
                                id="comments"
                                rows={3}
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
                                placeholder="Add any additional comments..."
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleApplySubmit} disabled={submitting}>
                        {submitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Application'
                        )}
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default ConsultantJobs;