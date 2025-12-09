import React, { useState, useEffect } from 'react';
import { User, Briefcase, MapPin, Mail, Phone, Star, Loader2, Users as UsersIcon, Link2, FileText, Download, GraduationCap, Award, ExternalLink } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { consultantAPI } from '../../api';

const ConsultantList = () => {
    const [consultants, setConsultants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedConsultant, setSelectedConsultant] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    useEffect(() => {
        fetchConsultants();
    }, []);

    const fetchConsultants = async () => {
        try {
            const response = await consultantAPI.getAll();
            console.log('Consultants fetched:', response.data);
            setConsultants(response.data);
        } catch (error) {
            console.error('Error fetching consultants:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (consultant) => {
        setSelectedConsultant(consultant);
        setDetailsOpen(true);
    };

    const getAvailabilityVariant = (available) => {
        return available ? 'success' : 'secondary';
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

    const handleDownloadResume = async (consultantId) => {
        try {
            const response = await fetch(`/api/consultants/${consultantId}/resume`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `resume_${selectedConsultant?.name || 'consultant'}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        } catch (error) {
            console.error('Error downloading resume:', error);
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
                <h2 className="text-2xl font-bold text-slate-900">Consultants</h2>
                <p className="text-slate-600 mt-1">{consultants.length} total consultants</p>
            </div>

            {consultants.length === 0 ? (
                <Card className="p-12">
                    <div className="text-center">
                        <UsersIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No consultants found</h3>
                        <p className="text-slate-600">Consultants will appear here once they create their profiles</p>
                    </div>
                </Card>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Experience
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Tech Stack
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Availability
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {consultants.map((consultant) => (
                                    <tr key={consultant.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <User className="h-5 w-5 text-slate-400 mr-3" />
                                                <div className="text-sm font-medium text-slate-900">
                                                    {consultant.name || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-slate-600">
                                                <Briefcase className="h-4 w-4 mr-2" />
                                                {consultant.experience_years || 0} Years
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {consultant.tech_stack && consultant.tech_stack.length > 0 ? (
                                                    <>
                                                        {consultant.tech_stack.slice(0, 3).map((tech, idx) => (
                                                            <Badge key={`${tech}-${idx}`} variant="secondary" className="text-xs">
                                                                {tech}
                                                            </Badge>
                                                        ))}
                                                        {consultant.tech_stack.length > 3 && (
                                                            <span className="text-xs text-slate-500">
                                                                +{consultant.tech_stack.length - 3}
                                                            </span>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-sm text-slate-400">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-slate-600">
                                                {consultant.location ? (
                                                    <>
                                                        <MapPin className="h-4 w-4 mr-2" />
                                                        {consultant.location}
                                                    </>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={getAvailabilityVariant(consultant.available)}>
                                                {consultant.available ? 'Available' : 'Unavailable'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewDetails(consultant)}
                                            >
                                                View Profile
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Consultant Details Dialog */}
            <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)}>
                <DialogHeader>
                    <DialogTitle>Consultant Profile: {selectedConsultant?.name || 'N/A'}</DialogTitle>
                </DialogHeader>
                <DialogContent>
                    {selectedConsultant && (
                        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                            {/* Professional Summary */}
                            {selectedConsultant.professional_summary && (
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Professional Summary</h3>
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <p className="text-sm text-slate-700 whitespace-pre-wrap">
                                            {selectedConsultant.professional_summary}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Contact Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-3">Contact Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Email</p>
                                        <div className="flex items-center text-sm text-slate-900">
                                            <Mail className="h-4 w-4 mr-2 text-slate-400" />
                                            {selectedConsultant.email || '-'}
                                        </div>
                                    </div>
                                    {selectedConsultant.phone && (
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1">Phone</p>
                                            <div className="flex items-center text-sm text-slate-900">
                                                <Phone className="h-4 w-4 mr-2 text-slate-400" />
                                                {selectedConsultant.phone}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {(selectedConsultant.linkedin_url || selectedConsultant.github_url || selectedConsultant.portfolio_url) && (
                                    <div className="mt-4">
                                        <p className="text-sm text-slate-500 mb-2">Links</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedConsultant.linkedin_url && (
                                                <a
                                                    href={selectedConsultant.linkedin_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    <Link2 className="h-4 w-4" />
                                                    LinkedIn
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            )}
                                            {selectedConsultant.github_url && (
                                                <a
                                                    href={selectedConsultant.github_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    <Link2 className="h-4 w-4" />
                                                    GitHub
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            )}
                                            {selectedConsultant.portfolio_url && (
                                                <a
                                                    href={selectedConsultant.portfolio_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    <Link2 className="h-4 w-4" />
                                                    Portfolio
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Professional Details */}
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-3">Professional Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Experience</p>
                                        <p className="text-sm text-slate-900">{selectedConsultant.experience_years || 0} Years</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Availability</p>
                                        <Badge variant={getAvailabilityVariant(selectedConsultant.available)}>
                                            {selectedConsultant.available ? 'Available' : 'Unavailable'}
                                        </Badge>
                                    </div>
                                    {selectedConsultant.location && (
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1">Location</p>
                                            <p className="text-sm text-slate-900">{selectedConsultant.location}</p>
                                        </div>
                                    )}
                                    {selectedConsultant.visa_status && (
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1">Visa Status</p>
                                            <p className="text-sm text-slate-900">{selectedConsultant.visa_status}</p>
                                        </div>
                                    )}
                                    {selectedConsultant.rating && (
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1">Rating</p>
                                            <div className="flex items-center">
                                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                                                <span className="text-sm text-slate-900">{selectedConsultant.rating}/5.0</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Education */}
                            {selectedConsultant.education && (selectedConsultant.education.degree || selectedConsultant.education.university) && (
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5" />
                                        Education
                                    </h3>
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        {selectedConsultant.education.degree && (
                                            <p className="text-sm text-slate-900 font-medium">{selectedConsultant.education.degree}</p>
                                        )}
                                        {selectedConsultant.education.university && (
                                            <p className="text-sm text-slate-700">{selectedConsultant.education.university}</p>
                                        )}
                                        {selectedConsultant.education.graduation_year && (
                                            <p className="text-sm text-slate-600">{selectedConsultant.education.graduation_year}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Certifications */}
                            {selectedConsultant.certifications && selectedConsultant.certifications.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                        <Award className="h-5 w-5" />
                                        Certifications
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedConsultant.certifications.map((cert, idx) => (
                                            <Badge key={idx} variant="secondary">
                                                {cert}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Technical Skills with Proficiency */}
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-3">Technical Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedConsultant.tech_stack && selectedConsultant.tech_stack.length > 0 ? (
                                        selectedConsultant.tech_stack.map((tech, idx) => {
                                            const proficiency = selectedConsultant.tech_stack_proficiency?.[tech] || 'Intermediate';
                                            return (
                                                <div key={`${tech}-${idx}`} className="flex items-center gap-2">
                                                    <Badge variant="secondary">{tech}</Badge>
                                                    <Badge className={`text-xs px-2 py-0.5 ${getProficiencyColor(proficiency)}`}>
                                                        {proficiency}
                                                    </Badge>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-sm text-slate-500">No skills listed</p>
                                    )}
                                </div>
                            </div>

                            {/* Resume */}
                            {selectedConsultant.resume_path && (
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Resume
                                    </h3>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleDownloadResume(selectedConsultant.user_id)}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Resume
                                    </Button>
                                </div>
                            )}

                            {/* Notes */}
                            {selectedConsultant.notes && (
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Notes</h3>
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <p className="text-sm text-slate-700 whitespace-pre-wrap">
                                            {selectedConsultant.notes}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
                <DialogFooter>
                    <Button onClick={() => setDetailsOpen(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default ConsultantList;